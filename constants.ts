
import { QuestionData, COMPETENCY_MAP, Language } from './types';

// Localization Data
export const LOCALE_DATA: Record<Language, Record<string, string>> = {
  vi: {
    appTitle: "BioMetric AI",
    appDesc: "Công cụ đánh giá giáo dục & Tạo câu hỏi thông minh",
    tabGenerator: "Tạo câu hỏi",
    tabExtractor: "Dịch ngược Metrics",
    tabIRT: "Phân tích IRT",
    
    // Auth
    login: "Đăng nhập",
    register: "Đăng ký",
    email: "Địa chỉ Email",
    password: "Mật khẩu",
    or: "Hoặc",
    googleLogin: "Tiếp tục với Google",
    demoLogin: "Vào chế độ Demo",
    noAccount: "Chưa có tài khoản?",
    haveAccount: "Đã có tài khoản?",
    signUpNow: "Đăng ký ngay",
    signInNow: "Đăng nhập ngay",
    
    // Generator
    configTitle: "Cấu hình câu hỏi",
    chapter: "Chủ đề / Chương",
    content: "Nội dung chi tiết",
    competency: "Năng lực",
    difficulty: "Mức độ",
    qType: "Loại câu hỏi",
    context: "Bối cảnh",
    customPrompt: "Yêu cầu thêm (Custom Prompt)",
    imageOptions: "Tùy chọn Hình ảnh & Biểu đồ",
    uploadImg: "Tải ảnh lên",
    changeImg: "Thay đổi hình ảnh",
    autoImg: "Tự tìm hình ảnh minh họa (Google Search)",
    mockChart: "Tạo biểu đồ giả lập",
    quantity: "Số lượng câu hỏi (1-5)",
    addToBank: "Thêm vào Bộ câu hỏi",
    generateBank: "Tạo Bộ câu hỏi",
    generateSingle: "Tạo ngay",
    queueTitle: "Bộ câu hỏi đang chờ",
    clearQueue: "Xóa hết",
    generating: "Đang khởi tạo...",
    
    // Values
    diffNB: "Nhận biết",
    diffTH: "Thông hiểu",
    diffVD: "Vận dụng",
    diffVDC: "Vận dụng cao",
    
    typeMCQ: "Trắc nghiệm (Multiple Choice)",
    typeTF: "Đúng/Sai (PISA)",
    typeShort: "Trả lời ngắn (Số)",
    typeEssay: "Tự luận (Essay)",
    typeFree: "Trả lời tự do",

    settingTheory: "Lý thuyết",
    settingLab: "Thực hành thí nghiệm",
    settingHypo: "Bối cảnh giả định",
    settingReal: "Bối cảnh thực tế (Có trích nguồn)",
    settingCalc: "Có tính toán (Yêu cầu số liệu)",

    // Extractor
    extractorTitle: "Dịch ngược câu hỏi (Reverse Engineering)",
    inputQuestion: "Nội dung câu hỏi",
    inputOptions: "Các phương án",
    inputKey: "Đáp án / Hướng dẫn chấm",
    extractorPlaceholder: "Dán một hoặc nhiều câu hỏi vào đây...",
    optionsPlaceholder: "A... B... C... D...",
    analyze: "Phân tích Metrics",
    analyzing: "Đang phân tích...",
    
    // IRT
    irtTitle: "Phân tích Đề thi & IRT",
    resultsCsv: "Dữ liệu kết quả (Results CSV)",
    metaCsv: "Ma trận đề (Metadata CSV)",
    analyzeData: "Phân tích Dữ liệu",
    calculating: "Đang tính toán...",
    aiReport: "Đánh giá Sư phạm từ AI",
    itemMap: "Bản đồ chất lượng câu hỏi",
    abilityDist: "Phổ năng lực học sinh",

    // Footer
    devBy: "Phát triển bởi",
    devName: "ThS. Trần Thanh Duy",
    emailLabel: "Email",
    aiWarning: "Trang web này sử dụng AI tạo sinh.",
    viewDisclaimer: "Xem Cảnh báo & Miễn trừ trách nhiệm",
    copyright: "© 2025 BIOGEN EXAM SYSTEM",
    disclaimerTitle: "Cảnh báo & Miễn trừ Trách nhiệm",
    disclaimerContent: "Nền tảng này sử dụng mô hình ngôn ngữ lớn (AI) để cung cấp các gợi ý và phản hồi. Các thông tin do AI tạo ra chỉ mang tính chất tham khảo, hỗ trợ học tập và không thể thay thế cho kiến thức chuyên môn, sự phán đoán của giảng viên hoặc các hướng dẫn học thuật chính thức.\n\nNgười biên soạn (Trần Thanh Duy) không chịu trách nhiệm về bất kỳ sự sai lệch, thiếu sót, hoặc hậu quả nào phát sinh từ việc sử dụng các thông tin do AI cung cấp. Người dùng có trách nhiệm tự kiểm tra, đối chiếu và chịu trách nhiệm cuối cùng cho sản phẩm học thuật (đề cương, bài báo...) của mình. Luôn luôn tham khảo ý kiến của giảng viên hướng dẫn.",
    close: "Đã hiểu",
  },
  en: {
    appTitle: "BioMetric AI",
    appDesc: "Educational Assessment & Smart Question Generation Tool",
    tabGenerator: "Question Generator",
    tabExtractor: "Reverse Engineering",
    tabIRT: "IRT Analysis",

    // Auth
    login: "Login",
    register: "Register",
    email: "Email Address",
    password: "Password",
    or: "Or",
    googleLogin: "Continue with Google",
    demoLogin: "Enter Demo Mode",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    signUpNow: "Sign up now",
    signInNow: "Sign in now",

    // Generator
    configTitle: "Question Configuration",
    chapter: "Topic / Chapter",
    content: "Detailed Content",
    competency: "Competency",
    difficulty: "Difficulty Level",
    qType: "Question Type",
    context: "Context/Setting",
    customPrompt: "Custom Prompt",
    imageOptions: "Image & Chart Options",
    uploadImg: "Upload Image",
    changeImg: "Change Image",
    autoImg: "Auto-find Illustration (Google Search)",
    mockChart: "Generate Mock Chart",
    quantity: "Quantity (1-5)",
    addToBank: "Add to Queue",
    generateBank: "Generate Batch",
    generateSingle: "Generate Now",
    queueTitle: "Question Queue",
    clearQueue: "Clear All",
    generating: "Generating...",

    // Values
    diffNB: "Knowing",
    diffTH: "Understanding",
    diffVD: "Application",
    diffVDC: "High Application",

    typeMCQ: "Multiple Choice",
    typeTF: "True/False (PISA)",
    typeShort: "Short Response (Numeric)",
    typeEssay: "Essay",
    typeFree: "Free Answer",

    settingTheory: "Theoretical",
    settingLab: "Experimental/Lab",
    settingHypo: "Hypothetical Scenario",
    settingReal: "Real-world (Cite Source)",
    settingCalc: "Computational (Data required)",

    // Extractor
    extractorTitle: "Reverse Engineering",
    inputQuestion: "Question Content",
    inputOptions: "Options",
    inputKey: "Answer Key / Grading Guide",
    extractorPlaceholder: "Paste one or multiple questions here...",
    optionsPlaceholder: "A... B... C... D...",
    analyze: "Analyze Metrics",
    analyzing: "Analyzing...",

    // IRT
    irtTitle: "Test & IRT Analysis",
    resultsCsv: "Results Data (CSV)",
    metaCsv: "Item Matrix (CSV)",
    analyzeData: "Analyze Data",
    calculating: "Calculating...",
    aiReport: "AI Pedagogical Insight",
    itemMap: "Item Quality Map",
    abilityDist: "Student Ability Distribution",

    // Footer
    devBy: "Developed by",
    devName: "MSc. Tran Thanh Duy",
    emailLabel: "Email",
    aiWarning: "This website uses Generative AI.",
    viewDisclaimer: "View Warning & Disclaimer",
    copyright: "© 2025 BIOGEN EXAM SYSTEM",
    disclaimerTitle: "Warning & Disclaimer",
    disclaimerContent: "This platform uses Large Language Models (AI) to provide suggestions and feedback. Information generated by AI is for reference and educational support only and cannot replace professional knowledge, instructor judgment, or official academic guidelines.\n\nThe author (Tran Thanh Duy) is not responsible for any inaccuracies, omissions, or consequences arising from the use of information provided by AI. Users are responsible for verifying, cross-referencing, and taking final responsibility for their academic products (outlines, papers...). Always consult your instructor.",
    close: "Understood",
  }
};

// Mappings for Translation
export const DIFFICULTY_MAPPING: Record<string, string> = {
  "Nhận biết": "diffNB",
  "Thông hiểu": "diffTH",
  "Vận dụng": "diffVD",
  "Vận dụng cao": "diffVDC"
};

export const TYPE_MAPPING: Record<string, string> = {
  "Multiple choices": "typeMCQ",
  "True/ False": "typeTF",
  "Short response": "typeShort",
  "Essay": "typeEssay",
  "Free answer": "typeFree"
};

export const SETTING_MAPPING: Record<string, string> = {
  "Lý thuyết": "settingTheory",
  "Thực hành thí nghiệm": "settingLab",
  "Bối cảnh giả định": "settingHypo",
  "Bối cảnh thực tế": "settingReal",
  "Có tính toán": "settingCalc"
};

export const CURRICULUM_STRUCTURE: Record<string, string[]> = {
  "Lớp 10 - Giới thiệu & Tế bào": [
    "Giới thiệu khái quát chương trình môn Sinh học",
    "Các cấp độ tổ chức của thế giới sống",
    "Thành phần hoá học của tế bào",
    "Cấu trúc tế bào (Nhân sơ, Nhân thực)",
    "Trao đổi chất và chuyển hoá năng lượng ở tế bào",
    "Thông tin giữa các tế bào",
    "Chu kì tế bào và phân bào",
    "Công nghệ tế bào",
    "Công nghệ enzyme"
  ],
  "Lớp 10 - Vi sinh vật & Virus": [
    "Vi sinh vật (Khái niệm, Dinh dưỡng, Sinh trưởng)",
    "Virus và các ứng dụng",
    "Công nghệ vi sinh vật",
    "Miễn dịch và bệnh truyền nhiễm"
  ],
  "Lớp 11 - Trao đổi chất & Chuyển hóa năng lượng": [
    "Trao đổi nước và khoáng ở thực vật",
    "Quang hợp ở thực vật",
    "Hô hấp ở thực vật",
    "Dinh dưỡng và tiêu hoá ở động vật",
    "Hô hấp ở động vật",
    "Tuần hoàn và vận chuyển chất ở động vật",
    "Bài tiết và cân bằng nội môi"
  ],
  "Lớp 11 - Cảm ứng, Sinh trưởng & Sinh sản": [
    "Cảm ứng ở thực vật",
    "Cảm ứng ở động vật (Tập tính, Hệ thần kinh)",
    "Sinh trưởng và phát triển ở thực vật",
    "Sinh trưởng và phát triển ở động vật",
    "Sinh sản ở thực vật",
    "Sinh sản ở động vật"
  ],
  "Lớp 12 - Di truyền học": [
    "Gene và cơ chế truyền thông tin di truyền",
    "Điều hoà biểu hiện gene",
    "Đột biến gene",
    "Công nghệ gene",
    "Nhiễm sắc thể và đột biến nhiễm sắc thể",
    "Di truyền gene ngoài nhân",
    "Quy luật di truyền (Mendel, Morgan)",
    "Di truyền quần thể",
    "Di truyền học người"
  ],
  "Lớp 12 - Tiến hoá": [
    "Các bằng chứng tiến hoá",
    "Cơ chế tiến hoá (Học thuyết Darwin, Tổng hợp hiện đại)",
    "Sự phát sinh và phát triển sự sống",
    "Sự phát sinh loài người"
  ],
  "Lớp 12 - Sinh thái học": [
    "Môi trường và các nhân tố sinh thái",
    "Sinh thái học quần thể",
    "Sinh thái học quần xã",
    "Hệ sinh thái",
    "Sinh quyển và bảo vệ môi trường"
  ]
};

export const KNOWLEDGE_BASE: QuestionData[] = [
  {
    "QID": 1,
    "Question": "Ở tế bào nhân thực, cấu trúc nào sau đây đóng vai trò kiểm soát sự vận chuyển các chất đi vào và đi ra khỏi tế bào?",
    "Learning Objective": "Nhận biết vai trò của màng sinh chất trong việc điều hòa trao đổi chất giữa tế bào với môi trường.",
    "Competency": "NT1: Nhận biết, kể tên, phát biểu, nêu được các đối tượng, khái niệm, quy luật, quá trình sống.",
    "Difficulty": "Nhận biết",
    "Content": "Vận chuyển các chất qua màng sinh chất",
    "Setting": "Lý thuyết",
    "Chapter": "Sinh học tế bào",
    "options": "A. Ti thể.  B. Màng sinh chất.  C. Lưới nội chất.  D. Bộ máy Golgi.",
    "Answer": "B. Màng sinh chất",
    "Explaination": "Màng sinh chất (hay còn gọi là màng tế bào) là một cấu trúc bao bọc bên ngoài tế bào, có chức năng chính là kiểm soát sự vận chuyển các chất ra vào tế bào.",
    "Type of Question": "Multiple choices"
  }
];

// Dynamic System Instructions based on Language
export const getSystemInstructionGenerator = (lang: Language) => `
You are an expert Biology Curriculum Developer for the Vietnamese High School Education program (MOET).
Your task is to generate high-quality biology questions based on specific metrics provided by the user.

**OUTPUT LANGUAGE REQUIREMENT:**
- The ENTIRE content of the question, options, explanation, and metadata MUST be in **${lang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}**.

**Competency Codes Reference:**
${Object.entries(COMPETENCY_MAP).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

**Strict Competency & Difficulty Mapping (CRITICAL):**
1. **NT1**: Difficulty must be **"Nhận biết"** (Knowing).
2. **TH (TH1-TH5)**: Difficulty must be **"Thông hiểu"** (Understanding) or higher.
3. **TH4, TH5, VD1, VD2**: Difficulty must be **"Vận dụng"** (Application) or **"Vận dụng cao"** (High Application).

**Context/Setting Rules:**
1. **Lý thuyết**: Focus on definitions, concepts.
2. **Thực hành thí nghiệm**: Focus on experimental setup, results.
3. **Bối cảnh giả định**: Hypothetical scenario.
4. **Bối cảnh thực tế (Real-world)**: MUST find/reference a real-world biological issue/event and mention the SOURCE.
5. **Có tính toán**: MUST require mathematical calculation (probability, population size, etc.).

**Image & Chart Handling (VERY IMPORTANT):**
1. **NO IMAGE REQUESTED**: If the user has NOT checked "Auto-find Illustration" (hasImage=false), you MUST NOT generate any 'imageUrl' or 'imageSource' fields. Leave them undefined. Do not describe an image if not asked.
2. **IMAGE REQUESTED (hasImage=true)**: Use the Google Search tool to find a VALID, REAL-WORLD image URL (ending in .jpg, .png, etc.) from a reputable source (Wikipedia, Wikimedia, ScienceDirect, etc.).
   - Set 'imageUrl' to the direct link of the image found.
   - Set 'imageSource' to the title/domain of the source.
3. **Mock Chart (hasChart=true)**: Provide data in 'chartConfig'.

**Question Type Constraints:**
1. **True/ False (PISA Style):** Context + 4 statements (a, b, c, d) increasing difficulty.
2. **Short response:** Numeric answer only (max 4 chars).

**Output Format:**
Return JSON object (or Array of Objects for batch).
{
  "Question": "...",
  "Learning Objective": "...",
  "Competency": "...",
  "Difficulty": "...",
  "Content": "...",
  "Setting": "...",
  "Chapter": "...",
  "options": "...",
  "Answer": "...",
  "Explaination": "...",
  "Type of Question": "...",
  "chartConfig": { ... },
  "imageUrl": "...", 
  "imageSource": "..."
}
`;

export const getSystemInstructionExtractor = (lang: Language) => `
You are an expert Biology Curriculum Developer.
Your task is to analyze Biology questions and reverse-engineer their curricular metrics based on the VN MOET curriculum.

**OUTPUT LANGUAGE REQUIREMENT:**
- All analysis output (Learning Objective, Explanation, etc.) MUST be in **${lang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}**.

**Competency Codes Reference:**
${Object.entries(COMPETENCY_MAP).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

**Handling True/False (PISA Style):**
- If the question involves 4 statements (a, b, c, d):
- You MUST analyze EACH statement as a separate sub-metric.
- Return a "sub_metrics" array.

**Output Format:**
Return JSON object (or Array of Objects for batch).
{
  "Learning Objective": "...",
  "Competency": "...",
  "Difficulty": "...",
  "Content": "...",
  "Chapter": "...",
  "Setting": "...",
  "Type of Question": "...",
  "Explaination": "...",
  "sub_metrics": [ ... ]
}
`;
