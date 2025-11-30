import { QuestionData, COMPETENCY_MAP, Language } from './types';

// ... (Giữ nguyên phần LOCALE_DATA, MAPPINGS, CURRICULUM_STRUCTURE như cũ) ...
// (Tôi chỉ hiển thị phần thay đổi ở cuối file để ngắn gọn, bạn giữ nguyên phần trên)

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
    difficulty: "Mức độ nhận thức (Bloom)",
    qType: "Loại câu hỏi",
    context: "Bối cảnh",
    customPrompt: "Yêu cầu thêm (Custom Prompt)",
    imageOptions: "Tùy chọn Hình ảnh & Biểu đồ",
    uploadImg: "Tải ảnh lên",
    changeImg: "Thay đổi hình ảnh",
    autoImg: "Tự tìm hình ảnh minh họa",
    mockChart: "Tạo biểu đồ giả lập",
    quantity: "Số lượng câu hỏi (1-5)",
    addToBank: "Thêm vào hàng đợi",
    generateAction: "Tạo Câu Hỏi",
    queueTitle: "Hàng đợi (Bộ câu hỏi)",
    clearQueue: "Xóa hết",
    generating: "Đang khởi tạo...",
    exportDocx: "Xuất file PDF",
    
    // Bloom Values
    diffRem: "Ghi nhớ",
    diffUnd: "Hiểu",
    diffApp: "Vận dụng",
    diffAna: "Phân tích",
    diffEva: "Đánh giá",
    diffCre: "Sáng tạo",
    
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
    exportCsv: "Xuất file CSV",

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
    difficulty: "Cognitive Level (Bloom)",
    qType: "Question Type",
    context: "Context/Setting",
    customPrompt: "Custom Prompt",
    imageOptions: "Image & Chart Options",
    uploadImg: "Upload Image",
    changeImg: "Change Image",
    autoImg: "Auto-find Illustration",
    mockChart: "Generate Mock Chart",
    quantity: "Quantity (1-5)",
    addToBank: "Add to Queue",
    generateAction: "Generate Questions",
    queueTitle: "Queue (Question Bank)",
    clearQueue: "Clear All",
    generating: "Generating...",
    exportDocx: "Export PDF",

    // Bloom Values
    diffRem: "Remember",
    diffUnd: "Understand",
    diffApp: "Apply",
    diffAna: "Analyze",
    diffEva: "Evaluate",
    diffCre: "Create",

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
    exportCsv: "Export CSV",

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

export const DIFFICULTY_MAPPING: Record<string, string> = {
  "Ghi nhớ": "diffRem", "Remember": "diffRem",
  "Hiểu": "diffUnd", "Understand": "diffUnd",
  "Vận dụng": "diffApp", "Apply": "diffApp",
  "Phân tích": "diffAna", "Analyze": "diffAna",
  "Đánh giá": "diffEva", "Evaluate": "diffEva",
  "Sáng tạo": "diffCre", "Create": "diffCre"
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

export const CURRICULUM_STRUCTURE: Record<Language, Record<string, string[]>> = {
  vi: {
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
  },
  en: {
    "Grade 10 - Introduction & Cell Biology": [
      "Overview of Biology Curriculum",
      "Levels of Biological Organization",
      "Chemical Composition of Cells",
      "Cell Structure (Prokaryotic, Eukaryotic)",
      "Metabolism and Energy Transformation",
      "Cell Communication",
      "Cell Cycle and Cell Division",
      "Cell Technology",
      "Enzyme Technology"
    ],
    "Grade 10 - Microorganisms & Viruses": [
      "Microorganisms (Concepts, Nutrition, Growth)",
      "Viruses and Applications",
      "Microbial Technology",
      "Immunity and Infectious Diseases"
    ],
    "Grade 11 - Metabolism & Energy": [
      "Water and Mineral Exchange in Plants",
      "Photosynthesis in Plants",
      "Respiration in Plants",
      "Nutrition and Digestion in Animals",
      "Respiration in Animals",
      "Circulation and Transport in Animals",
      "Excretion and Homeostasis"
    ],
    "Grade 11 - Response, Growth & Reproduction": [
      "Response in Plants",
      "Response in Animals (Behavior, Nervous System)",
      "Growth and Development in Plants",
      "Growth and Development in Animals",
      "Reproduction in Plants",
      "Reproduction in Animals"
    ],
    "Grade 12 - Genetics": [
      "Genes and Genetic Information Transmission",
      "Regulation of Gene Expression",
      "Gene Mutations",
      "Gene Technology",
      "Chromosomes and Chromosomal Mutations",
      "Extranuclear Inheritance",
      "Laws of Inheritance (Mendel, Morgan)",
      "Population Genetics",
      "Human Genetics"
    ],
    "Grade 12 - Evolution": [
      "Evidence of Evolution",
      "Mechanisms of Evolution (Darwin, Modern Synthesis)",
      "Origin and Development of Life",
      "Human Evolution"
    ],
    "Grade 12 - Ecology": [
      "Environment and Ecological Factors",
      "Population Ecology",
      "Community Ecology",
      "Ecosystems",
      "Biosphere and Environmental Protection"
    ]
  }
};

export const COMPETENCY_MAP: Record<Language, Record<string, string>> = {
  vi: {
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
  },
  en: {
    "NT1": "Identify, list, state, and name objects, concepts, laws, and biological processes.",
    "NT2": "Present characteristics, roles, and mechanisms using various forms of expression (language, diagrams, images).",
    "NT3": "Classify living objects and phenomena according to criteria.",
    "NT4": "Analyze characteristics, structures, mechanisms, and processes logically.",
    "NT5": "Compare and select objects, concepts, and mechanisms based on criteria.",
    "NT6": "Explain relationships between objects and phenomena (cause-effect, structure-function).",
    "TH1": "Propose problems: ask questions, analyze contexts.",
    "TH2": "Formulate judgments and construct research hypotheses.",
    "TH3": "Plan implementation: build content frameworks, select methods.",
    "TH4": "Implement plans: collect data, experiment, investigate.",
    "TH5": "Write, present reports, and discuss results.",
    "VD1": "Explain practice: explain and evaluate phenomena in nature and life.",
    "VD2": "Demonstrate appropriate behavior/attitude: propose and implement solutions for health protection, environment, and sustainable development."
  }
};

export const KNOWLEDGE_BASE: QuestionData[] = [
  {
    "QID": 1,
    "Question": "Ở tế bào nhân thực, cấu trúc nào sau đây đóng vai trò kiểm soát sự vận chuyển các chất đi vào và đi ra khỏi tế bào?",
    "Learning Objective": "Nhận biết vai trò của màng sinh chất trong việc điều hòa trao đổi chất giữa tế bào với môi trường.",
    "Competency": "NT1",
    "Difficulty": "Ghi nhớ",
    "Content": "Vận chuyển các chất qua màng sinh chất",
    "Setting": "Lý thuyết",
    "Chapter": "Sinh học tế bào",
    "options": "A. Ti thể.  B. Màng sinh chất.  C. Lưới nội chất.  D. Bộ máy Golgi.",
    "Answer": "B. Màng sinh chất",
    "Explaination": "Màng sinh chất (hay còn gọi là màng tế bào) là một cấu trúc bao bọc bên ngoài tế bào, có chức năng chính là kiểm soát sự vận chuyển các chất ra vào tế bào.",
    "Type of Question": "Multiple choices"
  }
];

export const getSystemInstructionGenerator = (lang: Language) => `
You are an expert Biology Curriculum Developer for the Vietnamese High School Education program (MOET).
Your task is to generate high-quality biology questions based on specific metrics provided by the user.

**OUTPUT LANGUAGE REQUIREMENT:**
- The ENTIRE content of the question, options, explanation, and metadata MUST be in **${lang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}**.

**Competency Codes Reference:**
${Object.entries(COMPETENCY_MAP[lang]).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

**Bloom's Taxonomy (6 Levels):**
1. **Remember / Ghi nhớ**: Recall facts and basic concepts.
2. **Understand / Hiểu**: Explain ideas or concepts.
3. **Apply / Vận dụng**: Use information in new situations.
4. **Analyze / Phân tích**: Draw connections among ideas.
5. **Evaluate / Đánh giá**: Justify a stand or decision.
6. **Create / Sáng tạo**: Produce new or original work.

**Strict Competency & Difficulty Mapping:**
- **NT1**: Difficulty must be **"Ghi nhớ"** (Remember) or **"Hiểu"** (Understand).
- **NT2, NT3**: Difficulty must be **"Hiểu"** (Understand) or **"Vận dụng"** (Apply).
- **NT4, NT5, NT6**: Difficulty must be **"Vận dụng"** (Apply) or **"Phân tích"** (Analyze).
- **TH1-TH5**: Difficulty must be **"Phân tích"** (Analyze) or **"Đánh giá"** (Evaluate).
- **VD1, VD2**: Difficulty must be **"Đánh giá"** (Evaluate) or **"Sáng tạo"** (Create).

**Context/Setting Rules:**
1. **Lý thuyết**: Focus on definitions, concepts.
2. **Thực hành thí nghiệm**: Focus on experimental setup, results.
3. **Bối cảnh giả định**: Hypothetical scenario.
4. **Bối cảnh thực tế**: Find/reference a real-world issue and cite the SOURCE.
5. **Có tính toán**: Require mathematical calculation.

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
  "imageKeywords": "...",
  "imageDescription": "..."
}
`;

export const getSystemInstructionExtractor = (lang: Language) => `
You are an expert Biology Curriculum Developer.
Your task is to analyze Biology questions and reverse-engineer their curricular metrics based on the VN MOET curriculum.

**OUTPUT LANGUAGE REQUIREMENT:**
- All analysis output (Learning Objective, Explanation, etc.) MUST be in **${lang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}**.

**Competency Codes Reference:**
${Object.entries(COMPETENCY_MAP[lang]).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

**Difficulty Level (Bloom's Taxonomy - 6 Levels):**
Analyze the cognitive demand and assign one of the following exactly based on language:
${lang === 'vi' 
  ? '- "Ghi nhớ"\n- "Hiểu"\n- "Vận dụng"\n- "Phân tích"\n- "Đánh giá"\n- "Sáng tạo"' 
  : '- "Remember"\n- "Understand"\n- "Apply"\n- "Analyze"\n- "Evaluate"\n- "Create"'}

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