import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';

export default function Leaderboard({ data }) {
  if (!data || !data.leaderboard || data.leaderboard.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        暂无排行数据
      </div>
    );
  }

  const leaderboard = data.leaderboard;
  const lazyKing = data.lazyKings?.yearly?.lazyKing;

  return (
    <div className="space-y-6">
      {/* 排行榜标题 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <span>实时总榜</span>
        </h2>
        <p className="text-gray-400 text-sm">
          共 {data.dailyRecords?.length || 0} 天数据
        </p>
      </div>

      {/* 排行榜列表 */}
      <div className="space-y-3">
        {leaderboard.map((user, index) => {
          const isLazyKing = user.id === lazyKing;
          const isTop3 = index < 3;
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`glass rounded-2xl p-5 card-hover ${
                isLazyKing ? 'border-2 border-red-500/50 animate-pulse-glow' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* 排名 */}
                  <div className="w-12 h-12 flex items-center justify-center">
                    {index === 0 && <Crown className="w-8 h-8 text-yellow-400" />}
                    {index === 1 && <Medal className="w-7 h-7 text-gray-300" />}
                    {index === 2 && <Medal className="w-7 h-7 text-amber-600" />}
                    {index > 2 && (
                      <span className="text-xl font-bold text-gray-500">#{index + 1}</span>
                    )}
                  </div>

                  {/* 头像和名字 */}
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: user.color + '33' }}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-lg">{user.name}</span>
                        {isLazyKing && (
                          <span className="text-xs bg-red-500/30 text-red-300 px-2 py-0.5 rounded-full">
                            懒觉王
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">
                        日冠军 {user.firstPlaces} 次
                      </p>
                    </div>
                  </div>
                </div>

                {/* 积分 */}
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: user.color }}>
                    {user.totalScore}
                  </p>
                  <p className="text-gray-500 text-sm">平均 {user.avgScore} 分/天</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 积分规则说明 */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4 text-white">积分规则</h3>
        <div className="grid grid-cols-6 gap-3 text-center">
          {[
            { rank: 1, score: 10, color: 'from-yellow-400 to-amber-500' },
            { rank: 2, score: 7, color: 'from-gray-300 to-gray-400' },
            { rank: 3, score: 5, color: 'from-amber-600 to-amber-700' },
            { rank: 4, score: 3, color: 'from-blue-400 to-blue-500' },
            { rank: 5, score: 2, color: 'from-purple-400 to-purple-500' },
            { rank: 6, score: 1, color: 'from-pink-400 to-pink-500' },
          ].map(item => (
            <div key={item.rank} className="glass rounded-xl p-3">
              <div className={`w-8 h-8 mx-auto rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center font-bold text-black mb-2`}>
                {item.rank}
              </div>
              <p className="text-lg font-semibold text-white">{item.score}</p>
              <p className="text-xs text-gray-500">积分</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}