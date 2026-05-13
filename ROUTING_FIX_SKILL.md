# ROUTING_FIX_SKILL.md

# TravelOS 前端路由与页面跳转修复 Skill

## 0. 文档定位

本文档用于指导 AI 编程助手系统性检查并修复 TravelOS 智能旅行助手项目中的页面跳转、路由参数、鉴权重定向、任务完成跳转、详情页跳转、版本页跳转、返回逻辑等问题。

本 Skill 的目标不是重写 UI，也不是重新设计页面，而是：

```text
在不破坏现有页面视觉和组件结构的前提下，完整梳理全站导航链路，统一路由配置、跳转入口、参数传递、鉴权逻辑和异常兜底，使整个前端页面之间的跳转稳定、可预测、可演示。
```

AI 编程助手必须优先修复跳转逻辑，不要随意重构页面 UI，不要大规模改动组件样式。

---

## 1. 修复目标

当前项目页面 UI 基本完成，但页面之间跳转逻辑存在 bug。本次任务的目标是完整检查并修复以下问题：

```text
路由配置不统一
页面路径不一致
点击按钮跳错页面
跳转时 planId / versionId / taskId 丢失
任务成功后无法进入详情页
详情页查看版本历史失败
版本页返回详情页失败
未登录访问页面重定向异常
登录成功后不能回到原页面
刷新详情页后页面崩溃
浏览器返回按钮逻辑混乱
页面之间状态依赖过强
mock 数据和真实参数不一致
```

最终必须保证以下主流程完整可走通：

```text
/login
/register
/app/create
/app/tasks/:taskId
/app/plans
/app/plans/:planId
/app/plans/:planId?versionId=xxx
/app/plans/:planId/versions
/app/plans/:planId/versions/:versionId
/app/profile
/app/settings
```

---

## 2. 核心原则

### 2.1 不要重写 UI

本次只修复路由与跳转逻辑。

允许修改：

```text
router 配置
ProtectedRoute
导航菜单
按钮 onClick
Link / NavLink
useNavigate 调用
路由参数读取
URL query 参数读取
页面初始化逻辑
API hook 入参
跳转后的兜底逻辑
```

不建议修改：

```text
页面整体 UI
卡片样式
动画风格
组件视觉结构
表单布局
图表样式
```

除非 UI 代码直接导致跳转 bug。

---

### 2.2 路由必须成为唯一可信来源

页面跳转时，关键业务 ID 必须从 URL 获取，而不是依赖上一页传来的 React state。

必须支持刷新页面后仍可正常访问：

```text
/app/tasks/:taskId
/app/plans/:planId
/app/plans/:planId?versionId=xxx
/app/plans/:planId/versions
/app/plans/:planId/versions/:versionId
```

不要只依赖：

```ts
navigate("/app/plans/detail", { state: { plan } })
```

正确方式是：

```ts
navigate(`/app/plans/${planId}?versionId=${versionId}`)
```

然后详情页通过：

```ts
useParams()
useSearchParams()
```

读取参数并重新请求数据。

---

### 2.3 所有跳转路径集中管理

必须建立统一路由常量文件，避免路径字符串散落在页面中。

推荐新增：

```text
src/router/paths.ts
```

内容示例：

```ts
export const ROUTES = {
  login: "/login",
  register: "/register",
  app: "/app",
  create: "/app/create",
  plans: "/app/plans",
  task: (taskId: string) => `/app/tasks/${taskId}`,
  planDetail: (planId: string | number, versionId?: string | number) =>
    versionId
      ? `/app/plans/${planId}?versionId=${versionId}`
      : `/app/plans/${planId}`,
  planVersions: (planId: string | number) => `/app/plans/${planId}/versions`,
  planVersionDetail: (planId: string | number, versionId: string | number) =>
    `/app/plans/${planId}/versions/${versionId}`,
  profile: "/app/profile",
  settings: "/app/settings",
};
```

所有页面跳转必须优先使用 `ROUTES`，不要到处手写路径字符串。

---

### 2.4 所有 ID 参数统一规范

全站统一使用这些参数命名：

```text
taskId
planId
versionId
```

路由中也必须对应：

```text
/app/tasks/:taskId
/app/plans/:planId
/app/plans/:planId/versions
/app/plans/:planId/versions/:versionId
```

不要混用：

```text
id
tripId
plan_id
version_id
task_id
```

如果后端返回 snake_case，需要在 adapter 中转换，页面层统一使用 camelCase。

---

## 3. 推荐路由结构

请检查并修复路由配置，使其接近以下结构：

```tsx
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../components/layout/AppLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CreatePlanPage from "../pages/CreatePlanPage";
import TaskProgressPage from "../pages/TaskProgressPage";
import PlanHistoryPage from "../pages/PlanHistoryPage";
import PlanDetailPage from "../pages/PlanDetailPage";
import VersionHistoryPage from "../pages/VersionHistoryPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/create" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="create" replace />} />
        <Route path="create" element={<CreatePlanPage />} />
        <Route path="tasks/:taskId" element={<TaskProgressPage />} />
        <Route path="plans" element={<PlanHistoryPage />} />
        <Route path="plans/:planId" element={<PlanDetailPage />} />
        <Route path="plans/:planId/versions" element={<VersionHistoryPage />} />
        <Route path="plans/:planId/versions/:versionId" element={<PlanDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/app/create" replace />} />
    </Routes>
  );
}
```

如果当前项目使用不同文件名或路由写法，可以按项目实际结构适配，但最终路径语义必须稳定。

---

## 4. ProtectedRoute 修复要求

### 4.1 未登录访问保护页面

未登录访问 `/app/*` 时，应该跳转登录页，并记录原始目标地址。

推荐实现：

```tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
}
```

### 4.2 登录成功后回到原页面

LoginPage 中登录成功后：

```ts
const location = useLocation();
const from = location.state?.from || "/app/create";
navigate(from, { replace: true });
```

必须检查：

```text
登录成功后不会永远跳 /app/create
如果用户原本访问 /app/plans/123，登录后应回到 /app/plans/123
```

---

## 5. 全站跳转链路检查清单

AI 编程助手必须逐项检查以下跳转入口。

### 5.1 顶部导航 TopNav

检查：

```text
点击 Logo -> /app/create
点击 创建方案 -> /app/create
点击 我的行程 -> /app/plans
点击 个人画像 -> /app/profile
点击 设置 -> /app/settings
点击 退出登录 -> 清空 token 后跳转 /login
```

要求：

```text
当前路由高亮正确
不要出现点击导航后空白页
不要出现嵌套路由路径重复，例如 /app/app/create
```

### 5.2 侧边栏 SideNav

检查：

```text
创建方案 -> /app/create
我的方案 -> /app/plans
AI 任务 -> 如果没有 taskId，不应跳无效页面；可跳 /app/create 或显示最近任务
版本记录 -> 如果没有 planId，不应跳无效页面；可跳 /app/plans
个人画像 -> /app/profile
设置 -> /app/settings
```

如果某个菜单依赖业务 ID，不要做成固定空路由。可以隐藏，或者跳到上一级列表页。

### 5.3 登录页

检查：

```text
登录成功 -> location.state.from 或 /app/create
点击注册 -> /register
已登录用户访问 /login -> 自动跳 /app/create
```

如果用户已登录，不应该反复停留在登录页。

### 5.4 注册页

检查：

```text
注册成功 -> /login 或自动登录后 /app/create
点击已有账号登录 -> /login
注册偏好填写完成后不会丢状态
```

如果注册后自动登录，需要确保 token 正确保存。

### 5.5 创建方案页

检查：

```text
点击生成方案
  ↓
调用 createPlan
  ↓
拿到 taskId
  ↓
navigate(ROUTES.task(taskId))
```

必须兼容后端返回：

```json
{ "task_id": "xxx" }
```

或前端 adapter 后：

```ts
{ taskId: "xxx" }
```

如果没有 taskId：

```text
显示错误提示
不要跳转 /app/tasks/undefined
```

### 5.6 任务进度页

检查参数读取：

```ts
const { taskId } = useParams();
```

如果没有 taskId：

```text
显示错误状态
提供返回创建页按钮
不要请求 /api/tasks/undefined
```

任务成功后跳转逻辑：

```text
status === success
  ↓
获取 planId 和 resultVersionId
  ↓
navigate(ROUTES.planDetail(planId, resultVersionId), { replace: true })
```

必须兼容字段：

```text
plan_id
planId
result_version_id
resultVersionId
version_id
versionId
```

如果 task success 但缺少 planId：

```text
展示错误提示
不要跳 /app/plans/undefined
```

### 5.7 历史方案页

检查：

```text
点击方案卡片 -> /app/plans/:planId
点击查看详情 -> /app/plans/:planId
点击版本历史 -> /app/plans/:planId/versions
点击再次生成 -> 调用 regenerate 或 create task 后跳 /app/tasks/:taskId
```

不要使用：

```text
/app/plans/detail
/app/plan/:id
```

统一使用：

```text
/app/plans/:planId
```

如果方案没有 planId：

```text
禁用按钮或显示错误
不要跳 undefined
```

### 5.8 方案详情页

检查参数读取：

```ts
const { planId, versionId: pathVersionId } = useParams();
const [searchParams] = useSearchParams();
const queryVersionId = searchParams.get("versionId");
const versionId = pathVersionId || queryVersionId;
```

支持以下三种访问方式：

```text
/app/plans/:planId
/app/plans/:planId?versionId=xxx
/app/plans/:planId/versions/:versionId
```

详情页必须做到：

```text
有 planId 时请求方案详情
有 versionId 时请求指定版本
没有 versionId 时请求当前版本
刷新页面不崩溃
```

按钮跳转：

```text
返回历史方案 -> /app/plans
查看版本历史 -> /app/plans/:planId/versions
基于当前版本优化 -> 打开抽屉
重新生成 -> 创建 task 后跳 /app/tasks/:taskId
导出 PDF -> 当前页面动作，不应错误跳转
```

如果 planId 无效：

```text
显示错误状态
提供返回历史方案按钮
```

### 5.9 AI 优化抽屉

检查：

```text
提交优化请求
  ↓
需要 planId 和 versionId
  ↓
调用 regenerate API
  ↓
拿到 taskId
  ↓
跳转 /app/tasks/:taskId
```

如果缺少 versionId：

```text
可以使用 currentVersionId 兜底
如果仍不存在，提示错误，不要请求 undefined
```

### 5.10 版本历史页

检查参数读取：

```ts
const { planId } = useParams();
```

如果没有 planId：

```text
显示错误状态
提供返回历史方案按钮
```

版本页按钮：

```text
查看此版本 -> /app/plans/:planId?versionId=:versionId
或 /app/plans/:planId/versions/:versionId
对比上一版本 -> 打开 VersionCompareDrawer
基于此版本重新生成 -> 调用 regenerate 后跳 /app/tasks/:taskId
返回方案详情 -> /app/plans/:planId
```

不要跳：

```text
/app/versions/:versionId
/app/plans/versions/:versionId
```

### 5.11 个人画像页

检查：

```text
保存成功后停留当前页
返回创建页 -> /app/create
从创建页点击个人画像 -> /app/profile
```

---

## 6. ID 与字段适配规范

由于后端可能返回 snake_case，前端页面内部统一使用 camelCase。

建议新增或检查：

```text
src/utils/routeGuards.ts
src/utils/adapters.ts
src/utils/navigation.ts
```

### 6.1 Task adapter

```ts
export function normalizeTask(raw: any) {
  return {
    taskId: raw.taskId ?? raw.task_id ?? raw.id,
    status: raw.status,
    progress: raw.progress ?? 0,
    currentStep: raw.currentStep ?? raw.current_step,
    logs: raw.logs ?? [],
    planId: raw.planId ?? raw.plan_id,
    resultVersionId:
      raw.resultVersionId ??
      raw.result_version_id ??
      raw.versionId ??
      raw.version_id,
    errorMessage: raw.errorMessage ?? raw.error_message,
  };
}
```

### 6.2 Plan adapter

```ts
export function normalizePlan(raw: any) {
  return {
    planId: raw.planId ?? raw.plan_id ?? raw.id,
    currentVersionId: raw.currentVersionId ?? raw.current_version_id,
    title: raw.title,
    city: raw.city,
    startDate: raw.startDate ?? raw.start_date,
    endDate: raw.endDate ?? raw.end_date,
    content: raw.content ?? raw.content_json ?? raw.plan_json ?? raw,
  };
}
```

### 6.3 Version adapter

```ts
export function normalizeVersion(raw: any) {
  return {
    versionId: raw.versionId ?? raw.version_id ?? raw.id,
    planId: raw.planId ?? raw.plan_id,
    parentVersionId: raw.parentVersionId ?? raw.parent_version_id,
    versionNo: raw.versionNo ?? raw.version_no,
    sourceType: raw.sourceType ?? raw.source_type,
    changeSummary: raw.changeSummary ?? raw.change_summary,
    createdAt: raw.createdAt ?? raw.created_at,
    content: raw.content ?? raw.content_json,
  };
}
```

页面跳转时必须使用 normalize 后的字段。

---

## 7. 路由兜底与错误页面

必须实现或检查：

```text
NotFoundPage
RouteErrorState
MissingIdState
```

至少要有兜底：

```text
未知路径 -> /app/create
业务 ID 缺失 -> 错误卡片 + 返回按钮
任务不存在 -> 错误卡片 + 返回创建页
方案不存在 -> 错误卡片 + 返回历史方案
版本不存在 -> 错误卡片 + 返回版本历史
```

不要让页面白屏。

---

## 8. 浏览器刷新与返回按钮要求

必须检查以下场景：

```text
刷新 /app/create 不崩
刷新 /app/tasks/:taskId 不崩
刷新 /app/plans 不崩
刷新 /app/plans/:planId 不崩
刷新 /app/plans/:planId?versionId=xxx 不崩
刷新 /app/plans/:planId/versions 不崩
刷新 /app/profile 不崩
```

浏览器返回按钮：

```text
任务成功跳详情页时建议 replace: true，避免返回又回到已完成任务页导致重复跳转
普通页面跳转不要滥用 replace，保留自然返回
登录重定向使用 replace
退出登录使用 replace
```

---

## 9. React Query 与路由参数联动

所有依赖路由参数的 query 必须使用 enabled 保护。

错误示例：

```ts
useQuery({
  queryKey: ["plan", planId],
  queryFn: () => getPlan(planId!),
});
```

正确示例：

```ts
useQuery({
  queryKey: ["plan", planId, versionId],
  queryFn: () => getPlanDetail(planId!, versionId),
  enabled: Boolean(planId),
});
```

任务轮询：

```ts
useQuery({
  queryKey: ["task", taskId],
  queryFn: () => getTask(taskId!),
  enabled: Boolean(taskId) && shouldPoll,
  refetchInterval: shouldPoll ? 2000 : false,
});
```

不要请求：

```text
/api/tasks/undefined
/api/plans/undefined
/api/plans/null
```

---

## 10. 统一跳转工具

可以新增：

```text
src/utils/navigation.ts
```

用于封装安全跳转。

示例：

```ts
import { ROUTES } from "../router/paths";

export function getTaskRoute(taskId?: string | number) {
  if (!taskId) return null;
  return ROUTES.task(String(taskId));
}

export function getPlanDetailRoute(
  planId?: string | number,
  versionId?: string | number
) {
  if (!planId) return null;
  return ROUTES.planDetail(String(planId), versionId ? String(versionId) : undefined);
}
```

使用时：

```ts
const route = getPlanDetailRoute(planId, versionId);
if (!route) {
  message.error("缺少方案 ID，无法跳转");
  return;
}
navigate(route);
```

---

## 11. 修复执行步骤

AI 编程助手必须按以下顺序执行。

### 阶段 1：梳理现有路由

检查并输出：

```text
当前所有 Route 配置
当前所有页面文件
当前所有 navigate 调用
当前所有 Link/NavLink href
当前所有 useParams 使用位置
当前所有 useSearchParams 使用位置
```

重点搜索：

```text
navigate(
<Link
<NavLink
href=
useParams
useSearchParams
/app/
plans/
tasks/
versions/
```

### 阶段 2：建立统一路由常量

新增或修复：

```text
src/router/paths.ts
```

然后替换项目内分散的路径字符串。

### 阶段 3：修复 Router 配置

确保路径结构统一：

```text
/login
/register
/app/create
/app/tasks/:taskId
/app/plans
/app/plans/:planId
/app/plans/:planId/versions
/app/plans/:planId/versions/:versionId
/app/profile
/app/settings
```

修复嵌套路由、默认重定向和未知路径兜底。

### 阶段 4：修复 ProtectedRoute

确保：

```text
未登录跳 /login
携带 from
登录后回 from
已登录访问 /login 时跳 /app/create
退出登录后跳 /login
```

### 阶段 5：修复任务跳转

重点修：

```text
CreatePlanPage -> TaskProgressPage
TaskProgressPage -> PlanDetailPage
```

确保没有：

```text
/app/tasks/undefined
/app/plans/undefined
```

### 阶段 6：修复方案详情跳转

重点修：

```text
PlanHistoryPage -> PlanDetailPage
PlanDetailPage -> VersionHistoryPage
VersionHistoryPage -> PlanDetailPage
VersionHistoryPage -> regenerate -> TaskProgressPage
AIAssistantDrawer -> regenerate -> TaskProgressPage
```

### 阶段 7：修复参数读取与 query enabled

所有依赖参数的 hook 必须加 enabled。

所有缺失参数页面必须显示错误状态，而不是白屏。

### 阶段 8：修复导航菜单高亮

TopNav / SideNav 当前页面高亮必须正确。

注意：

```text
/app/plans
/app/plans/:planId
/app/plans/:planId/versions
```

这些都可以高亮“我的行程”。

### 阶段 9：全流程测试

必须手动或自动验证以下路径。

```text
1. 未登录访问 /app/create -> /login
2. 登录成功 -> /app/create 或 from
3. /app/create 点击生成 -> /app/tasks/:taskId
4. task success -> /app/plans/:planId?versionId=xxx
5. 详情页点击版本历史 -> /app/plans/:planId/versions
6. 版本页点击查看版本 -> /app/plans/:planId?versionId=xxx
7. 版本页点击基于此版本重新生成 -> /app/tasks/:taskId
8. 历史页点击方案 -> /app/plans/:planId
9. 详情页返回历史 -> /app/plans
10. 刷新 /app/plans/:planId 不崩溃
11. 刷新 /app/tasks/:taskId 不崩溃
12. 退出登录 -> /login
```

---

## 12. Build 与验收要求

修复完成后必须运行：

```bash
npm run build
```

如果项目有 lint：

```bash
npm run lint
```

如果项目有测试：

```bash
npm test
```

必须修复：

```text
TypeScript 路由参数错误
unused imports
undefined route params
React key warning
React Router warning
控制台明显报错
```

---

## 13. 禁止事项

本次修复禁止：

```text
大规模重写 UI
删除核心页面
删除已有 API 层
把所有跳转改成 window.location.href
用硬编码 mock ID 掩盖问题
跳转到 /app/plans/undefined
请求 /api/tasks/undefined
依赖 navigate state 作为唯一数据来源
跳转路径到处手写
不跑 build 就结束
```

---

## 14. 最终交付说明

修复完成后，AI 编程助手必须输出：

```text
1. 修复了哪些路由配置
2. 新增了哪些路由常量或工具函数
3. 修复了哪些页面跳转
4. 修复了哪些参数读取问题
5. 哪些地方添加了缺失参数兜底
6. npm run build 是否通过
7. 仍然存在的风险或需要人工确认的点
```

---

## 15. 可直接给 AI 编程助手的执行指令

可以直接复制以下提示词：

```text
请阅读 ROUTING_FIX_SKILL.md，并严格按照其中的要求系统性修复本项目的前端页面跳转和路由逻辑问题。

当前项目 UI 页面基本完成，不要重写 UI，不要重新设计页面，不要大规模修改样式。你的任务是完整检查并修复全站路由、页面跳转、参数传递、鉴权重定向、任务完成跳转、详情页跳转、版本页跳转、浏览器刷新和返回逻辑。

请先搜索并梳理项目中所有 Route 配置、navigate 调用、Link/NavLink、useParams、useSearchParams、ProtectedRoute、TopNav、SideNav、CreatePlanPage、TaskProgressPage、PlanHistoryPage、PlanDetailPage、VersionHistoryPage 和 AIAssistantDrawer 中的跳转逻辑。

然后按以下顺序修复：
1. 建立或修复 src/router/paths.ts，统一所有路由常量；
2. 修复 Router 配置，保证 /login、/register、/app/create、/app/tasks/:taskId、/app/plans、/app/plans/:planId、/app/plans/:planId/versions、/app/plans/:planId/versions/:versionId、/app/profile、/app/settings 都可用；
3. 修复 ProtectedRoute，确保未登录跳 /login，并携带 from，登录后回到原页面；
4. 修复 CreatePlanPage 创建任务后跳转 /app/tasks/:taskId，避免 taskId 缺失时跳 undefined；
5. 修复 TaskProgressPage 读取 taskId、轮询任务、success 后跳转 /app/plans/:planId?versionId=xxx；
6. 修复 PlanHistoryPage 到详情页、版本历史页、再次生成任务页的跳转；
7. 修复 PlanDetailPage 对 planId 和 versionId 的读取，支持 /app/plans/:planId、/app/plans/:planId?versionId=xxx、/app/plans/:planId/versions/:versionId；
8. 修复 VersionHistoryPage 查看版本、对比版本、基于版本重新生成、返回详情页的跳转；
9. 修复 AIAssistantDrawer 重新生成后跳转任务页；
10. 修复 TopNav 和 SideNav 的导航路径和当前页面高亮；
11. 给所有依赖路由参数的 React Query 添加 enabled 保护，避免请求 /undefined；
12. 给缺失 taskId、planId、versionId 的页面添加错误状态和返回按钮；
13. 测试刷新详情页、任务页、版本页不会白屏；
14. 最后运行 npm run build，修复所有错误后再结束。

禁止通过硬编码固定 ID 掩盖问题。禁止把所有跳转改成 window.location.href。禁止依赖 navigate state 作为唯一数据来源。必须使用 URL 参数作为页面刷新后的可信来源。

完成后请输出：修改了哪些文件、修复了哪些跳转链路、npm run build 是否通过、还有哪些风险需要我确认。
```
