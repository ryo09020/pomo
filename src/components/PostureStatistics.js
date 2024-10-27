// components/PostureStatistics.js
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const COLORS = {
  good: '#10B981',      // 緑
  catSpain: '#EF4444',  // 赤
  shallowSitting: '#F59E0B', // 黄色
  distorting: '#6366F1'  // 青
};

const PostureStatistics = ({ sessions }) => {
  // 姿勢データの集計
  const stats = useMemo(() => {
    if (!sessions?.length) return null;

    // 全セッションの姿勢スコアを集計
    const totalStats = sessions.reduce((acc, session) => {
      if (session.poseScore) {
        acc.good += session.poseScore.good || 0;
        acc.catSpain += session.poseScore.catSpain || 0;
        acc.shallowSitting += session.poseScore.shallowSitting || 0;
        acc.distorting += session.poseScore.distorting || 0;
      }
      return acc;
    }, {
      good: 0,
      catSpain: 0,
      shallowSitting: 0,
      distorting: 0
    });

    // 日付ごとの集計
    const dailyStats = sessions.reduce((acc, session) => {
      const date = new Date(session.startTime.seconds * 1000).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          date,
          good: 0,
          catSpain: 0,
          shallowSitting: 0,
          distorting: 0
        };
      }
      if (session.poseScore) {
        acc[date].good += session.poseScore.good || 0;
        acc[date].catSpain += session.poseScore.catSpain || 0;
        acc[date].shallowSitting += session.poseScore.shallowSitting || 0;
        acc[date].distorting += session.poseScore.distorting || 0;
      }
      return acc;
    }, {});

    return {
      total: totalStats,
      daily: Object.values(dailyStats).slice(-7) // 直近7日間のデータ
    };
  }, [sessions]);

  // 円グラフ用データの準備
  const pieData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: '良好な姿勢', value: stats.total.good, color: COLORS.good },
      { name: '猫背', value: stats.total.catSpain, color: COLORS.catSpain },
      { name: '浅座り', value: stats.total.shallowSitting, color: COLORS.shallowSitting },
      { name: '体の歪み', value: stats.total.distorting, color: COLORS.distorting }
    ].filter(item => item.value > 0);
  }, [stats]);

  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">姿勢分析</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 総合スコア */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">総合スコア</h3>
          <div className="aspect-square">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="90%"
                  label={({ name, percent }) => 
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 日別推移 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">日別推移</h3>
          <div className="aspect-square">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="good" name="良好な姿勢" fill={COLORS.good} stackId="a" />
                <Bar dataKey="catSpain" name="猫背" fill={COLORS.catSpain} stackId="a" />
                <Bar dataKey="shallowSitting" name="浅座り" fill={COLORS.shallowSitting} stackId="a" />
                <Bar dataKey="distorting" name="体の歪み" fill={COLORS.distorting} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 詳細スコア */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">姿勢スコアの詳細</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">良好な姿勢</p>
              <p className="text-2xl font-bold text-green-700">{stats.total.good}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">猫背</p>
              <p className="text-2xl font-bold text-red-700">{stats.total.catSpain}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">浅座り</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.total.shallowSitting}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600">体の歪み</p>
              <p className="text-2xl font-bold text-indigo-700">{stats.total.distorting}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostureStatistics;
