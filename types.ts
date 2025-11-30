export type Language = 'vi' | 'en';
export type Theme = 'light' | 'dark';

export interface SubMetric {
  id: string; // a, b, c, d
  statement: string;
  difficulty: string;
  competency: string;
  answer: string; // True/False
}

export interface ChartConfig {
  type: 'bar' | 'line';
  title: string;
  labels: string[];
  values: number[];
  xLabel: string;
  yLabel: string;
}

// Cập nhật thang đo Bloom 6 mức độ
export type BloomDifficulty = 
  | "Ghi nhớ" | "Hiểu" | "Vận dụng" | "Phân tích" | "Đánh giá" | "Sáng tạo"
  | "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";

export interface QuestionData {
  QID?: number;
  Question: string;
  "Learning Objective": string;
  Competency: string;
  Difficulty: BloomDifficulty;
  Content: string;
  Setting: string;
  Chapter: string;
  options: string;
  Answer: string;
  Explaination: string;
  "Type of Question": "Multiple choices" | "True/ False" | "Short response" | "Free answer" | "Essay";
  sub_metrics?: SubMetric[];
  chartConfig?: ChartConfig;
  imageDescription?: string;
  imageKeywords?: string;
}

export interface MetricInput {
  id?: string;
  chapter: string;
  content: string;
  difficulty: string;
  competency: string;
  type: string;
  setting: string;
  customPrompt?: string; 
  hasChart?: boolean; 
  hasImage?: boolean; 
  imageFile?: File | null; // Note: File objects cannot be saved to localStorage easily
}

export interface BatchItem {
  id: string;
  metrics: MetricInput;
}

export enum AppMode {
  GENERATOR = 'GENERATOR',
  EXTRACTOR = 'EXTRACTOR',
  IRT = 'IRT',
}

// IRT Related Types
export interface StudentResult {
  studentId: string;
  answers: Record<string, number>; 
  rawScore: number;
  theta: number; 
  abilityClass?: string;
}

export interface ItemMetadata {
  itemId: string;
  topic: string;
  difficultyLevel: string;
  competency: string;
}

export interface ItemAnalysis {
  itemId: string;
  metadata?: ItemMetadata;
  pVal: number; 
  pBis: number; 
  b: number;
  diffLabel?: string;
  discLabel?: string; 
}

export interface IRTAnalysisResult {
  reliability: number; 
  items: ItemAnalysis[];
  students: StudentResult[];
  summary: {
    meanScore: number;
    stdDev: number;
    nStudents: number;
    nItems: number;
  };
}