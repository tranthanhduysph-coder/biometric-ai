
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

export interface QuestionData {
  QID?: number;
  Question: string;
  "Learning Objective": string;
  Competency: string;
  Difficulty: "Nhận biết" | "Thông hiểu" | "Vận dụng" | "Vận dụng cao";
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
  id?: string; // For queue tracking
  chapter: string;
  content: string;
  difficulty: string;
  competency: string;
  type: string;
  setting: string;
  customPrompt?: string; 
  hasChart?: boolean; 
  hasImage?: boolean; 
  imageFile?: File | null;
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

// Competency Dictionary
export const COMPETENCY_MAP: Record<string, string> = {
  "NT1": "Nhận biết, kể tên, phát biểu, nêu được các đối tượng, khái niệm, quy luật, quá trình sống.",
  "NT2": "Trình bày được các đặc điểm, vai trò, cơ chế bằng các hình thức biểu đạt (ngôn ngữ, sơ đồ, hình ảnh).",
  "NT3": "Phân loại được các đối tượng, hiện tượng sống theo các tiêu chí.",
  "NT4": "Phân tích được các đặc điểm, cấu trúc, cơ chế, quá trình theo logic nhất định.",
  "NT5": "So sánh, lựa chọn được các đối tượng, khái niệm, cơ chế dựa theo các tiêu chí.",
  "NT6": "Giải thích được mối quan hệ giữa các sự vật và hiện tượng (nguyên nhân – kết quả, cấu tạo – chức năng).",
  "TH1": "Đề xuất vấn đề: đặt câu hỏi, phân tích bối cảnh.",
  "TH2": "Đưa ra phán đoán và xây dựng giả thuyết nghiên cứu.",
  "TH3": "Lập kế hoạch thực hiện: xây dựng khung nội dung, lựa chọn phương pháp.",
  "TH4": "Thực hiện kế hoạch: thu thập dữ liệu, thực nghiệm, điều tra.",
  "TH5": "Viết, trình bày báo cáo và thảo luận kết quả.",
  "VD1": "Giải thích thực tiễn: giải thích, đánh giá các hiện tượng trong tự nhiên và đời sống.",
  "VD2": "Có hành vi, thái độ thích hợp: đề xuất, thực hiện giải pháp bảo vệ sức khoẻ, môi trường, phát triển bền vững."
};
