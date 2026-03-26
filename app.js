import api from './src/service/api.js'
import { handler, docs } from './src/template.js'
import { renderLayout } from './src/layout.js'


let siteVersion = ''
try {
    const fs = await import('fs')
    const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
    siteVersion = pkg.version || ''
} catch (e) {
    siteVersion = ''
}
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import config from './src/config.js'
import { get_runtime, get_url } from './src/util.js'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.get('/api', api)
app.get('/test', handler)
app.get('/docs', docs)
app.get('/', (c) => {
    const extraHead = `
        <style>
            .tag { padding: 5px; margin: 5px; }
            .v-card { padding: 5px; margin: 5px; display: flex; }
            .card-group { display: flex; flex-wrap: wrap; }
            .panel { padding: 5px; margin: 10px; height: 100px; width: 95%; }
            @media (min-width: 768px) { .panel { width: calc(50% - 20px); } }
            @media (min-width: 1024px) { .panel { width: calc(33% - 20px); } }
        </style>
    `

    const bodyContent = `
        <h1 style="padding: 30px 0;">What is Meting API</h1>
        <p style="font-size:16px;padding: 18px 0;">Meting API 是轻量级的音乐元数据接口，提供歌曲、歌单、歌词等数据，可部署在无服务器平台。</p>
        <div style="margin: 20px;">
            <div style="display: flex;">
                <a href="https://github.com/Spr-Aachen/Meting-API-Refactored" style="text-decoration: none;"><img alt="Github@Spr-Aachen/Meting-API-Refactored Static Badge" src="https://img.shields.io/badge/Github-Meting--API-green" class="tag"></a>
                <a href="https://github.com/Spr-Aachen/Meting-API-Refactored" style="text-decoration: none;"><img alt="Github@Spr-Aachen/Meting-API-Refactored forks" src="https://img.shields.io/github/forks/Spr-Aachen/Meting-API-Refactored" class="tag"></a>
                <a href="https://github.com/Spr-Aachen/Meting-API-Refactored" style="text-decoration: none;"><img alt="Github@Spr-Aachen/Meting-API-Refactored Repo stars" src="https://img.shields.io/github/stars/Spr-Aachen/Meting-API-Refactored" class="tag"></a>
            </div>
            <br>
            <div class="card-group">
                <div class="panel"><div class="panel-heading"><div class="panel-title">当前运行环境</div></div><div class="panel-body"><p>${get_runtime()}</p></div></div>
                <div class="panel"><div class="panel-heading"><div class="panel-title">部署在大陆</div></div><div class="panel-body"><p>${config.OVERSEAS ? 'N O' : 'Y E S'}</p></div></div>
                <div class="panel"><div class="panel-heading"><div class="panel-title">内部端口</div></div><div class="panel-body"><p>${config.PORT}</p></div></div>
            </div>
        </div>
    `

    return c.html(renderLayout({ title: 'Meting API', bodyContent, extraHead, siteVersion }))
})

export default app