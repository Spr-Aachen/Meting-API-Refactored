// Cookie utility: read cookie from env (METING_COOKIE_{SERVER}) or cookie/{server} file
import config from '../config.js'
import { getEnv } from './env.js'


const cookieCache = new Map()
const COOKIE_TTL = 1000 * 60 * 5 // 5 minutes

// 有的环境变量里会带上 "Cookie:" 前缀或换行，统一成 "k=v; k2=v2"
// 换行直接去掉（粘贴时可能在值中间被折行，补空格会破坏值）
function normalizeCookie (value) {
    if (!value) return ''
    return String(value)
        .replace(/^\s*cookie\s*:/i, '')
        .replace(/[\r\n]+/g, '')
        .trim()
}

// decodeURIComponent 遇到被截断/非法的转义（如结尾的 "%2"）会抛错，这里保留原值
function decodeSafe (value) {
    try {
        return decodeURIComponent(value)
    } catch (e) {
        return value
    }
}

// 解析 "k=v; k2=v2" 形式的 cookie 字符串
export function parseCookie (cookie) {
    const result = {}
    if (!cookie) return result
    for (const part of String(cookie).split(';')) {
        const index = part.indexOf('=')
        if (index < 0) continue
        const key = decodeSafe(part.slice(0, index).trim())
        if (!key) continue
        result[key] = decodeSafe(part.slice(index + 1).trim())
    }
    return result
}

async function readFileCookie (server) {
    const path = `cookie/${server}`
    try {
        if (typeof globalThis?.process !== 'undefined') {
            const { readFile } = await import('node:fs/promises')
            const { resolve } = await import('node:path')
            const cookiePath = resolve(process.cwd(), path)
            return await readFile(cookiePath, 'utf8')
        }
        if (typeof globalThis?.Deno !== 'undefined') {
            return await Deno.readTextFile(path)
        }
    } catch (e) {
        // ignore
    }
    return ''
}

export async function readCookieFile (server) {
    const now = Date.now()
    const cached = cookieCache.get(server)
    if (cached && now - cached.timestamp < COOKIE_TTL) return cached.value

    const envCookie = getEnv(`METING_COOKIE_${server.toUpperCase()}`)
    if (envCookie) {
        const value = normalizeCookie(envCookie)
        cookieCache.set(server, { value, timestamp: now })
        return value
    }

    try {
        const txt = await readFileCookie(server)
        const value = normalizeCookie(txt)
        cookieCache.set(server, { value, timestamp: now })
        return value
    } catch (e) {
        cookieCache.set(server, { value: '', timestamp: now })
        return ''
    }
}

export function isAllowedHost (referrer) {
    try {
        if (!referrer) return false
        const url = new URL(referrer)
        const host = url.hostname.toLowerCase()
        if (!config.meting || !config.meting.cookie || config.meting.cookie.allowHosts.length === 0) return true
        return config.meting.cookie.allowHosts.includes(host)
    } catch {
        return false
    }
}