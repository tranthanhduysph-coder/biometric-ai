import { GoogleGenAI } from "@google/genai";
import { QuestionData, MetricInput, IRTAnalysisResult, Language } from '../types';
import { KNOWLEDGE_BASE, getSystemInstructionGenerator, getSystemInstructionExtractor } from '../constants';

const getAIClient = () => {
  const apiKey = import.meta.env.VITE_API_KEY; 
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your .env file.");
  }
  return new GoogleGenAI({ apiKey });
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

export const generateQuestion = async (metrics: MetricInput, language: Language = 'vi'): Promise<QuestionData> => {
  const ai = getAIClient();
  const contextExamples = retrieveContext(metrics);

  const promptText = `
    Generate a biology question with the following metrics:
    - Chapter: ${metrics.chapter}
    - Content: ${metrics.content}
    - Difficulty (Bloom 6 Levels): ${metrics.difficulty}
    - Competency: ${metrics.competency}
    - Question Type: ${metrics.type}
    - Setting: ${metrics.setting}
    ${metrics.hasChart ? '- GENERATE MOCK CHART' : ''}
    ${metrics.hasImage && !metrics.imageFile ? '- DESCRIBE IMAGE & KEYWORDS' : ''}
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
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: contentParts }],
      config: {
        systemInstruction: getSystemInstructionGenerator(language),
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    const jsonStr = cleanJson(response.text || "{}");
    return JSON.parse(jsonStr) as QuestionData;
  } catch (error) {
    console.error("Error generating question:", error);
    throw new Error("Failed to generate question.");
  }
};

export const generateBatchQuestions = async (batch: MetricInput[], language: Language = 'vi'): Promise<QuestionData[]> => {
  const ai = getAIClient();
  
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
    ENSURE Difficulty follows Bloom's 6 levels.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
    Analyze the following input using Bloom's Taxonomy (6 Levels). If it contains multiple questions, return a JSON Array. If single, return JSON Object.
    
    Input:
    Question(s): ${questionText}
    Options: ${optionsText || "N/A"}
    Answer Key: ${answerKey || "N/A"}
    ${customPrompt ? `- CUSTOM INSTRUCTIONS: ${customPrompt}` : ''}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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

// ... keep generateIRTInsight as is
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