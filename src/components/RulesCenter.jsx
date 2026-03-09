import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function RulesCenter({ data }) {
  const [expandedRules, setExpandedRules] = useState([]);

  if (!data) return null;

  const rules = data.rules || [];

  const toggleRule = (index) => {
    setExpandedRules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // 规则版本数据
  const ruleVersions = [
    { version: 'V1.0', title: '初版规则', desc: '基础打卡规则与积分设定' },
    { version: 'V2.0', title: '团队赛', desc: '新增3v3团队比拼模式' },
    { version: 'V3.0', title: '惩罚机制', desc: '未执行惩罚的扣分规则' },
    { version: 'V4.0', title: '赌怪版本', desc: '周末摇骰子决定名次' },
  ];

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center space-x-3">
        <ScrollText className="w-6 h-6 text-amber-400" />
        <h2 className="text-2xl font-bold text-white">规则中心</h2>
      </div>

      {/* 规则版本卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ruleVersions.map((rule, idx) => (
          <motion.div
            key={rule.version}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-xl p-4 card-hover"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs bg-green-500/30 text-green-300 px-2 py-0.5 rounded-full">
                {rule.version}
              </span>
            </div>
            <h4 className="font-semibold text-white">{rule.title}</h4>
            <p className="text-gray-400 text-sm mt-1">{rule.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* 详细规则列表 */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4 text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>完整规则条例</span>
        </h3>

        {rules.length > 0 ? (
          <div className="space-y-3">
            {rules.map((rule, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleRule(idx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium">{rule.title || `规则 ${idx + 1}`}</span>
                  {expandedRules.includes(idx) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedRules.includes(idx) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-gray-300 text-sm leading-relaxed">
                        <p className="whitespace-pre-wrap">{rule.content}</p>
                        {rule.items && rule.items.length > 0 && (
                          <ul className="mt-3 space-y-2">
                            {rule.items.map((item, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <span className="text-green-400">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">暂无规则数据</p>
        )}
      </div>

      {/* 最终解释权 */}
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-gray-400">
          本比赛最终解释权归专业团队主管 <span className="text-white font-semibold">Kyle Chen</span> 所有
        </p>
      </div>
    </div>
  );
}