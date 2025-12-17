
import { GoogleGenAI } from "@google/genai";
import { QuestionData, MetricInput, IRTAnalysisResult, Language } from '../types';
import { KNOWLEDGE_BASE, getSystemInstructionGenerator, getSystemInstructionExtractor } from '../constants';

const getAIClient = () => {
  // Support VITE_API_KEY for Vite environments as requested by user.
  // Fallback to process.env for standard Node/Shim environments.
  // @ts-ignore
  const apiKey = import.meta.env.VITE_API_KEY || (typeof process !== "undefined" ? process.env.API_KEY : undefined);

  if (!apiKey) {
    throw new Error("API Key is missing. Please set VITE_API_KEY in your .env file.");
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

// Robust JSON Cleaner to handle Markdown blocks and extra text
const cleanJson = (text: string): string => {
  try {
    // Attempt to find the first '[' or '{' and the last ']' or '}'
    const firstBracket = text.indexOf('[');
    const firstBrace = text.indexOf('{');
    const lastBracket = text.lastIndexOf(']');
    const lastBrace = text.lastIndexOf('}');
    
    let startIndex = -1;
    let endIndex = -1;

    // Determine if it looks like an array or an object
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      startIndex = firstBracket;
      endIndex = lastBracket;
    } else if (firstBrace !== -1) {
      startIndex = firstBrace;
      endIndex = lastBrace;
    }

    if (startIndex !== -1 && endIndex !== -1) {
      return text.substring(startIndex, endIndex + 1);
    }
    
    // Fallback cleanup if structure isn't clear
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '');
    }
    return clean;
  } catch (e) {
    return text;
  }
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

// Helper to chunk array
const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunked: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
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
        responseMimeType: tools ? undefined : "application/json",
      },
    });
    
    const jsonStr = cleanJson(response.text || "{}");
    return JSON.parse(jsonStr) as QuestionData;
  } catch (error) {
    console.error("Error generating question:", error);
    throw new Error("Failed to generate question. Please try again.");
  }
};

// Batch Question Generation (Up to 40) - Processed in Chunks
export const generateBatchQuestions = async (batch: MetricInput[], language: Language = 'vi'): Promise<QuestionData[]> => {
  const ai = getAIClient();
  
  // Chunk size of 5 is safe for output token limits and prevents timeouts
  const CHUNK_SIZE = 5; 
  const chunks = chunkArray(batch, CHUNK_SIZE);
  let allQuestions: QuestionData[] = [];

  console.log(`Starting batch generation: ${batch.length} items in ${chunks.length} chunks.`);

  try {
    for (let i = 0; i < chunks.length; i++) {
      const currentChunk = chunks[i];
      const chunkPrompt = `
        Generate a LIST of biology questions (JSON Array) based on these requirements:
        
        ${JSON.stringify(currentChunk.map((m, idx) => ({
          index: idx + 1 + (i * CHUNK_SIZE),
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

        IMPORTANT: Return an ARRAY of ${currentChunk.length} QuestionData objects.
        DO NOT GENERATE ANY IMAGES OR IMAGE URLS FOR BATCH REQUESTS.
      `;

      // Add a small delay between chunks to avoid rate limits
      if (i > 0) await new Promise(resolve => setTimeout(resolve, 500));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: chunkPrompt }] }],
        config: {
          systemInstruction: getSystemInstructionGenerator(language),
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      });

      const jsonStr = cleanJson(response.text || "[]");
      const chunkQuestions = JSON.parse(jsonStr) as QuestionData[];
      
      if (Array.isArray(chunkQuestions)) {
        allQuestions = [...allQuestions, ...chunkQuestions];
      }
    }

    if (allQuestions.length === 0) {
      throw new Error("No questions were generated.");
    }

    return allQuestions;
  } catch (error) {
    console.error("Error generating batch:", error);
    throw new Error("Failed to generate batch questions. Please check your connection and try again.");
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

