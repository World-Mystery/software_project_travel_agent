import dayjs from 'dayjs';

export const mockRecentPlans = [
  {
    id: 'mock-plan-1',
    city: '南京',
    title: '南京两日游',
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    version: 'v2',
    budget: 1500,
    weatherRisk: '低',
    intensity: '轻松',
  },
  {
    id: 'mock-plan-2',
    city: '成都',
    title: '成都三日游',
    date: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    version: 'v1',
    budget: 3000,
    weatherRisk: '中',
    intensity: '适中',
  },
  {
    id: 'mock-plan-3',
    city: '杭州',
    title: '杭州周末游',
    date: dayjs().add(10, 'day').format('YYYY-MM-DD'),
    version: 'v3',
    budget: 2000,
    weatherRisk: '低',
    intensity: '充实',
  },
];

export const mockTaskProgress = [
  { id: '1', title: '需求解析', status: 'success', log: '已识别目的地：成都，已读取用户偏好：美食、轻松、公共交通' },
  { id: '2', title: '用户画像读取', status: 'success', log: '加载画像成功：喜欢自然风光与历史文化' },
  { id: '3', title: '景点检索', status: 'success', log: '找到 35 个候选景点' },
  { id: '4', title: '天气查询', status: 'success', log: '正在查询未来三天天气... 检测到第二天下午存在降雨概率' },
  { id: '5', title: '酒店匹配', status: 'running', log: '正在优先筛选室内备选景点，并匹配附近酒店...' },
  { id: '6', title: '预算估算', status: 'waiting', log: '' },
  { id: '7', title: '行程生成', status: 'waiting', log: '' },
  { id: '8', title: 'Schema校验', status: 'waiting', log: '' },
  { id: '9', title: '版本保存', status: 'waiting', log: '' },
];

export const mockPlanHistory = [
  ...mockRecentPlans,
  {
    id: 'mock-plan-4',
    city: '北京',
    title: '北京五日深度游',
    date: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
    version: 'v4',
    budget: 6000,
    weatherRisk: '高',
    intensity: '特种兵',
    updatedAt: '2026-05-01',
  },
  {
    id: 'mock-plan-5',
    city: '西安',
    title: '西安历史寻根之旅',
    date: dayjs().subtract(20, 'day').format('YYYY-MM-DD'),
    version: 'v1',
    budget: 2500,
    weatherRisk: '低',
    intensity: '轻松',
    updatedAt: '2026-04-20',
  },
  {
    id: 'mock-plan-6',
    city: '广州',
    title: '广州美食打卡',
    date: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    version: 'v2',
    budget: 1800,
    weatherRisk: '中',
    intensity: '适中',
    updatedAt: '2026-04-10',
  },
];

export const mockVersionHistory = [
  {
    version: 'v1',
    source: 'AI Initial',
    createdAt: '2026-05-13 10:00',
    parent: null,
    summary: '初始生成：成都 3 日游',
    budgetChange: 0,
    riskChange: '中',
    intensityChange: '适中',
    details: {
      added: ['春熙路', '武侯祠', '锦里'],
      removed: [],
      reordered: false,
    }
  },
  {
    version: 'v2',
    source: 'User Edit',
    createdAt: '2026-05-13 10:15',
    parent: 'v1',
    summary: '调整预算限制至 ¥2500',
    budgetChange: -500,
    riskChange: '中',
    intensityChange: '适中',
    details: {
      added: [],
      removed: ['高端米其林餐厅'],
      reordered: false,
    }
  },
  {
    version: 'v3',
    source: 'AI Optimize',
    createdAt: '2026-05-13 10:30',
    parent: 'v2',
    summary: '天气风险优化（规避下午降雨）',
    budgetChange: +100,
    riskChange: '低',
    intensityChange: '轻松',
    details: {
      added: ['四川博物院'],
      removed: ['青城山后山'],
      reordered: true,
    }
  },
];

export const mockUserProfile = {
  radarData: [
    { subject: '美食探索', A: 90, fullMark: 100 },
    { subject: '自然风光', A: 60, fullMark: 100 },
    { subject: '历史人文', A: 85, fullMark: 100 },
    { subject: '购物打卡', A: 40, fullMark: 100 },
    { subject: '休闲放松', A: 70, fullMark: 100 },
    { subject: '极限运动', A: 20, fullMark: 100 },
  ],
  interests: ['独立咖啡馆', '古建筑', '地道小吃', '城市漫步', '摄影'],
  preferences: {
    budget: '中等',
    transport: '地铁优先',
    accommodation: '精品民宿',
    weatherSensitivity: '高',
    pace: '轻松',
  },
  summary: '系统画像摘要：你是一位注重文化体验与美食的旅行者，偏好轻松的行程节奏，对天气变化较为敏感。倾向于选择公共交通和有特色的住宿环境。',
};

export const mockPlanDetail = {
  id: 'mock-plan-2',
  city: '成都',
  days: 3,
  date: dayjs().add(5, 'day').format('YYYY-MM-DD'),
  version: 'v3',
  totalBudget: 2600,
  riskLevel: '低',
  pace: '轻松',
  budgetBreakdown: [
    { name: '餐饮', value: 800 },
    { name: '住宿', value: 1200 },
    { name: '交通', value: 300 },
    { name: '门票', value: 300 },
  ],
  weather: [
    { day: 'Day 1', temp: '22-28°C', condition: '多云', risk: '低' },
    { day: 'Day 2', temp: '20-25°C', condition: '阵雨', risk: '中', suggestion: '下午安排室内活动' },
    { day: 'Day 3', temp: '23-29°C', condition: '晴', risk: '低' },
  ],
  itinerary: [
    {
      day: 1,
      items: [
        { time: '09:00', type: 'attraction', title: '成都大熊猫繁育研究基地', reason: '早晨看大熊猫最活跃', duration: '3小时', budget: 55, tags: ['必打卡', '动物'] },
        { time: '12:30', type: 'food', title: '陈麻婆豆腐(总店)', reason: '地道川菜体验', duration: '1.5小时', budget: 80, tags: ['美食', '老字号'] },
        { time: '14:30', type: 'attraction', title: '武侯祠 & 锦里', reason: '历史人文与民俗街区连游', duration: '3小时', budget: 50, tags: ['历史', '文化'] },
        { time: '18:00', type: 'food', title: '蜀大侠火锅', reason: '来成都必吃火锅', duration: '2小时', budget: 120, tags: ['火锅', '重口味'] },
      ]
    },
    {
      day: 2,
      items: [
        { time: '09:30', type: 'attraction', title: '宽窄巷子', reason: '感受老成都慢生活', duration: '2.5小时', budget: 0, tags: ['休闲', '拍照'] },
        { time: '12:30', type: 'food', title: '鹤鸣茶社', reason: '体验成都盖碗茶文化及小吃', duration: '2小时', budget: 60, tags: ['茶文化'] },
        { time: '15:00', type: 'attraction', title: '四川博物院', reason: '避雨好去处，深入了解巴蜀历史', duration: '2.5小时', budget: 0, tags: ['室内', '博物馆'] },
        { time: '18:30', type: 'attraction', title: '九眼桥夜景', reason: '欣赏成都夜景，可选择酒吧小酌', duration: '2小时', budget: 100, tags: ['夜景', '酒吧'] },
      ]
    },
    {
      day: 3,
      items: [
        { time: '10:00', type: 'attraction', title: '春熙路 & IFS & 太古里', reason: '现代成都商业中心打卡', duration: '3小时', budget: 0, tags: ['购物', '地标'] },
        { time: '13:00', type: 'food', title: '饕林餐厅', reason: '精致川菜，环境优雅', duration: '1.5小时', budget: 100, tags: ['精致餐饮'] },
        { time: '15:00', type: 'transport', title: '准备返程', reason: '乘坐地铁前往机场/高铁站', duration: '1小时', budget: 10, tags: ['交通'] },
      ]
    }
  ]
};
