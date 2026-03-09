import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

export default function Header({ data }) {
  return (
    <header className="glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-3xl"
            >
              ⏰
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">WakeUp Rank</h1>
              <p className="text-gray-400 text-sm">起床大乱斗 · 2025赛季</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {data && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center space-x-2 bg-red-500/20 border border-red-500/50 rounded-full px-4 py-2"
              >
                <Crown className="w-4 h-4 text-yellow-400 animate-shake" />
                <span className="text-sm font-medium">
                  年度懒觉王: <span className="text-yellow-400">{data.lazyKings?.yearly?.lazyKing || '待定'}</span>
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}