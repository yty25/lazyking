import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Calendar, Zap, ScrollText, Crown, Upload, 
  TrendingUp, Users, Clock, ChevronRight 
} from 'lucide-react';
import { parseExcelData, USERS } from './dataParser';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'leaderboard', label: '实时总榜', icon: Trophy },
    { id: 'time', label: '周期透视', icon: Calendar },
    { id: 'events', label: '特殊事件', icon: Zap },
    { id: 'rules', label: '规则中心', icon: ScrollText },
    { id: 'hall', label: '荣誉墙', icon: Crown },
  ];

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const parsedData = parseExcelData(workbook);
      
      if (parsedData) {
        setData(parsedData);
      } else {
        setError('解析文件失败，请检查文件格式');
      }
    } catch (err) {
      console.error('File parse error:', err);
      setError('文件读取失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 max-w-md"
          >
            <Upload className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-white mb-4">上传数据文件</h2>
            <p className="text-gray-400 mb-6">
              请上传包含起床打卡数据的 Excel 文件 (.xlsx) 开始使用
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                选择文件
              </div>
            </label>
            {loading && (
              <div className="mt-6">
                <div className="spinner mx-auto"></div>
                <p className="text-gray-400 mt-3">正在解析...</p>
              </div>
            )}
            {error && (
              <p className="mt-4 text-red-400">{error}</p>
            )}
          </motion.div>
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <div className="min-h-screen text-white">
      <Header data={data} onUpload={handleFileUpload} />
      
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
        {renderContent()}
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