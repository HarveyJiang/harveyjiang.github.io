---
author: Harvey
pubDatetime: 2026-08-31T00:00:00.000Z
title: "Hermes Agent 日常实录：配置、排错与多平台实践"
tags: ["Hermes", "AI Agent", "配置管理", "排错", "DingTalk"]
description: "2026-08-31 的 Hermes 使用记录，涵盖模型配置、Windows Hyper-V/WSL 彻底删除、钉钉平台交互差异排查，以及 MCP 认证待办。"
---

今天对着 Hermes 跑了一天，攒下不少实操笔记。按主题整理如下。

## 1. 模型配置现状

当前走 **Cloudflare AI Gateway** 代理，default 模型是 `dynamic/smart_router`，fallback 是 `openrouter/free`（纯免费层）。

配置在 `~/.hermes/config.yaml` 里：

```yaml
model:
  default: dynamic/smart_router
  provider: cloudflare
  base_url:
    https://gateway.ai.cloudflare.com/v1/{uid}/{gateway_name}/compat
  api_key: ${HERMES_CLOUDFLARE_GATEWAY_API_KEY}
  fallback_model:
    provider: openrouter
    model: openrouter/free
```

`custom_providers` 里注册了两个 provider：cloudflare（主）和 openrouter（fallback）。所有 key 都走环境变量，不落明文。

## 2. Windows 上彻底删除 Hyper-V 和 WSL

有台 Windows 机器要清干净 Hyper-V 和 WSL，整理了完整步骤：

**卸载 WSL 发行版：**
```powershell
wsl --shutdown
wsl --unregister <distribution-name>
Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
Disable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
```

**卸载 Hyper-V：**
```powershell
Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V
Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-Management-Powershell
Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-Services
```

**清理虚拟网络适配器：**
```powershell
Get-NetAdapter | Where-Object {$_.InterfaceDescription -match "vEthernet|Hyper-V|WSL"} | Disable-NetAdapter -Confirm:$false
```

> ⚠️ 踩坑记录：`Remove-NetAdapter` 在某些系统上报"无法识别"，原因是 **NetAdapter 模块未导入**。先 `Import-Module NetAdapter` 即可。如果仍不行，用 `ncpa.cpl` 手动删虚拟适配器更稳。

**验证：**
```powershell
wsl --list --verbose          # 应返回"没有安装的 Linux 发行版"
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
# State 应为 Disabled
```

## 3. 钉钉上 `/new` 为什么从按钮变成了文本命令？

有用户反馈：Hermes 在钉钉上 approve 操作时，以前有三个按钮点一下就行，现在要手动输入 `/approve`、`/always`、`/cancel`。

**根因：钉钉 API 限制，不是 Hermes 的问题。**

| 平台 | 按钮支持 |
|------|---------|
| Telegram / Discord / Slack | ✅ 原生 Inline Keyboard |
| 钉钉 / 飞书 / 企业微信 | ❌ 不支持自定义按钮，回退文本命令 |
| CLI / TUI | ✅ 终端菜单 |

这是 Hermes 自动适配平台能力的结果。想恢复按钮体验，得换到 Telegram 之类的平台。

`display.interface` 当前支持两个值：
- `cli`（默认）— 标准终端
- `tui` — Ink TUI，支持 Docked Widget Apps

改完需要 `/reset` 才生效。

## 4. MCP OAuth 认证待办

5 个 Cloudflare MCP servers 配置了，但其中 4 个（`cloudflare`、`cloudflare-bindings`、`cloudflare-builds`、`cloudflare-observability`）连接失败——需要 OAuth 认证。只有 `cloudflare-docs` 是公共的，无需认证。

重启 Hermes 后认证流程没自动触发，这个还得处理。

## 5. 一个小观察

Hermes 的 **Profile 体系**很实用。不同场景（日常/开发/运维/金融/创作）用独立 Profile 隔离配置、技能、记忆，互不污染。配合 `intent-router` skill，可以按关键词自动路由——不加前缀走 daily，`[dev]` 走 dev profile。

---

*以上是 2026-08-31 的 Hermes 实操记录。下次攒够新话题再续。*
