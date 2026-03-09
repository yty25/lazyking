// Data Parser for WakeUp Rank
// 解析 Excel 数据并转换为应用所需格式

import * as XLSX from 'xlsx';

// 积分规则
const SCORE_MAP = { 1: 10, 2: 7, 3: 5, 4: 3, 5: 2, 6: 1, 0: 0 };

// 用户信息
export const USERS = [
  { id: 'kyle', name: 'Kyle', color: '#00ff88', avatar: '🦁' },
  { id: 'cj', name: 'CJ', color: '#ff6b6b', avatar: '🐯' },
  { id: 'baoxuan', name: '宝宣', color: '#4ecdc4', avatar: '🐻' },
  { id: 'cong', name: '聪', color: '#ffe66d', avatar: '🦊' },
  { id: 'yty', name: 'YTY', color: '#95e1d3', avatar: '🐼' },
  { id: 'issac', name: 'Issac', color: '#dda0dd', avatar: '🐺' },
];

// Excel header 名字到 user id 的映射
const HEADER_TO_ID = {
  'kyle': 'kyle',
  'cj': 'cj',
  '宝宣': 'baoxuan',
  '聪': 'cong',
  'yty': 'yty',
  'issac': 'issac',
  'issacneverfail': 'issac',
};

// 解析每日记录 Sheet
export function parseDailyRecords(data) {
  if (!data || data.length < 2) return [];
  
  const headers = data[0];
  const records = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 6) continue;
    
    const dayRecord = {
      date: i,
      rankings: {}
    };
    
    headers.forEach((user, idx) => {
      const rank = row[idx];
      if (typeof rank === 'number' && !isNaN(rank)) {
        // 使用映射表转换 header 名字到 user id
        const headerName = String(user).trim();
        const userId = HEADER_TO_ID[headerName] || headerName.toLowerCase();
        dayRecord.rankings[userId] = {
          rank: rank,
          score: SCORE_MAP[rank] || 0
        };
      }
    });
    
    if (Object.keys(dayRecord.rankings).length > 0) {
      records.push(dayRecord);
    }
  }
  
  return records;
}

// 解析周度记录 Sheet
export function parseWeeklyRecords(data) {
  if (!data || data.length < 2) return [];
  
  const records = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 8) continue;
    
    const weekLabel = row[1];
    if (!weekLabel || typeof weekLabel !== 'string' || !weekLabel.includes('week')) continue;
    
    const weekRecord = {
      week: weekLabel,
      quarter: row[0] || '',
      scores: {
        kyle: row[2] || 0,
        cj: row[3] || 0,
        baoxuan: row[4] || 0,
        cong: row[5] || 0,
        yty: row[6] || 0,
        issac: row[7] || 0
      },
      lazyKing: row[8] || '',
      punishment: row[9] || '',
      punishmentLink: row[10] || ''
    };
    
    records.push(weekRecord);
  }
  
  return records;
}

// 解析积分榜 Sheet (当前周)
export function parseCurrentWeek(data) {
  if (!data || data.length < 2) return null;
  
  const result = {
    weekDays: [],
    totalScores: {}
  };
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row) continue;
    
    if (row[0] === '总积分') {
      result.totalScores = {
        kyle: row[1] || 0,
        cj: row[2] || 0,
        baoxuan: row[3] || 0,
        cong: row[4] || 0,
        yty: row[5] || 0,
        issac: row[6] || 0
      };
      continue;
    }
    
    if (['周一', '周二', '周三', '周四', '周五', '周六', '周日'].includes(row[0])) {
      result.weekDays.push({
        day: row[0],
        rankings: {
          kyle: row[1] || 0,
          cj: row[2] || 0,
          baoxuan: row[3] || 0,
          cong: row[4] || 0,
          yty: row[5] || 0,
          issac: row[6] || 0
        }
      });
    }
  }
  
  return result;
}

// 解析规则 Sheet
export function parseRules(data) {
  if (!data || data.length < 2) return [];
  
  const rules = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[1]) continue;
    
    rules.push({
      title: row[0] || '',
      content: row[1] || '',
      items: row.slice(2).filter(item => item && typeof item === 'string')
    });
  }
  
  return rules;
}

// 解析道具记录 Sheet
export function parseItems(data) {
  if (!data || data.length < 2) return [];
  
  const records = [];
  let currentDate = null;
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 5) continue;
    
    if (typeof row[3] === 'number' && row[3] > 40000) {
      currentDate = excelDateToString(row[3]);
    }
    
    if (row[4] && typeof row[4] === 'string') {
      records.push({
        user: row[0] || '',
        item: row[1] || '',
        date: currentDate || '',
        description: row[4]
      });
    }
  }
  
  return records;
}

// 解析惩罚机制 Sheet
export function parsePunishments(data) {
  if (!data || data.length < 2) return [];
  
  const punishments = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[0]) continue;
    
    punishments.push({
      punishment: row[0],
      proposer: row[1] || ''
    });
  }
  
  return punishments;
}

// 解析季度/年度懒觉王
export function parseLazyKings(weeklyRecords) {
  if (!weeklyRecords || weeklyRecords.length === 0) return { quarters: [], yearly: null };
  
  const quarterMap = {};
  const yearScores = {};
  
  USERS.forEach(user => {
    yearScores[user.id] = 0;
  });
  
  weeklyRecords.forEach(week => {
    Object.keys(week.scores || {}).forEach(user => {
      if (yearScores[user] !== undefined) {
        yearScores[user] += week.scores[user] || 0;
      }
    });
    
    if (week.quarter && week.quarter.includes('季度总结')) {
      const quarterKey = week.quarter.replace('总结', '');
      if (!quarterMap[quarterKey]) {
        quarterMap[quarterKey] = { lazyKing: week.lazyKing, scores: week.scores };
      }
    }
  });
  
  let yearlyLazyKing = null;
  let minScore = Infinity;
  Object.keys(yearScores).forEach(user => {
    if (yearScores[user] < minScore) {
      minScore = yearScores[user];
      yearlyLazyKing = user;
    }
  });
  
  return {
    quarters: Object.entries(quarterMap).map(([quarter, data]) => ({
      quarter,
      lazyKing: data.lazyKing,
      scores: data.scores
    })),
    yearly: { lazyKing: yearlyLazyKing, scores: yearScores }
  };
}

// 计算总积分排名
export function calculateTotalScores(dailyRecords) {
  if (!dailyRecords || dailyRecords.length === 0) return [];
  
  const totals = {};
  
  USERS.forEach(user => {
    totals[user.id] = { score: 0, firstPlaces: 0, records: 0 };
  });
  
  dailyRecords.forEach(day => {
    Object.keys(day.rankings).forEach(user => {
      if (totals[user]) {
        totals[user].score += day.rankings[user].score;
        totals[user].records++;
        if (day.rankings[user].rank === 1) {
          totals[user].firstPlaces++;
        }
      }
    });
  });
  
  return USERS.map(user => ({
    ...user,
    totalScore: totals[user.id].score,
    firstPlaces: totals[user.id].firstPlaces,
    records: totals[user.id].records,
    avgScore: totals[user.id].records > 0 
      ? (totals[user.id].score / totals[user.id].records).toFixed(2) 
      : 0
  })).sort((a, b) => b.totalScore - a.totalScore);
}

// 生成积分趋势数据
export function generateTrendData(dailyRecords) {
  if (!dailyRecords || dailyRecords.length === 0) return [];
  
  const cumulative = {};
  USERS.forEach(user => {
    cumulative[user.id] = 0;
  });
  
  return dailyRecords.map((day, idx) => {
    const dayData = { day: idx + 1 };
    
    Object.keys(day.rankings).forEach(user => {
      cumulative[user] += day.rankings[user].score;
      dayData[user] = cumulative[user];
    });
    
    return dayData;
  });
}

// 生成日历热力图数据
export function generateHeatmapData(dailyRecords) {
  if (!dailyRecords || dailyRecords.length === 0) return [];
  
  return dailyRecords.map((day, idx) => {
    const ranks = Object.values(day.rankings).map(r => r.rank);
    const bestRank = Math.min(...ranks);
    const worstRank = Math.max(...ranks);
    
    return {
      day: idx + 1,
      bestRank,
      worstRank,
      intensity: 7 - bestRank
    };
  });
}

// Excel 日期序列号转字符串
function excelDateToString(serial) {
  if (!serial || serial < 1) return '';
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const date = new Date(utcValue * 1000);
  return date.toLocaleDateString('zh-CN');
}

// 主解析函数
export function parseExcelData(workbook) {
  try {
    const result = {
      currentWeek: null,
      weeklyRecords: [],
      dailyRecords: [],
      rules: [],
      items: [],
      punishments: [],
      lazyKings: null,
      leaderboard: [],
      trendData: [],
      heatmapData: [],
      users: USERS
    };
    
    if (workbook.SheetNames.includes('积分榜')) {
      const sheet = workbook.Sheets['积分榜'];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      result.currentWeek = parseCurrentWeek(data);
    }
    
    if (workbook.SheetNames.includes('周度记录')) {
      const sheet = workbook.Sheets['周度记录'];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      result.weeklyRecords = parseWeeklyRecords(data);
    }
    
    if (workbook.SheetNames.includes('每日记录')) {
      const sheet = workbook.Sheets['每日记录'];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      result.dailyRecords = parseDailyRecords(data);
    }
    
    if (workbook.SheetNames.includes('打卡规则')) {
      const sheet = workbook.Sheets['打卡规则'];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      result.rules = parseRules(data);
    }
    
    if (workbook.SheetNames.includes('百宝箱')) {
      const sheet = workbook.Sheets['百宝箱'];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      result.items = parseItems(data);
    }
    
    if (workbook.SheetNames.includes('奖惩机制')) {
      const sheet = workbook.Sheets['奖惩机制'];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      result.punishments = parsePunishments(data);
    }
    
    result.leaderboard = calculateTotalScores(result.dailyRecords);
    result.trendData = generateTrendData(result.dailyRecords);
    result.heatmapData = generateHeatmapData(result.dailyRecords);
    result.lazyKings = parseLazyKings(result.weeklyRecords);
    
    return result;
  } catch (error) {
    console.error('Error parsing Excel data:', error);
    return null;
  }
}

export { XLSX };