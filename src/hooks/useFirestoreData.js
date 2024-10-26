// src/hooks/useFirestoreData.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

export const useFirestoreData = (userId) => {
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentPomodoros, setRecentPomodoros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayTotal, setTodayTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);
  const [dailyStats, setDailyStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const categoriesRef = collection(db, `users/${userId}/categories`);
        const pomodorosRef = collection(db, `users/${userId}/pomodoros`);
        
        // シンプルなクエリに変更
        const pomodorosQuery = query(
          pomodorosRef,
          where('mode', '==', 'work')
        );

        // データ取得
        const [categoriesSnapshot, pomodorosSnapshot] = await Promise.all([
          getDocs(categoriesRef),
          getDocs(pomodorosQuery)
        ]);

        const categories = {};
        const pomodoros = [];
        let todayCount = 0;
        let weekCount = 0;
        const dailyData = {};

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        // カテゴリーの処理
        categoriesSnapshot.forEach(doc => {
          categories[doc.id] = {
            id: doc.id,
            name: doc.data().name,
            totalPomodoros: 0,
            totalMinutes: 0,
            todayPomodoros: 0,
            weekPomodoros: 0
          };
        });

        // ポモドーロデータの処理
        pomodorosSnapshot.docs
          .sort((a, b) => b.data().startTime?.toDate() - a.data().startTime?.toDate())
          .forEach(doc => {
            const data = doc.data();
            const startTime = data.startTime?.toDate();
            
            if (startTime) {
              const startDate = new Date(startTime);
              startDate.setHours(0, 0, 0, 0);
              const dateKey = startDate.toISOString().split('T')[0];
              
              if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                  date: dateKey,
                  count: 0,
                  minutes: 0
                };
              }
              dailyData[dateKey].count += 1;
              dailyData[dateKey].minutes += data.duration || 0;

              const pomodoroData = {
                id: doc.id,
                ...data,
                startTime,
                endTime: data.endTime?.toDate()
              };
              pomodoros.push(pomodoroData);

              if (categories[data.categoryId]) {
                categories[data.categoryId].totalPomodoros += 1;
                categories[data.categoryId].totalMinutes += data.duration || 0;

                if (startTime >= today) {
                  categories[data.categoryId].todayPomodoros += 1;
                  todayCount += 1;
                }
                if (startTime >= weekAgo) {
                  categories[data.categoryId].weekPomodoros += 1;
                  weekCount += 1;
                }
              }
            }
          });

        const sortedDailyStats = Object.values(dailyData)
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-7);

        const sortedCategoryStats = Object.values(categories)
          .filter(cat => cat.totalPomodoros > 0)
          .sort((a, b) => b.totalMinutes - a.totalMinutes);

        // 状態の更新
        setCategoryStats(sortedCategoryStats);
        setDailyStats(sortedDailyStats);
        setRecentPomodoros(pomodoros.slice(0, 10));
        setTodayTotal(todayCount);
        setWeekTotal(weekCount);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return {
    categoryStats,
    recentPomodoros,
    loading,
    todayTotal,
    weekTotal,
    dailyStats,
    error
  };
};