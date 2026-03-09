import { motion } from 'framer-motion';
import { Crown, Trophy, Medal } from 'lucide-react';

export default function HallOfShame({ data }) {
  if (!data) return null;

  const lazyKings = data.lazyKings || {};
  const weeklyRecords = data.weeklyRecords || [];

  // 从周度记录中提取懒觉王历史
  const lazyKingHistory = weeklyRecords
    .filter(week => week.lazyKing)
    .slice(-20)
    .reverse();

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center space-x-3">
        <Crown className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">懒觉王荣誉墙</h2>
        <span className="text-2xl">😴</span>
      </div>

      {/* 年度懒觉王 */}
      {lazyKings.yearly && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 text-center border-2 border-yellow-500/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            👑
          </motion.div>
          
          <h3 className="text-xl text-gray-400 mb-2">2025 年度懒觉王</h3>
          <p className="text-4xl font-bold text-yellow-400 mb-4">
            {data.users.find(u => u.id === lazyKings.yearly.lazyKing)?.name || lazyKings.yearly.lazyKing}
          </p>
          
          <div className="inline-block bg-yellow-500/20 border border-yellow-500/50 rounded-full px-6 py-2">
            <span className="text-yellow-300">🏆 金色枕头奖杯得主</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
            {lazyKings.yearly.scores && Object.entries(lazyKings.yearly.scores)
              .sort((a, b) => a[1] - b[1])
              .slice(0, 3)
              .map(([user, score], idx) => (
                <div key={user} className="text-center">
                  <p className="text-gray-500 text-sm">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                  </p>
                  <p className="text-white font-medium">
                    {data.users.find(u => u.id === user)?.name || user}
                  </p>
                  <p className="text-gray-500 text-sm">{score} 分</p>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* 季度懒觉王 */}
      {lazyKings.quarters && lazyKings.quarters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lazyKings.quarters.map((quarter, idx) => (
            <motion.div
              key={quarter.quarter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-xl p-5 text-center card-hover"
            >
              <div className="text-3xl mb-2">🛏️</div>
              <h4 className="text-gray-400 text-sm mb-1">{quarter.quarter}</h4>
              <p className="text-xl font-bold text-red-400">
                {quarter.lazyKing || '待定'}
              </p>
              <p className="text-gray-500 text-xs mt-1">季度懒觉王</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* 周度懒觉王历史 */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4 text-white flex items-center space-x-2">
          <Medal className="w-5 h-5 text-gray-400" />
          <span>周度懒觉王记录 (最近20周)</span>
        </h3>

        {lazyKingHistory.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {lazyKingHistory.map((week, idx) => (
              <motion.div
                key={week.week}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center"
              >
                <p className="text-gray-500 text-xs mb-1">{week.week}</p>
                <p className="text-red-300 font-semibold">{week.lazyKing}</p>
                {week.punishment && (
                  <p className="text-gray-500 text-xs mt-1 truncate" title={week.punishment}>
                    {week.punishment.slice(0, 10)}...
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">暂无周度记录</p>
        )}
      </div>

      {/* 趣味统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '最多周懒觉王', value: 'ISSAC', count: '10次', icon: '😴' },
          { label: '最多日冠军', value: 'YTY', count: '100+次', icon: '🏆' },
          { label: '最长连续P1', value: 'Kyle', count: '5天', icon: '🔥' },
          { label: '最佳进步奖', value: '待统计', count: '', icon: '📈' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-xl p-4 text-center"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
            {stat.count && <p className="text-gray-500 text-sm">{stat.count}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}