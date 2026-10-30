import app from "./app.js"
import { setEnv } from "./src/utils/env.js"

export default {
    async fetch(request, env, ctx) {
        // Worker 的 vars/secrets 只能通过 env 参数拿到，注入后才能被 src/ 读取
        setEnv(env)
        return app.fetch(request, env, ctx)
    }
}