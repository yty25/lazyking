import { motion } from 'framer-motion';
import { Zap, Gift, Clock } from 'lucide-react';

export default function EventsItems({ data }) {
  if (!data) return null;

  const items = data.items || [];
  const punishments = data.punishments || [];

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center space-x-3">
        <Zap className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">特殊事件与道具</h2>
      </div>

      {/* 道具使用记录 */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4 text-white flex items-center space-x-2">
          <Gift className="w-5 h-5 text-yellow-400" />
          <span>道具使用记录</span>
        </h3>
        
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="event-dot mt-1.5" />
                <div className="flex-1">
                  <p className="text-white font-medium">{item.description}</p>
                  <div className="flex items-center space-x-3 mt-1 text-sm text-gray-400">
                    {item.date && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.date}</span>
                      </span>
                    )}
                    {item.user && <span>用户: {item.user}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">暂无道具使用记录</p>
        )}
      </div>

      {/* 惩罚机制 */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4 text-white flex items-center space-x-2">
          <span className="text-2xl">🎮</span>
          <span>惩罚项目池</span>
        </h3>
        
        {punishments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {punishments.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20"
              >
                <p className="text-white">{p.punishment}</p>
                {p.proposer && (
                  <p className="text-gray-500 text-sm mt-1">提议人: {p.proposer}</p>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">暂无惩罚项目</p>
        )}
      </div>

      {/* 道具卡说明 */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4 text-white">道具卡说明</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: '早起券', desc: '当日直接成为P1', color: 'from-green-500 to-emerald-500', icon: '🎫' },
            { name: '交换卡', desc: '随机与一人交换名次', color: 'from-blue-500 to-cyan-500', icon: '🔄' },
            { name: '捣蛋卡', desc: '随机交换两人的名次', color: 'from-purple-500 to-pink-500', icon: '😈' },
            { name: '平等券', desc: '选择一人与你同排名', color: 'from-yellow-500 to-orange-500', icon: '🤝' },
            { name: '小姐牌', desc: '懒觉王时拉人陪罚', color: 'from-red-500 to-pink-500', icon: '👸' },
            { name: '洗牌卡', desc: '全员名次随机重排', color: 'from-gray-500 to-slate-500', icon: '🎰' },
          ].map((card, idx) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-xl bg-gradient-to-r ${card.color} bg-opacity-20`}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <h4 className="font-semibold text-white">{card.name}</h4>
              <p className="text-gray-300 text-sm mt-1">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}