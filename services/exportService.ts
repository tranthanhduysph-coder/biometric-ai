import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { QuestionData, IRTAnalysisResult } from "../types";

// Helper to download blob
const saveFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Helper to load font for Vietnamese support
const loadVietnameseFont = async (doc: jsPDF) => {
  try {
    // Fetch a base64 string or a font file. Using a CDN for Roboto Regular.
    const fontUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf";
    const response = await fetch(fontUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise<void>((resolve) => {
      reader.onloadend = () => {
        const base64data = (reader.result as string).split(',')[1];
        doc.addFileToVFS("Roboto-Regular.ttf", base64data);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        doc.setFont("Roboto");
        resolve();
      };
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("Could not load Vietnamese font, falling back to standard font.", e);
  }
};

export const exportIRTToCSV = (analysis: IRTAnalysisResult) => {
  try {
    if (!analysis || !analysis.items) {
      throw new Error("No analysis data available to export.");
    }

    // 1. Item Analysis CSV
    const itemHeaders = ["ItemID", "Topic", "Competency", "P_Value", "Rpbis_Discrimination", "b_Difficulty_IRT"];
    const itemRows = analysis.items.map(item => [
      item.itemId,
      `"${item.metadata?.topic || "N/A"}"`,
      item.metadata?.competency || "N/A",
      item.pVal.toFixed(3),
      item.pBis.toFixed(3),
      item.b.toFixed(3)
    ]);

    const itemCsvContent = [
      itemHeaders.join(','),
      ...itemRows.map(row => row.join(','))
    ].join('\n');

    // 2. Student Analysis CSV
    const studentHeaders = ["StudentID", "RawScore", "Theta"];
    const studentRows = analysis.students.map(s => [
      s.studentId,
      s.rawScore,
      s.theta.toFixed(3)
    ]);

    const studentCsvContent = [
      studentHeaders.join(','),
      ...studentRows.map(row => row.join(','))
    ].join('\n');

    const combinedCsv = `--- ITEM ANALYSIS ---\n${itemCsvContent}\n\n--- STUDENT ANALYSIS ---\n${studentCsvContent}`;
    const blob = new Blob([combinedCsv], { type: 'text/csv;charset=utf-8;' });
    saveFile(blob, `IRT_Analysis_${Date.now()}.csv`);

  } catch (error: any) {
    console.error("Export CSV Error:", error);
    alert(`CSV Export Failed: ${error.message}`);
  }
};

export const exportQuestionsToPDF = async (questions: Partial<QuestionData>[], title: string = "Question Bank") => {
  try {
    if (!questions || questions.length === 0) {
      throw new Error("No questions to export.");
    }

    const doc = new jsPDF();
    
    // Load font for Vietnamese support
    await loadVietnameseFont(doc);

    // Title
    doc.setFontSize(18);
    doc.text(title, 105, 20, { align: "center" });
    
    let yPos = 30;

    questions.forEach((q, index) => {
      // Check page break
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Question Header
      doc.setFontSize(12);
      doc.setFont("Roboto", "bold"); // Use bold if font supports, otherwise normal
      doc.text(`Câu ${index + 1}: [${q.Competency || 'N/A'}] - ${q.Difficulty || ''}`, 14, yPos);
      yPos += 7;

      // Content
      doc.setFont("Roboto", "normal");
      doc.setFontSize(11);
      const splitQuestion = doc.splitTextToSize(q.Question || "", 180);
      doc.text(splitQuestion, 14, yPos);
      yPos += splitQuestion.length * 5 + 5;

      // Options
      if (q.options) {
        const splitOptions = doc.splitTextToSize(q.options, 180);
        doc.text(splitOptions, 14, yPos);
        yPos += splitOptions.length * 5 + 5;
      }

      // PISA Sub-metrics
      if (q.sub_metrics && q.sub_metrics.length > 0) {
        q.sub_metrics.forEach(sub => {
          if (yPos > 270) { doc.addPage(); yPos = 20; }
          doc.text(`- ${sub.id}) ${sub.statement} [${sub.difficulty}] -> ${sub.answer}`, 18, yPos);
          yPos += 6;
        });
        yPos += 5;
      }

      // Answer & Explanation
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.setFont("Roboto", "bold"); // Simulate bold
      doc.setTextColor(0, 100, 0);
      doc.text(`Đáp án: ${q.Answer || "N/A"}`, 14, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 6;

      if (q.Explaination) {
        doc.setFont("Roboto", "normal");
        const splitExpl = doc.splitTextToSize(`Giải thích: ${q.Explaination}`, 180);
        doc.text(splitExpl, 14, yPos);
        yPos += splitExpl.length * 5 + 5;
      }

      // Metrics Table using autoTable
      const tableData = [
        ["Chapter", q.Chapter || ""],
        ["Content", q.Content || ""],
        ["Objective", q["Learning Objective"] || ""],
        ["Context", q.Setting || ""]
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: tableData,
        theme: 'grid',
        styles: { font: "Roboto", fontSize: 9 },
        headStyles: { fillColor: [70, 70, 70] },
        margin: { left: 14, right: 14 }
      });

      // Update yPos after table
      yPos = (doc as any).lastAutoTable.finalY + 15;
    });

    doc.save(`BioMetric_Bank_${Date.now()}.pdf`);

  } catch (error: any) {
    console.error("Export PDF Error:", error);
    alert(`Export Failed: ${error.message}`);
  }
};