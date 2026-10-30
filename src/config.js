import { get_runtime } from "./util.js"
import { getEnv } from "./utils/env.js"


let OVERSEAS = getEnv("OVERSEAS")

if (['cloudflare', 'vercel'].includes(get_runtime())) OVERSEAS = true

const PORT = getEnv("PORT") || 3000

OVERSEAS = Boolean(OVERSEAS)

const parseHosts = (v) => v ? String(v).split(',').map(h => h.trim().toLowerCase()).filter(Boolean) : []

export default {
    OVERSEAS,
    PORT,
    meting: {
        cookie: {
            // 运行时的 env 绑定在模块加载后才注入（Worker），因此每次读取时再解析
            get allowHosts () {
                return parseHosts(getEnv('METING_COOKIE_ALLOW_HOSTS'))
            }
        }
    },
}