// src/firebase/helpers.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS, getUserCollectionPath } from "./types";

/**
 * 新しいポモドーロを記録
 */
export const createPomodoro = async (userId, pomodoroData) => {
  try {
    const pomodorosRef = collection(db, getUserCollectionPath(userId, COLLECTIONS.POMODOROS));
    const data = {
      startTime: serverTimestamp(),
      endTime: serverTimestamp(),
      categoryId: pomodoroData.categoryId,
      categoryName: pomodoroData.categoryName,
      taskName: pomodoroData.taskName,
      duration: pomodoroData.duration,
      mode: pomodoroData.mode,
    };
    
    return await addDoc(pomodorosRef, data);
  } catch (error) {
    console.error("Error creating pomodoro:", error);
    throw error;
  }
};

/**
 * 新しいカテゴリーを作成
 */
export const createCategory = async (userId, categoryName) => {
  try {
    const categoriesRef = collection(db, getUserCollectionPath(userId, COLLECTIONS.CATEGORIES));
    const data = {
      name: categoryName,
      createdAt: serverTimestamp(),
    };
    
    return await addDoc(categoriesRef, data);
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};