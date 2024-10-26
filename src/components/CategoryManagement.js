import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../auth/AuthProvider";

function CategoryManagement() {
  const { currentUser } = useAuth();
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#FF0000");

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    try {
      const categoriesRef = collection(db, `users/${currentUser.uid}/categories`);
      await addDoc(categoriesRef, {
        name: categoryName,
        color: categoryColor,
        createdAt: serverTimestamp()
      });
      
      setCategoryName("");
      // 成功通知を表示
    } catch (error) {
      console.error("Error adding category:", error);
      // エラー通知を表示
    }
  };

  return (
    <form onSubmit={handleAddCategory} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          カテゴリー名
        </label>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          カラー
        </label>
        <input
          type="color"
          value={categoryColor}
          onChange={(e) => setCategoryColor(e.target.value)}
          className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
      >
        カテゴリーを追加
      </button>
    </form>
  );
}

export default CategoryManagement;