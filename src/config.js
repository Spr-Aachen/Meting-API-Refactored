import { get_runtime } from "./util.js"


let OVERSEAS = globalThis?.Deno?.env?.get("OVERSEAS") || globalThis?.process?.env?.OVERSEAS
const runtime = get_runtime()

if (['cloudflare', 'vercel'].includes(runtime)) OVERSEAS = true

const PORT = globalThis?.Deno?.env?.get("PORT") || globalThis?.process?.env?.PORT || 3000

OVERSEAS = Boolean(OVERSEAS)

export default {
    OVERSEAS,
    PORT,
    meting: {
        cookie: {
            allowHosts: (() => {
                const v = globalThis?.Deno?.env?.get('METING_COOKIE_ALLOW_HOSTS') || globalThis?.process?.env?.METING_COOKIE_ALLOW_HOSTS
                return v ? String(v).split(',').map(h => h.trim().toLowerCase()) : []
            })()
        }
    },
}