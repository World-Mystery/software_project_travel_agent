# FRONTEND_SKILL.md

# TravelOS 智能旅行助手前端开发 Skill

## 0. 文档定位

本文档用于指导 AI 编程助手逐步开发本项目的完整前端。  
它不是普通产品说明书，而是一个可以直接放进项目根目录、交给 Cursor / Windsurf / Claude Code / ChatGPT Coding Agent 执行的前端开发规范。

AI 编程助手在开发时必须严格遵守本文档：

- 不要一次性重写全部页面。
- 不要只生成静态 UI。
- 不要破坏现有后端接口、类型文件和 API 封装。
- 每完成一个阶段都必须保证项目可以运行。
- 前端最终要形成完整的产品体验闭环，而不是几个孤立页面。

---

## 1. 项目目标

本项目是一个前后端分离的智能旅行助手系统。  
前端需要从当前简陋版本重构为一个完整、美观、实用、可演示的 AI 旅行规划工作台。

整体前端风格命名为：

**TravelOS 智能旅行工作台**

它不是普通旅游网站，也不是简单聊天机器人，而是一个围绕 AI 旅行规划的完整工作台系统。

最终用户链路应为：

```text
登录 / 注册
  ↓
填写旅行需求
  ↓
创建 AI 生成任务
  ↓
展示 Agent 流水线生成过程
  ↓
进入方案详情页
  ↓
查看每日行程、地图、天气、预算、版本信息
  ↓
支持历史方案、版本历史、基于版本重新生成
  ↓
支持个人画像维护
```

前端开发必须围绕这个闭环展开。

---

## 2. 技术栈约束

当前项目已有 React + Vite 前端基础，可以重写 UI，但尽量保留已有 API 与类型能力。

推荐技术栈：

```text
React
TypeScript
Vite
React Router
React Query
Zustand
Ant Design
Tailwind CSS
Framer Motion
Recharts
```

使用原则：

- React + TypeScript 作为主体。
- React Router 负责页面路由。
- React Query 负责后端请求、缓存和任务轮询。
- Zustand 负责登录态、token、全局 UI 状态。
- Ant Design 只用于表单、日期选择器、弹窗、抽屉、通知等基础组件。
- Tailwind CSS 负责整体视觉风格，不要让 Ant Design 默认样式主导页面。
- Framer Motion 负责页面转场、卡片进入、Agent 流水线、版本时间线等动画。
- Recharts 负责预算、画像等图表。
- 地图模块前期可以先做 mock 组件，后续再接真实地图 SDK。

---

## 3. 当前项目已有内容

当前项目是标准前后端分离架构，前端可以推翻重做，但必须对齐后端接口。

### 3.1 后端

后端主要包含：

```text
Backend - FastAPI + LangGraph
```

已有能力包括：

- Auth：登录、注册、JWT 鉴权。
- Plans：方案创建、方案管理、版本管理。
- Profile：用户画像管理。
- Tasks：异步任务状态查询。
- Agents：LangGraph 串联景点、酒店、天气、规划师等 Agent。
- Services / Repositories：业务逻辑与数据库访问。
- MySQL：用户、方案、版本、任务等数据持久化。
- JSON 半结构化存储：复杂行程结果以 JSON 形式存储。
- 版本链机制：创建、编辑、重新生成都应产生新版本，而不是覆盖旧版本。

### 3.2 现有前端

当前前端主要是验证流程的基础版本，页面较简陋，可以重写。

已有内容可能包括：

```text
src/pages
src/api
src/types/generated
src/store
```

重写前端时，不要轻易删除：

```text
src/api
src/types
src/types/generated
```

如果已有 OpenAPI 生成类型，优先复用。

---

## 4. 开发总原则

### 4.1 不要一次性重写全部

AI 编程助手必须分阶段开发。每一阶段完成后，都要保证项目可以运行。

推荐顺序：

```text
阶段 1：整理前端基础结构、路由、布局、全局样式
阶段 2：完成登录注册与鉴权流程
阶段 3：完成创建旅行方案页面
阶段 4：完成异步任务进度页面与轮询逻辑
阶段 5：完成方案详情页
阶段 6：完成历史方案页
阶段 7：完成版本历史页
阶段 8：完成个人画像页
阶段 9：补充动画、空状态、错误状态和细节优化
```

每个阶段完成后必须：

```bash
npm install
npm run dev
npm run build
```

如果出现 TypeScript 错误、运行时报错、页面崩溃，必须先修复，再进入下一阶段。

---

### 4.2 页面不能只是静态展示

每个核心页面都必须考虑：

```text
正常状态
Loading 状态
Empty 状态
Error 状态
Success 状态
用户下一步操作
```

不要只写静态 mock 页面。

---

### 4.3 保留后端对接能力

如果某个后端接口暂时不可用，可以先使用 mock 数据，但必须保留真实 API 入口。

推荐做法：

```text
页面组件
  ↓
hooks
  ↓
api service
  ↓
真实 API 或 mock
```

不要让页面组件直接写死 mock 数据。

---

### 4.4 页面组件不能堆复杂逻辑

页面组件只负责布局和组合。

复杂逻辑必须放到：

```text
src/hooks
src/api
src/utils
src/store
```

例如：

```text
useAuth
useCreatePlan
useTaskPolling
usePlanDetail
usePlanHistory
useVersionHistory
useProfile
```

---

## 5. 后端机制对齐

前端开发时必须对齐以下四个机制。

---

### 5.1 Auth 登录鉴权机制

登录流程：

```text
POST /api/auth/login
  ↓
返回 access_token
  ↓
保存 token 到 Zustand / localStorage
  ↓
后续请求携带 Authorization: Bearer <token>
```

注册流程：

```text
POST /api/auth/register
  ↓
注册成功
  ↓
跳转登录页或自动登录后进入 /app/create
```

所有需要登录的页面必须经过路由守卫：

```text
/app/create
/app/tasks/:taskId
/app/plans
/app/plans/:planId
/app/plans/:planId/versions
/app/plans/:planId/versions/:versionId
/app/profile
/app/settings
```

未登录访问这些页面时：

```text
跳转 /login
登录成功后回到原页面
```

必须实现：

```text
ProtectedRoute
```

---

### 5.2 异步任务轮询机制

这是本项目最核心的前端机制。

创建方案时：

```text
POST /api/plans
```

后端不直接返回完整方案，而是返回：

```json
{
  "task_id": "xxx"
}
```

前端拿到 `task_id` 后跳转：

```text
/app/tasks/:taskId
```

任务页每 2 秒轮询：

```text
GET /api/tasks/{task_id}
```

任务状态：

```text
pending
running
success
failed
```

当 `status === success` 时：

```text
读取 result_version_id / plan_id
跳转 /app/plans/:planId?versionId=xxx
```

当 `status === failed` 时：

```text
展示 error_message
提供重新生成 / 返回修改需求按钮
```

必须实现：

```text
useTaskPolling(taskId)
```

该 hook 职责：

```text
定时请求任务状态
任务成功后停止轮询
任务失败后停止轮询
组件卸载时清除定时器
支持手动 retry
```

---

### 5.3 DTO / Schema 对齐

表单提交数据必须符合后端 DTO。

开发表单时，必须优先参考已有类型：

```text
RegisterRequest
LoginRequest
TripPlanCreateRequest
TripPlanRegenerateRequest
TripPlanResponse
TripPlanVersionResponse
PlanTaskStatusResponse
UserProfileResponse
UserProfileUpdateRequest
```

如果后端字段和 UI 字段不一致，需要写 adapter：

```text
src/utils/adapters.ts
```

例如：

```ts
function createPlanFormToRequest(form: TravelRequirementForm): TripPlanCreateRequest {
  return {
    city: form.destination,
    start_date: form.dateRange[0],
    end_date: form.dateRange[1],
    budget: form.budget,
    transport_preference: form.transportPreference,
    accommodation_preference: form.accommodationPreference,
    interest_tags: form.interestTags,
    pace_preference: form.pacePreference,
    risk_sensitivity: form.riskSensitivity,
  };
}
```

不要让页面组件直接拼后端请求体。

---

### 5.4 版本链机制

前端必须支持版本链，而不是覆盖旧方案。

核心规则：

```text
创建方案产生 v1
编辑方案产生新版本
基于历史版本重新生成产生新版本
历史版本可查看
当前版本由 current_version_id 指向
```

版本相关页面必须支持：

```text
查看版本历史
查看某个版本
显示当前版本
显示父版本
显示版本来源 created / edited / regenerated
基于某版本重新生成
版本对比
```

如果后端暂时没有完整版本接口，可以先 mock，但 UI 必须按版本链设计。

---

## 6. 推荐前端目录结构

建议重构为：

```text
frontend/src
├── api
│   ├── request.ts
│   ├── auth.ts
│   ├── profile.ts
│   ├── plans.ts
│   ├── tasks.ts
│   ├── warnings.ts
│   └── mock.ts
├── assets
├── components
│   ├── layout
│   ├── common
│   ├── form
│   ├── plan
│   ├── task
│   ├── map
│   ├── weather
│   ├── budget
│   ├── version
│   └── ai
├── hooks
│   ├── useAuth.ts
│   ├── useCreatePlan.ts
│   ├── useTaskPolling.ts
│   ├── usePlanDetail.ts
│   ├── usePlanHistory.ts
│   ├── useVersionHistory.ts
│   └── useProfile.ts
├── pages
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── CreatePlanPage.tsx
│   ├── TaskProgressPage.tsx
│   ├── PlanDetailPage.tsx
│   ├── PlanHistoryPage.tsx
│   ├── VersionHistoryPage.tsx
│   ├── ProfilePage.tsx
│   └── SettingsPage.tsx
├── router
│   ├── index.tsx
│   └── ProtectedRoute.tsx
├── store
│   ├── authStore.ts
│   └── uiStore.ts
├── styles
│   ├── globals.css
│   └── theme.css
├── types
├── utils
│   ├── adapters.ts
│   ├── format.ts
│   ├── constants.ts
│   └── mockData.ts
├── App.tsx
└── main.tsx
```

如果当前项目已有部分文件，可以在不破坏 API/types 的前提下调整。

---

## 7. 视觉设计规范

### 7.1 整体风格

风格关键词：

```text
智能旅行工作台
高级
清爽
实用
科技感
地图感
非后台模板
非简陋线框
```

不要做成：

```text
普通管理后台
纯 Ant Design 默认样式
简单旅游网站模板
大面积空白线框
AI 生成感很重的渐变堆砌
```

---

### 7.2 配色

推荐主题色：

```css
:root {
  --color-primary: #18B6A7;
  --color-primary-blue: #4DA3FF;
  --color-deep-blue: #102A43;
  --color-bg: #F6F8FB;
  --color-card: #FFFFFF;
  --color-text-main: #172033;
  --color-text-secondary: #637083;
  --color-warning: #FFB020;
  --color-danger: #EF4444;
  --color-success: #22C55E;
}
```

页面背景：

```text
浅灰背景 + 白色卡片 + 蓝绿色强调色
局部可以使用深蓝渐变作为 Hero 区背景
```

---

### 7.3 字体

推荐：

```text
中文：PingFang SC / Microsoft YaHei / HarmonyOS Sans
英文数字：Inter / SF Pro Display
```

CSS：

```css
body {
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
}
```

---

### 7.4 卡片规范

所有核心信息都使用卡片承载。

卡片风格：

```text
border-radius: 16px 或 20px
白色背景
轻阴影
细边框
hover 时轻微上浮
```

避免：

```text
厚重黑边框
过度发光
复杂纹理
不统一圆角
```

---

## 8. 路由设计

必须实现以下路由：

```text
/login
/register

/app
/app/create
/app/tasks/:taskId
/app/plans
/app/plans/:planId
/app/plans/:planId/versions
/app/plans/:planId/versions/:versionId
/app/profile
/app/settings
```

默认跳转：

```text
/        -> /app/create 或 /login
/app     -> /app/create
```

未登录：

```text
访问 /app/* 自动跳转 /login
```

登录后：

```text
跳转 /app/create
```

---

## 9. 全局布局设计

除登录注册页外，所有页面使用 `AppLayout`。

### 9.1 AppLayout

包含：

```text
TopNav
SideNav
PageContainer
```

---

### 9.2 TopNav

内容：

```text
左侧：TravelOS Logo / 智能旅行助手
中间：创建方案、我的行程、个人画像
右侧：通知、天气提示、用户头像
```

设计：

```text
高度 64px
半透明白色背景
滚动后增加轻微阴影
当前导航项高亮
```

动效：

```text
导航项 hover 时底部短线滑入
用户头像 hover 后出现菜单
```

---

### 9.3 SideNav

内容：

```text
创建方案
我的方案
AI 任务
版本记录
个人画像
设置
```

设计：

```text
默认窄栏
hover 展开
当前页面高亮
```

如果开发时间不足，可以先只做 TopNav，但最终推荐保留 SideNav。

---

## 10. 页面设计与功能要求

---

### 10.1 LoginPage 登录页

目标：

```text
展示高级产品感，而不是普通表单。
```

布局：

```text
左右分栏
左侧：产品介绍 + 动态旅行视觉背景
右侧：登录表单
```

左侧内容：

```text
TravelOS 智能旅行工作台
AI 生成行程
天气风险预警
预算自动分析
历史版本追踪
```

右侧表单：

```text
账号 / 邮箱
密码
登录按钮
跳转注册
```

交互：

```text
输入框聚焦高亮
登录按钮 loading
登录失败显示错误提示
登录成功跳转 /app/create
```

动画：

```text
背景轻微缩放
登录卡片淡入
表单项依次出现
```

---

### 10.2 RegisterPage 注册页

注册页建议做成三步：

```text
Step 1：账号信息
Step 2：基础旅行偏好
Step 3：完成创建
```

偏好字段：

```text
旅行风格
预算等级
兴趣标签
交通偏好
住宿偏好
天气敏感度
行程节奏
```

交互：

```text
Step 切换左右滑动
标签点击有弹性动画
注册成功后跳转登录或直接进入 /app/create
```

---

### 10.3 CreatePlanPage 创建方案页

这是首页和核心入口。

页面模块：

```text
Hero 区
自然语言输入区
结构化需求表单
旅行模板推荐
最近方案预览
```

Hero 文案：

```text
让 AI 为你生成一份真正可执行的旅行计划
结合天气、预算、地图路线和个人偏好，快速生成完整行程。
```

自然语言输入示例：

```text
我想五一去成都玩三天，预算 3000，希望轻松一点，多吃美食，少走路。
```

结构化表单字段：

```text
目的地
出发日期
结束日期
出行人数
总预算
交通方式
住宿偏好
旅行节奏
兴趣标签
天气敏感度
```

推荐模板：

```text
周末轻旅行
美食深度游
亲子舒适游
特种兵打卡
毕业旅行
商务顺路游
```

提交逻辑：

```text
点击生成旅行方案
  ↓
调用 POST /api/plans
  ↓
获取 task_id
  ↓
跳转 /app/tasks/:taskId
```

动画：

```text
页面标题淡入
表单卡片上浮
模板卡片依次出现
生成按钮 loading 后跳转任务页
```

---

### 10.4 TaskProgressPage AI 生成进度页

这是项目亮点页面，必须重点开发。

页面目标：

```text
可视化展示后端 LangGraph / Agent 流水线执行过程。
```

展示节点：

```text
需求解析
读取用户画像
景点检索
天气查询
酒店匹配
预算估算
方案生成
Schema 校验
版本保存
```

节点状态：

```text
waiting：灰色
running：蓝色发光
success：绿色打勾
failed：红色警告
```

右侧日志示例：

```text
已识别目的地：成都
已读取偏好：美食、轻松、公共交通
正在查询天气风险
正在筛选室内备选景点
正在生成最终行程结构
```

底部：

```text
当前任务 ID
当前阶段
进度百分比
重新生成按钮
返回修改需求按钮
```

轮询逻辑：

```text
每 2 秒请求 GET /api/tasks/:taskId
status 为 success 时跳转方案详情页
status 为 failed 时停止轮询并显示错误
```

动画：

```text
节点逐个点亮
当前节点呼吸光效
进度条平滑增长
日志逐条打字出现
成功后显示完成卡片
```

---

### 10.5 PlanDetailPage 方案详情页

这是最重要的展示页。

布局：

```text
三栏布局
左侧：日期目录
中间：每日行程时间轴
右侧：智能摘要面板
```

左侧目录：

```text
概览
Day 1
Day 2
Day 3
地图路线
预算分析
天气预警
版本信息
```

中间内容：

```text
方案标题
目的地
日期
每日行程时间轴
景点卡片
餐饮卡片
酒店卡片
交通建议
总体建议
```

右侧摘要面板：

```text
总预算
预算剩余 / 是否超支
天气风险等级
行程强度
交通耗时
当前版本
导出 PDF
重新生成
AI 优化
查看版本历史
```

必须包含的组件：

```text
PlanHero
DayTimeline
ItineraryCard
MapRouteView
WeatherRiskPanel
BudgetSummary
SmartSummaryPanel
AIAssistantDrawer
```

交互：

```text
点击左侧目录滚动到对应区域
滚动时目录自动高亮
点击地图点位高亮对应行程卡片
点击重新生成打开 AI 优化抽屉
点击版本历史跳转版本页
```

动画：

```text
标题淡入
预算数字递增
时间轴节点滚动点亮
地图点位依次弹出
卡片 hover 上浮
天气风险卡片展开
```

---

### 10.6 AIAssistantDrawer AI 优化抽屉

在方案详情页中使用。

入口：

```text
基于当前版本优化
重新生成
调整方案
```

抽屉内容：

```text
快捷优化按钮：
降低预算
减少步行
增加美食
避开雨天
行程更轻松
增加拍照点

自由输入：
例如：第二天太累了，帮我减少两个景点，并增加一个室内活动。
```

提交逻辑：

```text
调用 regenerate API
获取 task_id
跳转 /app/tasks/:taskId
生成成功后进入新版本详情页
```

---

### 10.7 PlanHistoryPage 历史方案页

设计为“旅行档案馆”。

顶部统计：

```text
我的旅行方案数量
已规划城市数量
平均预算
最近生成时间
```

筛选条件：

```text
城市
时间范围
预算范围
旅行风格
天气风险等级
```

方案卡片：

```text
城市封面
方案标题
日期
当前版本号
总预算
天气风险标签
行程强度
查看详情
版本历史
再次生成
```

动画：

```text
统计数字递增
卡片瀑布式出现
筛选时卡片平滑重排
hover 封面图放大
```

---

### 10.8 VersionHistoryPage 版本历史页

设计为版本时间线。

页面结构：

```text
左侧：版本时间线
右侧：选中版本摘要
```

版本节点：

```text
v1 初始生成
v2 用户编辑后保存
v3 根据天气风险重新生成
v4 降低预算后重新生成
```

摘要信息：

```text
版本号
创建时间
来源类型
父版本
变更摘要
预算变化
天气风险变化
行程强度变化
```

操作按钮：

```text
查看此版本
对比上一版本
基于此版本重新生成
```

版本对比抽屉：

```text
新增景点
删除景点
预算变化
天气风险变化
每日安排变化
```

动画：

```text
时间线从上到下绘制
版本节点依次出现
当前版本节点呼吸高亮
对比项逐条展开
```

---

### 10.9 ProfilePage 个人画像页

设计为“旅行画像仪表盘”。

内容：

```text
旅行风格
预算偏好
兴趣标签
交通偏好
住宿偏好
天气敏感度
行程节奏
画像摘要
```

展示方式：

```text
雷达图
标签云
偏好滑块
摘要卡片
```

交互：

```text
修改偏好
保存画像
重新生成画像
```

动画：

```text
雷达图加载时绘制
标签云轻微浮动
滑块变化时摘要实时更新
保存成功后显示成功反馈
```

---

## 11. 全局动画规范

使用 Framer Motion 实现统一动画。

### 11.1 页面切换动画

一级页面切换：

```text
旧页面淡出并向左移动
新页面从右侧淡入
时长 250ms - 350ms
```

列表到详情：

```text
点击卡片后卡片轻微缩放
详情页主卡片从下方浮入
```

任务到详情：

```text
任务完成卡片出现
页面淡出
方案详情页标题和摘要卡片依次出现
```

---

### 11.2 卡片动画

卡片初始：

```text
opacity: 0
y: 16
```

进入：

```text
opacity: 1
y: 0
```

hover：

```text
y: -4
scale: 1.01
```

---

### 11.3 Agent 节点动画

waiting：

```text
灰色静态
```

running：

```text
蓝绿色呼吸光效
小圆点旋转
```

success：

```text
绿色勾选
节点轻微放大后恢复
```

failed：

```text
红色图标
节点轻微震动
```

---

### 11.4 空状态与错误状态

空状态不能只写“暂无数据”。

历史方案为空：

```text
你还没有创建任何旅行方案
创建第一份 AI 旅行计划，开始构建你的旅行档案。
```

任务失败：

```text
生成失败
可能是外部天气服务或 AI 服务暂时不可用。
```

提供按钮：

```text
重新生成
返回修改需求
```

---

## 12. API 封装规范

必须统一请求入口。

`src/api/request.ts` 职责：

```text
统一 baseURL
自动携带 token
统一处理 401
统一处理 JSON 解析
统一抛出错误
```

示例结构：

```ts
export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthTokenSomehow();

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    // clear token and redirect login
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Request failed");
  }

  return res.json();
}
```

不要在页面组件里直接写 fetch。

---

## 13. Hooks 规范

页面不直接处理复杂请求逻辑。

必须封装：

```text
useAuth
useCreatePlan
useTaskPolling
usePlanDetail
usePlanHistory
useVersionHistory
useProfile
```

### 13.1 useTaskPolling 要求

```text
输入 taskId
内部轮询任务状态
返回 task、loading、error、retry
任务成功自动停止
任务失败自动停止
组件卸载清理定时器
```

### 13.2 usePlanDetail 要求

```text
输入 planId 和可选 versionId
返回方案详情、loading、error、refetch
支持 mock fallback
```

### 13.3 useVersionHistory 要求

```text
输入 planId
返回版本列表、当前版本、loading、error
支持选择版本
支持打开版本对比
```

---

## 14. Mock 数据规范

如果真实后端暂时未完成，允许使用 mock 数据。

Mock 数据必须放在：

```text
src/utils/mockData.ts
```

或：

```text
src/api/mock.ts
```

不要散落在页面组件里。

Mock 数据结构必须尽量贴近真实 DTO。

需要准备：

```text
mockPlanDetail
mockPlanHistory
mockTaskProgress
mockVersionHistory
mockUserProfile
mockWeatherWarnings
```

---

## 15. 开发阶段计划

---

### 阶段 1：基础结构和视觉系统

目标：

```text
跑通项目
建立路由
建立 AppLayout
建立全局样式
建立主题变量
```

任务：

```text
安装 Tailwind CSS
安装 Framer Motion
安装 React Query
安装 Zustand
配置 Router
实现 ProtectedRoute
实现 TopNav / SideNav / AppLayout
实现基础 PageTransition
```

验收：

```text
npm run dev 可以正常启动
/login /register /app/create 可以访问
/app 页面未登录会跳转 /login
页面有基础 TravelOS 风格
npm run build 通过
```

---

### 阶段 2：登录注册

目标：

```text
完成 Auth 流程
```

任务：

```text
实现 authStore
实现 login API
实现 register API
实现 LoginPage
实现 RegisterPage
实现 token 持久化
实现退出登录
```

验收：

```text
可以登录
token 能保存
刷新后登录态仍存在
退出后清空 token
未登录访问受保护页面会跳转登录
npm run build 通过
```

---

### 阶段 3：创建方案页

目标：

```text
完成用户创建旅行需求的主入口
```

任务：

```text
实现 CreatePlanPage
实现自然语言输入区
实现结构化表单
实现旅行模板卡片
实现最近方案预览
实现 createPlan API
提交后跳转任务页
```

验收：

```text
表单可填写
提交时有 loading
成功拿到 task_id 后跳转 /app/tasks/:taskId
失败时显示错误
npm run build 通过
```

---

### 阶段 4：任务进度页

目标：

```text
完成 AI Agent 生成过程可视化
```

任务：

```text
实现 TaskProgressPage
实现 AgentPipeline
实现 AgentNode
实现 TaskLogPanel
实现 useTaskPolling
实现任务成功跳转详情页
实现失败状态
```

验收：

```text
能轮询任务状态
pending/running/success/failed 都有 UI
成功后自动跳转方案详情
失败后可以重新生成或返回创建页
npm run build 通过
```

---

### 阶段 5：方案详情页

目标：

```text
完成核心展示页面
```

任务：

```text
实现 PlanDetailPage
实现 PlanHero
实现 DayTimeline
实现 ItineraryCard
实现 BudgetSummary
实现 WeatherRiskPanel
实现 MapRouteView mock
实现 SmartSummaryPanel
实现 AI 优化抽屉入口
```

验收：

```text
可以展示完整方案
可以滚动查看 Day1/Day2/Day3
右侧摘要固定
预算、天气、地图、版本信息都有展示
页面动效自然
npm run build 通过
```

---

### 阶段 6：历史方案页

目标：

```text
完成旅行档案馆
```

任务：

```text
实现 PlanHistoryPage
实现 HistoryStats
实现 PlanFilterBar
实现 PlanArchiveCard
实现筛选和搜索
```

验收：

```text
可以查看历史方案
可以筛选
可以进入详情页
可以进入版本历史页
空状态美观
npm run build 通过
```

---

### 阶段 7：版本历史页

目标：

```text
完成版本链展示
```

任务：

```text
实现 VersionHistoryPage
实现 VersionTimeline
实现 VersionNode
实现 VersionSummaryCard
实现 VersionCompareDrawer
实现基于版本重新生成入口
```

验收：

```text
可以查看版本时间线
可以选择版本
可以对比版本
可以基于某版本重新生成
npm run build 通过
```

---

### 阶段 8：个人画像页

目标：

```text
完成用户偏好和画像展示
```

任务：

```text
实现 ProfilePage
实现 ProfileRadar
实现 PreferenceCloud
实现 PreferenceEditor
实现 ProfileSummaryCard
实现保存画像
```

验收：

```text
可以查看画像
可以修改偏好
可以保存
页面有图表和动态效果
npm run build 通过
```

---

### 阶段 9：整体打磨

目标：

```text
让项目从“能用”提升到“好看、顺滑、适合演示”
```

任务：

```text
统一动画
统一卡片样式
补充 skeleton loading
补充 empty state
补充 error state
补充 notification
移动端基本适配
修复 TypeScript 问题
修复控制台报错
```

验收：

```text
npm run build 通过
主要页面无明显错位
刷新页面不崩溃
登录态正常
任务流程正常
演示路径完整
```

---

## 16. 最终演示路径要求

最终项目必须支持以下三条演示路径。

---

### 16.1 新用户生成方案

```text
注册
  ↓
填写旅行偏好
  ↓
进入创建页
  ↓
输入旅行需求
  ↓
点击生成
  ↓
进入 Agent 生成页
  ↓
展示流水线执行
  ↓
生成成功
  ↓
进入方案详情页
  ↓
展示每日行程、预算、天气、地图
```

---

### 16.2 天气风险优化

```text
打开已有方案
  ↓
看到天气风险提示
  ↓
点击基于天气优化
  ↓
打开 AI 优化抽屉
  ↓
选择避开雨天户外景点
  ↓
生成新版本
  ↓
进入任务页
  ↓
生成成功后查看新版本
```

---

### 16.3 历史版本管理

```text
进入历史方案页
  ↓
选择某个方案
  ↓
进入版本历史
  ↓
查看 v1、v2、v3
  ↓
对比两个版本
  ↓
基于旧版本重新生成
```

---

## 17. 质量要求

### 17.1 代码质量

必须做到：

```text
组件拆分清晰
页面不堆复杂逻辑
API 统一封装
类型尽量完整
无明显 any 滥用
无控制台报错
无 TypeScript build 错误
```

---

### 17.2 UI 质量

必须做到：

```text
不是 Ant Design 默认后台风格
不是简陋线框图
不是纯白页面堆表单
页面有层次感
核心页面有动画
空状态和错误状态完整
按钮和卡片交互自然
```

---

### 17.3 体验质量

必须做到：

```text
生成任务有进度反馈
失败有重试入口
历史方案可以回看
版本链可以追踪
详情页信息完整
用户知道下一步该做什么
```

---

## 18. AI 编程助手执行规则

当 AI 编程助手根据本文件开发时，必须遵守：

```text
不要一次性生成所有页面
不要随意删除 src/api 和 src/types
不要在页面组件里直接 fetch
不要把 mock 数据散落在组件里
不要只实现静态 UI 而不接路由
不要忽略 loading/error/empty 状态
不要为了好看牺牲主流程
每完成一个阶段都要保证 npm run build 通过
```

每次开发一个阶段时，先输出：

```text
本阶段要修改的文件
本阶段要新增的文件
本阶段完成后的验收方式
```

然后再进行代码修改。

---

## 19. 推荐对 AI 编程助手的使用方式

不要直接说：

```text
帮我开发完整前端
```

应该按阶段下达任务。

例如阶段 1：

```text
请阅读 FRONTEND_SKILL.md。严格按照里面的阶段计划执行。现在只做阶段 1：基础结构和视觉系统。不要一次性开发所有页面。完成后确保 npm run build 通过。
```

阶段 2：

```text
继续阶段 2：登录注册。保留已有 src/api 和 src/types，不要破坏后端类型。完成后确保登录态、ProtectedRoute 和退出登录可用，并保证 npm run build 通过。
```

阶段 3：

```text
继续阶段 3：创建方案页。实现 TravelOS 风格首页、自然语言输入、结构化表单、旅行模板卡片和提交后跳转任务页。不要直接在页面里 fetch，必须通过 hook 和 api service。
```

如果出现 bug：

```text
不要继续开发新功能。先定位并修复当前 bug，修复后运行 npm run build，确认通过后再继续。
```

---

## 20. 推荐最终效果

最终前端应该像一个真实可用的智能旅行规划产品，而不是课程作业页面。

它应该让用户明显感受到：

```text
我可以输入旅行需求
AI 真的在分阶段生成方案
生成结果不是一段文字，而是结构化行程
我可以看到天气、预算、地图和风险
我可以回看历史方案
我可以追踪每个版本如何变化
我可以基于旧方案继续优化
```

前端最终目标不是“页面能打开”，而是：

```text
流程完整
视觉高级
交互顺滑
数据结构清晰
适合课堂演示
后期容易继续扩展
```

---

## 21. 结束语

本项目的前端开发目标是构建一个完整的 TravelOS 智能旅行工作台。  
任何开发决策都应该服务于以下核心体验：

```text
需求输入清晰
AI 生成过程可视化
方案结果结构化
天气和预算可解释
历史版本可追踪
用户可以持续优化方案
```

如果某个功能无法一次性接入真实后端，可以先做 mock，但必须保持真实 API 接入位置。  
如果某个动画开发成本过高，可以先做简化版，但不能牺牲主流程。  
如果 UI 和功能发生冲突，优先保证主流程完整，然后再打磨视觉。

最终交付物必须满足：

```text
能运行
能演示
好看
完整
可维护
```
