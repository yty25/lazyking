import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Clock, Users } from 'lucide-react';

export default function HeroStats({ data }) {
  if (!data) return null;

  const leaderboard = data.leaderboard || [];
  const currentWeek = data.currentWeek;
  const lazyKing = data.lazyKings?.yearly?.lazyKing;

  // 今日最早起床者（最新记录的第一名）
  const todayFirst = leaderboard.find(u => u.firstPlaces > 0);
  
  // 本周积分王
  const weekTop = currentWeek?.totalScores 
    ? Object.entries(currentWeek.totalScores).sort((a, b) => b[1] - a[1])[0] 
    : null;

  const stats = [
    {
      icon: Trophy,
      label: '年度积分王',
      value: leaderboard[0]?.name || '-',
      subValue: `${leaderboard[0]?.totalScore || 0} 分`,
      color: 'from-yellow-500 to-orange-500',
      glow: 'neon-orange'
    },
    {
      icon: TrendingUp,
      label: '本周积分王',
      value: weekTop ? data.users.find(u => u.id === weekTop[0])?.name : '-',
      subValue: weekTop ? `${weekTop[1]} 分` : '-',
      color: 'from-green-500 to-emerald-500',
      glow: 'neon-green'
    },
    {
      icon: Clock,
      label: '总打卡天数',
      value: data.dailyRecords?.length || 0,
      subValue: '天',
      color: 'from-blue-500 to-cyan-500',
      glow: 'neon-purple'
    },
    {
      icon: Users,
      label: '参赛人数',
      value: 6,
      subValue: '人',
      color: 'from-purple-500 to-pink-500',
      glow: 'neon-purple'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass rounded-2xl p-5 card-hover ${stat.glow}`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-gray-400" />
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} opacity-20`} />
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-gray-500 text-sm">{stat.subValue}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}