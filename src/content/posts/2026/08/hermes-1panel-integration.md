---
author: Harvey
pubDatetime: 2026-08-30T00:00:00.000Z
title: "Hermes Agent 多 Profile 架构与 1Panel 集成实践"
tags: ['Hermes', 'AI-Agent', '1Panel', '运维', '自动化', 'tech']
description: "Hermes Agent 多 Profile 架构、1Panel API 集成与 Cloudflare MCP 实践。"
---

> 本文记录在 Hermes Agent 上构建多 Profile 架构、整合多服务器 Tailscale 运维、并接入 1Panel 官方 API 的完整过程。所有内网 IP、Token、域名均已脱敏。

---

## 一、Profile 体系与意图路由

Hermes Agent 支持多 Profile 隔离配置和会话。最终采用 6 个 Profile：

| Profile | 职责 | 关键配置 |
|---------|------|----------|
| `default` | 日常对话 + 智能路由入口 | `max_turns=5`，`toolsets.enabled=[web, skills, memory, ...]` |
| `ops` | 服务器运维 / 面板操作 / 部署 | `redact_secrets=true`，`tirith_enabled=true`，`approvals.mode=manual` |
| `dev` | 代码生成 / 调试 / PR | 默认配置 |
| `finance` | 金融分析 | 默认配置 |
| `creator` | 自媒体内容 | 默认配置 |
| `edu` | 教育场景 | 默认配置 |

> **设计决策**：合并 `daily` → `default`，让 `default` 承担"日常+路由入口"双重职责。

### 1.1 意图路由（intent-router）

`~/.hermes/skills/intent-router/router.py` 实现的智能路由：

- **触发器**：`@xxx` 简写（`@dev`/`@ops`/`@fin`/`@cre`/`@edu`）或方括号 `[xxx]`
- **匹配策略**：长前缀优先（避免短别名被抢先匹配）
- **分类路径**：关键词快速匹配 → LLM 智能分类（free tier 模型）→ fallback 到 `default`

### 1.2 dev → ops 自动交接

dev profile 完成代码后自动调用 ops profile 委派部署：

```bash
hermes --profile ops chat -q "把 ~/myapp 部署到 bwg"
# 或
hermes delegate_task <task>
```

---

## 二、多服务器 Tailscale 运维

### 2.1 设备清单（脱敏后）

| 设备 | 系统 | 角色 | 状态 |
|------|------|------|------|
| `main` | Linux (aarch64) | AI 主力，2 核 / 7.7 GiB | 在线，提供 exit node |
| `bwg` | Linux (x86_64) | 轻量监控，1 核 / 520 MiB | 在线 |
| `dbs` | Linux (x86_64) | 存储 + 开发，2 核 / 956 MiB | 在线 |
| `20ta` | Windows | 个人工作站 | 离线 21 天 |
| `gt` | Android | 个人手机 | 离线，**维护自动排除** |

> Tailscale IP 在文档中省略，避免暴露内网拓扑。

### 2.2 安全审计结果

经过多轮高危修复，整体安全评分从 **75 → 80**：

| 服务器 | 修复前 | 修复后 | 主要变化 |
|--------|--------|--------|----------|
| `main` | 75 | **82** | 1Panel/Docker API 限 Tailscale，CUPS 禁用 |
| `bwg` | — | **82** | bitwarden/nezha 限 Tailscale |
| `dbs` | 70 | **80** | 冗余镜像清理 ~5GB，traffMonetizer 删除 |

**UFW 关键规则**（main）：

```
80,443/tcp               ALLOW IN  Anywhere
Anywhere on tailscale0   ALLOW IN  Anywhere
SSH (15072)              ALLOW IN  172.31.0.0/16
```

**关闭公网**：1Panel 管理面板、Docker API
**已停止服务**：CUPS（云服务器无打印需求）、postfix、exim4

---

## 三、Token 整合到 ops Profile

### 3.1 来源与脱敏展示

把分散的 Token 集中到 `~/.hermes/profiles/ops/.env`（chmod 600）：

| Token | 来源 | 脱敏后 |
|-------|------|--------|
| `GITEE_TOKEN` | 1Panel OpenChamber 配置 | `80d4****0a9e` |
| `CLOUDFLARE_API_TOKEN` | 1Panel OpenChamber 配置 | `cfut****f1159` |
| `PANEL_API_TOKEN` | 1Panel OpenChamber 配置 | `nDIS****lTjz` |
| `CLOUDFLARE_ACCOUNT_ID` | wrangler 配置 | 已脱敏 |
| `OPENCHAMBER_UI_PASSWORD` | 容器环境变量 | 已脱敏 |

**集成方式**：

```bash
# 本地 cat 读取 → bash 变量赋值 → 写入 ops .env（不经模型外发明文）
API_KEY=$(cat /opt/.../api-token)
echo "PANEL_API_TOKEN=$API_KEY" >> ~/.hermes/profiles/ops/.env
chmod 600 ~/.hermes/profiles/ops/.env
```

### 3.2 验证结果

| 服务 | 状态 |
|------|------|
| Gitee API | ✅ 有效（user 验证通过） |
| Cloudflare API | ✅ 有效（account 名称匹配） |
| 1Panel API | ⚠️ 需 HMAC-SHA256 签名（见下文） |

> **安全建议**：在集成过程中，Token 完整值曾在终端输出中明文出现，**强烈建议轮换**。

---

## 四、1Panel v2 API 集成（核心交付）

### 4.1 鉴权机制

1Panel v2（>= 2.2.5）使用 **HMAC-SHA256** 签名（推荐）或 MD5（兼容旧版）：

```bash
TS=$(date +%s)
TOKEN=$(printf '1panel:%s' "$TS" | openssl dgst -sha256 -hmac "$API_KEY" -hex | awk '{print $2}')

# 请求
curl -X POST "${BASE_URL}/api/v2/toolbox/device/base" \
  -H "1Panel-Token: $TOKEN" \
  -H "1Panel-Timestamp: $TS" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 4.2 端点实测（与官方文档有差异）

| 类别 | 端点 | 实测 |
|------|------|------|
| Host Info | `POST /api/v2/toolbox/device/base` | ✅ 200 |
| Settings | `POST /api/v2/core/settings/search/base` | ✅ 200 |
| Apps Installed | `POST /api/v2/apps/installed/search` | ✅ 200 |
| Containers (simple) | `POST /api/v2/containers/list` | ✅ 200 |
| **404 路径** | `/api/v2/dashboard/base/os`、`/api/v2/host/info` | ❌ v2.2.5 已删除 |
| **拦截路径** | `/1panel/api/v2/...`、`/api/v1/...` | ❌ nginx 拦截 |

### 4.3 两个 Skill 的取舍

| Skill | 实现 | 适用场景 |
|-------|------|----------|
| `1panel-api` | Python + HMAC-SHA256 | 写操作 + 原始 HTTP 访问 |
| `1panel-skills-cli` | Node 包装官方 1Panel-skills | 56 个只读 action，8 个模块 |

`1panel-skills-cli` 模块清单：

- **monitoring** (10) — 资源监控、Top 进程、GPU 历史
- **websites** (10) — 网站 / Nginx / SSL 证书读取
- **apps** (9) — 应用市场 / 已装应用检查
- **containers** (9) — 容器状态 / Inspect / 资源统计
- **logs** (4) — 操作 / 登录 / 系统日志
- **cronjobs** (7) — 定时任务 / 记录 / 日志
- **task-center** (2) — 任务中心
- **nodes** (5) — 节点状态

### 4.4 Vendor 模式

`vendor/` 把外部依赖代码**直接放进 skill 内部**，让 skill 自包含、可独立运行：

```
1panel-skills-cli/
├── SKILL.md
├── scripts/
│   ├── 1panel.sh       # wrapper
│   └── install.sh      # git clone 上游
└── vendor/
    └── 1Panel-skills/  # 完整上游仓库
```

**优势**：
- 不污染全局 `node_modules`
- 跟随 `~/.hermes/skills/` 一起备份
- `install.sh` idempotent（已存在则 `git pull --ff-only`）

---

## 五、Cloudflare MCP 集成

### 5.1 当前状态

| MCP | 状态 | 鉴权 |
|-----|------|------|
| `cloudflare-docs` | ✅ 可用 | 公开，无需认证 |
| `cloudflare` | ❌ 需 OAuth | API Token 被拒（`invalid_token`）|
| `cloudflare-bindings` / `-builds` / `-observability` | ❌ DNS 不可达 | OAuth |

### 5.2 关键发现

**Cloudflare MCP 强制 OAuth，不接受 API Token**——这是 CF 平台策略，无法绕过。

### 5.3 AI Gateway 路由配置

Cloudflare AI Gateway 的路由策略**无公共 API**，只能 Dashboard 配置。`smart_router` 路由的实际目标在 CF 端动态选择，触发 OpenRouter 免费模型每日配额耗尽时会报错：

```
Billing or credits exhausted: free-models-per-day-high-balance
```

**解决方式**：在 OpenRouter 充值 / 改付费模型 / 等待 daily reset。

---

## 六、决策与经验

1. **合并 `daily` → `default`**：让 `default` 承担"日常+路由入口"双重职责
2. **`agent.max_turns = 5`**：路由阶段只需意图判断，降低延迟
3. **使用内置 DingTok WebSocket 长连接**：避免暴露公网
4. **@xxx 简写 + 长前缀优先**：避免短别名被抢先匹配
5. **GT Android 设备维护排除**：长期离线、不适合服务器维护
6. **本地 cat 读取 Token → bash 变量赋值 → 写入 ops .env**：不经模型外发明文
7. **Vendor 模式**：skill 自包含、依赖管理幂等
8. **Operational 状态变更（如改付费模型）由用户手动**：遵循"求真 > 迎合"原则

---

## 七、待办事项

| 任务 | 优先级 | 状态 |
|------|--------|------|
| 轮换 PANEL_API_TOKEN / CLOUDFLARE_API_TOKEN / GITEE_TOKEN | 🔴 高 | 待办 |
| `hermes mcp login cloudflare` 完成 OAuth 授权 | 🟡 中 | 待办 |
| 修复 5 个 Error 状态应用 | 🟡 中 | 待办 |
| OpenRouter 配额（充值或换付费模型）| 🟡 中 | 用户手动 |

---

## 八、参考资源

- [1Panel v2 API 文档](https://1panel.cn/docs/v2/dev_manual/api_manual/)
- [1Panel-skills 上游](https://github.com/1Panel-dev/1Panel-skills)
- [Hermes Agent 文档](https://hermes-agent.nousresearch.com/docs)
