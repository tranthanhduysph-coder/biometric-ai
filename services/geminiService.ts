
import { GoogleGenAI } from "@google/genai";
import { QuestionData, MetricInput, IRTAnalysisResult, Language } from '../types';
import { KNOWLEDGE_BASE, getSystemInstructionGenerator, getSystemInstructionExtractor } from '../constants';

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const cleanJson = (text: string): string => {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '');
  }
  return clean;
};

const retrieveContext = (metrics: MetricInput, limit: number = 3): QuestionData[] => {
  const scoredItems = KNOWLEDGE_BASE.map(item => {
    let score = 0;
    if (item.Chapter === metrics.chapter) score += 5;
    if (item.Content === metrics.content) score += 3;
    if (item.Difficulty === metrics.difficulty) score += 2;
    if (item.Competency.startsWith(metrics.competency)) score += 2;
    if (item["Type of Question"] === metrics.type) score += 1;
    return { item, score };
  });

  scoredItems.sort((a, b) => b.score - a.score);
  return scoredItems.slice(0, limit).map(i => i.item);
};

// Single Question Generation
export const generateQuestion = async (metrics: MetricInput, language: Language = 'vi'): Promise<QuestionData> => {
  const ai = getAIClient();
  const contextExamples = retrieveContext(metrics);

  // Activate Search Tool only if user requests an image
  const tools = metrics.hasImage && !metrics.imageFile ? [{ googleSearch: {} }] : undefined;

  const promptText = `
    Generate a biology question with the following metrics:
    - Chapter: ${metrics.chapter}
    - Content: ${metrics.content}
    - Difficulty: ${metrics.difficulty}
    - Competency: ${metrics.competency}
    - Question Type: ${metrics.type}
    - Setting: ${metrics.setting}
    ${metrics.hasChart ? '- GENERATE MOCK CHART data.' : ''}
    ${metrics.hasImage && !metrics.imageFile ? '- IMPORTANT: Use Google Search to find a REAL URL for a relevant illustration image. Return it in "imageUrl" and the source in "imageSource".' : '- DO NOT generate any image data or description.'}
    ${metrics.imageFile ? '- ANALYZE UPLOADED IMAGE' : ''}
    ${metrics.customPrompt ? `- CUSTOM: ${metrics.customPrompt}` : ''}

    RAG Context:
    ${JSON.stringify(contextExamples)}
  `;

  try {
    let contentParts: any[] = [{ text: promptText }];
    if (metrics.imageFile) {
      contentParts.push(await fileToGenerativePart(metrics.imageFile));
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: contentParts }],
      config: {
        tools: tools,
        systemInstruction: getSystemInstructionGenerator(language),
        temperature: 0.7,
        responseMimeType: tools ? undefined : "application/json", // MIME type not compatible with tools in some cases, but usually okay. If tools used, output might be text that needs parsing, but flash usually adheres to JSON instruction.
      },
    });
    
    // If using tools, the response might contain grounding metadata, we need to extract text and parse.
    // However, since we asked for JSON in system instruction, Flash usually wraps it in ```json blocks even with tools.
    const jsonStr = cleanJson(response.text || "{}");
    return JSON.parse(jsonStr) as QuestionData;
  } catch (error) {
    console.error("Error generating question:", error);
    throw new Error("Failed to generate question. Please try again.");
  }
};

// Batch Question Generation (Up to 40)
export const generateBatchQuestions = async (batch: MetricInput[], language: Language = 'vi'): Promise<QuestionData[]> => {
  const ai = getAIClient();
  
  // Disable image search for batch to prevent rate limits and speed up generation
  const promptText = `
    Generate a LIST of biology questions (JSON Array) based on these requirements:
    
    ${JSON.stringify(batch.map((m, i) => ({
      index: i + 1,
      metrics: {
        chapter: m.chapter,
        content: m.content,
        difficulty: m.difficulty,
        competency: m.competency,
        type: m.type,
        setting: m.setting,
        custom: m.customPrompt
      }
    })))}

    IMPORTANT: Return an ARRAY of ${batch.length} QuestionData objects.
    DO NOT GENERATE ANY IMAGES OR IMAGE URLS FOR BATCH REQUESTS.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      config: {
        systemInstruction: getSystemInstructionGenerator(language),
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    const jsonStr = cleanJson(response.text || "[]");
    return JSON.parse(jsonStr) as QuestionData[];
  } catch (error) {
    console.error("Error generating batch:", error);
    throw new Error("Failed to generate batch questions.");
  }
};

export const extractMetrics = async (
  questionText: string, 
  optionsText?: string, 
  answerKey?: string, 
  customPrompt?: string,
  language: Language = 'vi'
): Promise<Partial<QuestionData> | Partial<QuestionData>[]> => {
  const ai = getAIClient();

  const prompt = `
    Analyze the following input. If it contains multiple questions, return a JSON Array. If single, return JSON Object.
    
    Input:
    Question(s): ${questionText}
    Options: ${optionsText || "N/A"}
    Answer Key: ${answerKey || "N/A"}
    ${customPrompt ? `- CUSTOM INSTRUCTIONS: ${customPrompt}` : ''}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstructionExtractor(language),
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    const jsonStr = cleanJson(response.text || "{}");
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error extracting metrics:", error);
    throw new Error("Failed to extract metrics.");
  }
};

export const generateIRTInsight = async (analysis: IRTAnalysisResult, language: Language = 'vi'): Promise<string> => {
  const ai = getAIClient();
  const itemsSummary = analysis.items.map(i => ({
    id: i.itemId,
    topic: i.metadata?.topic,
    difficulty_stat: i.pVal,
    discrimination: i.pBis
  }));

  const prompt = `
    You are an expert Educational Psychometrician. 
    Output Language: ${language === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.
    
    Analyze Test Data:
    - Reliability (Alpha): ${analysis.reliability}
    - Mean Score: ${analysis.summary.meanScore} / ${analysis.summary.nItems}
    - Items: ${JSON.stringify(itemsSummary)}

    Provide concise pedagogical report:
    1. Overall quality.
    2. Problematic questions.
    3. Recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.5 },
    });
    return response.text || "Could not generate insight.";
  } catch (error) {
    return "Error generating analysis report.";
  }
};
