USE travel_agent;

-- =========================================
-- Test 1: 查询所有用户
-- =========================================

SELECT * FROM users;

-- =========================================
-- Test 2: 用户名唯一约束测试
-- 预期：失败
-- =========================================

INSERT INTO users (
    username,
    email,
    password,
    status
)
VALUES (
    '张三',
    'zhangsan@example.com',
    'hash',
    'active'
);

-- =========================================
-- Test 3: 邮箱唯一约束测试
-- 预期：失败
-- =========================================

INSERT INTO users (
    username,
    email,
    password,
    status
)
VALUES (
    'newuser',
    'zhang@example.com',
    'hash',
    'active'
);

-- =========================================
-- Test 4: 外键测试（不存在用户）
-- 预期：失败
-- =========================================

INSERT INTO trip_plans (
    owner_user_id,
    title
)
VALUES (
    999,
    'Invalid Plan'
);

-- =========================================
-- Test 5: 查询用户历史行程
-- 测试联合索引
-- =========================================

SELECT *
FROM trip_plans
WHERE owner_user_id = 1
ORDER BY updated_at DESC;

-- =========================================
-- Test 6: 按城市搜索
-- =========================================

SELECT *
FROM trip_plans
WHERE city = '成都';

-- =========================================
-- Test 7: JSON 提取测试
-- =========================================

SELECT
    id,
    JSON_EXTRACT(content_json, '$.hotel') AS hotel
FROM trip_plan_version;

-- =========================================
-- Test 8: JSON 条件查询
-- =========================================

SELECT *
FROM trip_plan_version
WHERE JSON_EXTRACT(content_json, '$.days') = 7;

-- =========================================
-- Test 9: CHECK 约束测试
-- 预期：失败
-- =========================================

INSERT INTO plan_tasks (
    user_id,
    task_type,
    request_json,
    progress
)
VALUES (
    1,
    'generate_plan',
    JSON_OBJECT(),
    120
);

-- =========================================
-- Test 10: 更新任务状态
-- =========================================

UPDATE plan_tasks
SET
    status = 'running',
    progress = 80
WHERE id = 2;

SELECT * FROM plan_tasks WHERE id = 2;

-- =========================================
-- Test 11: 创建新版本
-- =========================================

INSERT INTO trip_plan_version (
    plan_id,
    parent_version_id,
    owner_user_id,
    version_no,
    source_type,
    change_summary,
    content_json
)
VALUES (
    1,
    2,
    1,
    3,
    'regenerated',
    'AI regenerated day 4',
    JSON_OBJECT(
        'days', 7,
        'hotel', '这旅馆可真旅馆啊',
        'updated_day', 4
    )
);

-- =========================================
-- Test 12: 版本号唯一约束
-- 预期：失败
-- =========================================

INSERT INTO trip_plan_version (
    plan_id,
    owner_user_id,
    version_no,
    source_type,
    content_json
)
VALUES (
    1,
    1,
    1,
    'edited',
    JSON_OBJECT()
);

-- =========================================
-- Test 13: Explain 索引测试
-- =========================================

EXPLAIN
SELECT *
FROM trip_plans
WHERE owner_user_id = 1
ORDER BY updated_at DESC;

-- =========================================
-- Test 14: 删除 plan 测试级联
-- 注意：执行后会删除关联版本
-- =========================================

DELETE FROM trip_plans
WHERE id = 1;

-- =========================================
-- Test 15: 查看任务状态统计
-- =========================================

SELECT
    status,
    COUNT(*) AS total
FROM plan_tasks
GROUP BY status;