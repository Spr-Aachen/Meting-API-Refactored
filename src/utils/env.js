// Environment utility: unify environment variable access across runtimes.
// Runtime entry points inject values through setEnv; src/ uses getEnv to read them.

let platformEnv = null

export function setEnv (env) {
    if (env === null) {
        platformEnv = null
        return
    }
    if (env && typeof env === 'object') platformEnv = env
}

export function getEnv (key) {
    if (!key) return undefined
    // 1. 运行时注入的绑定（Cloudflare Worker env / 其它包装层）
    if (platformEnv && typeof platformEnv[key] === 'string') return platformEnv[key]
    // 2. Node（含本地部署与 Vercel）
    if (typeof globalThis?.process?.env !== 'undefined') {
        const v = globalThis.process.env[key]
        if (typeof v === 'string') return v
    }
    // 3. Deno（读取不存在的变量会抛错）
    if (typeof globalThis?.Deno?.env?.get === 'function') {
        try {
            const v = globalThis.Deno.env.get(key)
            if (typeof v === 'string') return v
        } catch (e) {
            return undefined
        }
    }
    return undefined
}