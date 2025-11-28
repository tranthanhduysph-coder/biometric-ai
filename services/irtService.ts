
import { IRTAnalysisResult, ItemAnalysis, StudentResult, ItemMetadata } from "../types";

// Helper to parse CSV
export const parseCSV = (text: string): any[] => {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {} as any);
  });
};

export const performIRTAnalysis = (
  resultsCsv: string, 
  metadataCsv: string
): IRTAnalysisResult => {
  
  // 1. Parse Data
  const rawResults = parseCSV(resultsCsv);
  const rawMetadata = parseCSV(metadataCsv);

  const metadataMap = new Map<string, ItemMetadata>();
  rawMetadata.forEach(row => {
    // Expected keys: ItemID, Topic, DifficultyLevel, Competency
    if (row.ItemID) {
      metadataMap.set(row.ItemID, {
        itemId: row.ItemID,
        topic: row.Topic || 'General',
        difficultyLevel: row.DifficultyLevel || 'Unknown',
        competency: row.Competency || 'Unknown'
      });
    }
  });

  // Extract Question IDs from the first result row (excluding StudentID)
  if (rawResults.length === 0) throw new Error("No student results found");
  const questionIds = Object.keys(rawResults[0]).filter(k => k.toLowerCase() !== 'studentid');

  // 2. Process Student Scores
  const students: StudentResult[] = rawResults.map(row => {
    let score = 0;
    const answers: Record<string, number> = {};
    questionIds.forEach(qid => {
      const val = parseInt(row[qid] || '0', 10);
      answers[qid] = val;
      score += val;
    });
    
    // Estimate Theta (Simple Logit: ln(score / (max - score)))
    // Handling perfect scores or zero scores with a small correction (0.5)
    const max = questionIds.length;
    let adjustedScore = score;
    if (score === 0) adjustedScore = 0.5;
    if (score === max) adjustedScore = max - 0.5;
    const theta = Math.log(adjustedScore / (max - adjustedScore));

    return {
      studentId: row.StudentID || 'Unknown',
      answers,
      rawScore: score,
      theta: parseFloat(theta.toFixed(3))
    };
  });

  // 3. Item Analysis
  const items: ItemAnalysis[] = questionIds.map(qid => {
    const correctCount = students.filter(s => s.answers[qid] === 1).length;
    const pVal = correctCount / students.length;

    // Point-Biserial Correlation (Discrimination)
    const meanTotal = students.reduce((sum, s) => sum + s.rawScore, 0) / students.length;
    const stdDevTotal = Math.sqrt(students.reduce((sum, s) => sum + Math.pow(s.rawScore - meanTotal, 2), 0) / students.length);
    
    const correctStudents = students.filter(s => s.answers[qid] === 1);
    const meanCorrect = correctStudents.length > 0 
      ? correctStudents.reduce((sum, s) => sum + s.rawScore, 0) / correctStudents.length
      : 0;

    // Formula: Rpbis = ((M1 - Mt) / St) * sqrt(p / q)
    // Note: Technically should use (M1 - M0) formula, but this is a standard approximation for large N
    const pBis = stdDevTotal === 0 ? 0 : ((meanCorrect - meanTotal) / stdDevTotal) * Math.sqrt(pVal / (1 - pVal));

    // IRT Difficulty (b) estimate using inverse logit of p-value (inverted because higher p = easier)
    // b = ln((1-p)/p)
    let adjustedP = pVal;
    if (pVal === 0) adjustedP = 0.01;
    if (pVal === 1) adjustedP = 0.99;
    const b = Math.log((1 - adjustedP) / adjustedP);

    return {
      itemId: qid,
      metadata: metadataMap.get(qid),
      pVal: parseFloat(pVal.toFixed(3)),
      pBis: parseFloat(pBis.toFixed(3)),
      b: parseFloat(b.toFixed(3))
    };
  });

  // 4. Calculate Reliability (Cronbach's Alpha)
  const k = questionIds.length;
  const itemVarsSum = items.reduce((sum, item) => sum + (item.pVal * (1 - item.pVal)), 0);
  const scores = students.map(s => s.rawScore);
  const totalVar = scores.reduce((sum, s) => sum + Math.pow(s - (scores.reduce((a,b)=>a+b,0)/scores.length), 2), 0) / scores.length;
  
  const alpha = totalVar === 0 ? 0 : (k / (k - 1)) * (1 - (itemVarsSum / totalVar));

  // 5. Summary Stats
  const rawScores = students.map(s => s.rawScore);
  const meanScore = rawScores.reduce((a, b) => a + b, 0) / rawScores.length;
  const stdDev = Math.sqrt(rawScores.reduce((sum, s) => sum + Math.pow(s - meanScore, 2), 0) / rawScores.length);

  return {
    reliability: parseFloat(alpha.toFixed(3)),
    items,
    students: students.sort((a,b) => b.theta - a.theta), // Sort by ability high to low
    summary: {
      meanScore: parseFloat(meanScore.toFixed(2)),
      stdDev: parseFloat(stdDev.toFixed(2)),
      nStudents: students.length,
      nItems: items.length
    }
  };
};
