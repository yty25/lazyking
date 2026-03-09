import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, CartesianGrid 
} from 'recharts';
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react';

const COLORS = {
  kyle: '#00ff88',
  cj: '#ff6b6b',
  baoxuan: '#4ecdc4',
  cong: '#ffe66d',
  yty: '#95e1d3',
  issac: '#dda0dd',
};

const NAMES = {
  kyle: 'Kyle',
  cj: 'CJ',
  baoxuan: '宝宣',
  cong: '聪',
  yty: 'YTY',
  issac: 'Issac',
};

export default function TimeAnalysis({ data }) {
  const [view, setView] = useState('trend');

  if (!data) return null;

  const trendData = data.trendData || [];
  const heatmapData = data.heatmapData || [];
  const weeklyRecords = data.weeklyRecords || [];

  // 准备周度柱状图数据
  const weeklyChartData = weeklyRecords.slice(-10).map(week => ({
    name: week.week.replace('2025-', 'W'),
    Kyle: week.scores.kyle || 0,
    CJ: week.scores.cj || 0,
    宝宣: week.scores.baoxuan || 0,
    聪: week.scores.cong || 0,
    YTY: week.scores.yty || 0,
    Issac: week.scores.issac || 0,
  }));

  return (
    <div className="space-y-6">
      {/* 标题和切换 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-400" />
          <span>周期透视</span>
        </h2>
        <div className="flex space-x-2">
          {[
            { id: 'trend', label: '趋势图', icon: TrendingUp },
            { id: 'weekly', label: '周榜', icon: BarChart3 },
            { id: 'heatmap', label: '热力图', icon: Calendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                view === tab.id
                  ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 趋势图 */}
      {view === 'trend' && trendData.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-white">年度积分趋势</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #333',
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
                {Object.keys(COLORS).map(user => (
                  <Line
                    key={user}
                    type="monotone"
                    dataKey={user}
                    name={NAMES[user]}
                    stroke={COLORS[user]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 周度柱状图 */}
      {view === 'weekly' && weeklyChartData.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-white">最近10周积分对比</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #333',
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
                <Bar dataKey="Kyle" fill={COLORS.kyle} />
                <Bar dataKey="CJ" fill={COLORS.cj} />
                <Bar dataKey="宝宣" fill={COLORS.baoxuan} />
                <Bar dataKey="聪" fill={COLORS.cong} />
                <Bar dataKey="YTY" fill={COLORS.yty} />
                <Bar dataKey="Issac" fill={COLORS.issac} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 热力图 */}
      {view === 'heatmap' && heatmapData.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-white">每日打卡热力图</h3>
          <p className="text-gray-400 text-sm mb-4">颜色越亮代表当天起床越早</p>
          <div className="grid grid-cols-30 gap-1">
            {heatmapData.map((day, idx) => {
              const intensity = Math.min(day.intensity / 6, 1);
              const bgColor = `rgba(0, 255, 136, ${intensity})`;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.002 }}
                  className="w-4 h-4 rounded-sm heatmap-cell cursor-pointer"
                  style={{ backgroundColor: bgColor }}
                  title={`Day ${day.day}: 最佳排名 ${day.bestRank}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 本周数据 */}
      {data.currentWeek && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-white">本周战绩</h3>
          <div className="grid grid-cols-7 gap-2">
            {data.currentWeek.weekDays?.map((day, idx) => (
              <div key={idx} className="text-center">
                <p className="text-gray-400 text-sm mb-2">{day.day}</p>
                <div className="space-y-1">
                  {Object.entries(day.rankings).map(([user, rank]) => (
                    <div
                      key={user}
                      className="text-xs py-0.5 px-1 rounded"
                      style={{
                        backgroundColor: COLORS[user] + '33',
                        color: COLORS[user],
                      }}
                    >
                      {rank}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}