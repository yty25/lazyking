import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Calendar, Zap, ScrollText, Crown
} from 'lucide-react';
import { parseExcelData, USERS } from './dataParser';
import { getEmbeddedWorkbook } from './data/embeddedData';
import Leaderboard from './components/Leaderboard';
import TimeAnalysis from './components/TimeAnalysis';
import EventsItems from './components/EventsItems';
import RulesCenter from './components/RulesCenter';
import HallOfShame from './components/HallOfShame';
import Header from './components/Header';
import HeroStats from './components/HeroStats';

function App() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'leaderboard', label: '实时总榜', icon: Trophy },
    { id: 'time', label: '周期透视', icon: Calendar },
    { id: 'events', label: '特殊事件', icon: Zap },
    { id: 'rules', label: '规则中心', icon: ScrollText },
    { id: 'hall', label: '荣誉墙', icon: Crown },
  ];

  // 应用启动时直接加载嵌入式数据
  useEffect(() => {
    try {
      const workbook = getEmbeddedWorkbook();
      const parsedData = parseExcelData(workbook);
      
      if (parsedData) {
        setData(parsedData);
      } else {
        setError('数据解析失败');
      }
    } catch (err) {
      console.error('Data load error:', err);
      setError('数据加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载中状态
  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">正在加载数据...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <p className="text-gray-400">请刷新页面重试</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <Header data={data} />
      
      {data && <HeroStats data={data} />}
      
      {data && (
        <div className="sticky top-0 z-40 glass border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex space-x-1 py-3 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border border-green-500/50'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'leaderboard' && <Leaderboard data={data} />}
            {activeTab === 'time' && <TimeAnalysis data={data} />}
            {activeTab === 'events' && <EventsItems data={data} />}
            {activeTab === 'rules' && <RulesCenter data={data} />}
            {activeTab === 'hall' && <HallOfShame data={data} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p className="flex items-center justify-center space-x-2">
            <span>WakeUp Rank</span>
            <span>•</span>
            <span>起床大乱斗</span>
            <span>•</span>
            <span>2025</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;