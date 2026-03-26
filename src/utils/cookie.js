// Cookie utility: read cookie from env (METING_COOKIE_{SERVER}) or cookie/{server} file
import config from '../config.js'


const cookieCache = new Map()
const COOKIE_TTL = 1000 * 60 * 5 // 5 minutes

function getEnvCookie (server) {
    const key = `METING_COOKIE_${server.toUpperCase()}`
    if (typeof globalThis?.process?.env !== 'undefined') {
        return globalThis.process.env[key]
    }
    if (typeof globalThis?.Deno?.env?.get === 'function') {
        return globalThis.Deno.env.get(key)
    }
    return undefined
}

async function readFileCookie (server) {
    const path = `cookie/${server}`
    try {
        if (typeof globalThis?.process !== 'undefined') {
        const { readFile } = await import('node:fs/promises')
        const { resolve } = await import('node:path')
        const cookiePath = resolve(process.cwd(), path)
        const txt = await readFile(cookiePath, 'utf8')
        return txt
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

    const envCookie = getEnvCookie(server)
    if (envCookie) {
        const value = String(envCookie).replace(/\r?\n/g, ' ').trim()
        cookieCache.set(server, { value, timestamp: now })
        return value
    }

    try {
        const txt = await readFileCookie(server)
        const value = txt ? String(txt).replace(/\r?\n/g, ' ').trim() : ''
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