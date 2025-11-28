import firebase from "firebase/compat/app"; // Import từ compat
import { db, isFirebaseConfigured } from "../firebaseConfig";
import { QuestionData, IRTAnalysisResult } from "../types";

// Helper to simulate saving
const simulateSave = (data: any, type: string) => {
  console.log(`[DEMO MODE] Saving ${type} to Cloud (Simulated):`, data);
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      alert(`[DEMO] Saved ${type} successfully! (Check Console for data)`);
      resolve();
    }, 500);
  });
};

// Save a generated Question Bank
export const saveQuestionBankToCloud = async (userId: string, title: string, questions: QuestionData[]) => {
  const payload = {
    userId,
    title,
    questions: JSON.stringify(questions),
    createdAt: new Date(),
    questionCount: questions.length
  };

  if (!isFirebaseConfigured || !db) {
    return simulateSave(payload, "Question Bank");
  }

  try {
    await db.collection("question_banks").add({
      ...payload,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    alert("Saved to Cloud successfully!");
  } catch (e) {
    console.error("Error saving document: ", e);
    // Fallback if DB permission denied or configured incorrectly
    simulateSave(payload, "Question Bank (Fallback)");
  }
};

// Save IRT Analysis Result
export const saveIRTAnalysisToCloud = async (userId: string, analysis: IRTAnalysisResult) => {
  const payload = {
    userId,
    reliability: analysis.reliability,
    summary: analysis.summary,
    timestamp: new Date()
  };

  if (!isFirebaseConfigured || !db) {
    return simulateSave(payload, "IRT Analysis");
  }

  try {
    await db.collection("irt_analyses").add({
      ...payload,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("Analysis saved to Cloud!");
  } catch (e) {
    console.error("Error saving analysis: ", e);
    simulateSave(payload, "IRT Analysis (Fallback)");
  }
};