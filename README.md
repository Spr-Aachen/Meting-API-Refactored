# Meting-API (Refactored)

一个简洁优雅的音乐 API 服务，支持多平台音乐数据获取。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)


## 支持平台

| 平台 | server参数 | 单曲 | 歌单 | 歌手 | 搜索 | 歌词 |
|------|-----------|------|------|------|------|------|
| 网易云 | netease | ✓ | ✓ | ✓ | ✓ | ✓ |
| QQ音乐 | tencent | ✓ | ✓ | - | - | ✓ |
| YouTube Music | ytmusic | ✓ | ✓ | - | - | - |
| Spotify | spotify | ✓ | ✓ | - | - | - |


## 本地测试

```bash
# 使用 pnpm
pnpm install
pnpm run start:node

# 或使用 bun
bun install
bun run start:node
```


## 快速部署

### Vercel (推荐)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Spr-Aachen/Meting-API-Refactored)

部署后在项目 Settings → Environment Variables 添加：

| 变量名 | 说明 |
|--------|------|
| `METING_COOKIE_NETEASE` | 网易云完整 Cookie（含 `MUSIC_U`），VIP 歌曲必需 |
| `METING_COOKIE_ALLOW_HOSTS` | 可选，限制哪些 referrer 可用 Cookie（留空则不限制，测试临时域名时先留空） |

`vercel.json` 已把 Functions 区域固定为 `hkg1`（香港），用于避开海外出口的版权限制；Hobby 计划只允许单区域，若部署报区域错误就删掉 `regions` 字段。

> 注意：`*.vercel.app` 域名在中国大陆常被 DNS 污染，验证时建议用代理访问，或临时加一个自定义子域（CNAME 到 Vercel，先灰云签发证书再开 Cloudflare 代理）


## 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| OVERSEAS | false | 设为 1 启用海外模式（自动适配 Vercel/Cloudflare） |
| PORT | 3000 | 服务监听端口 |
| RUNTIME | auto | 运行环境: vercel/cloudflare/node |
| METING_COOKIE_ALLOW_HOSTS | `` | 限制哪些 referrer 来源可使用 Cookie（逗号分隔，空表示不限制） |
| METING_COOKIE_{SERVER} | - | 各平台完整 Cookie 字符串（例如 `METING_COOKIE_NETEASE`） |


## API 使用

### 基本格式

```
GET /api?server=<server>&type=<type>&id=<id>
```

### 参数说明

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| server | 否 | netease | 音乐平台: netease/tencent/ytmusic/spotify |
| type | 否 | playlist | 数据类型: url/lrc/pic/song/playlist/artist/search |
| id | 否 | 9564899591 | 资源 ID（搜索时为关键词） |

### 示例

```
# 获取网易云歌单
/api?server=netease&type=playlist&id=9564899591

# 获取歌曲链接
/api?server=netease&type=url&id=537787665

# 搜索歌曲
/api?server=netease&type=search&id=歌手名
```