export function renderLayout({title = 'Meting API', bodyContent = '', extraHead = '', extraScripts = '', siteName = 'Meting API', siteVersion = ''} = {}) {
    const navTitle = siteName + (siteVersion ? ` v${siteVersion}` : '')
    return `<!DOCTYPE html>
<html lang="zh-CN" id="htmlid">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <link rel="stylesheet" href="https://unpkg.com/zui@3.0.0/dist/zui.css">
    <link rel="stylesheet" href="https://unpkg.com/aplayer/dist/APlayer.min.css">
    ${extraHead}
</head>

<body>
    <style>
        .container { padding: 20px; max-width: 1100px; margin: 0 auto; }
        header.site-nav { padding: 20px 0; border-bottom: 1px solid #eee; }
        footer.site-footer { padding: 20px 0; border-top: 1px solid #eee; margin-top: 40px; text-align: center; color: #666 }
        .audiolist { padding: 20px; margin: 30px 0; }
        /* Ensure embedded players are responsive and don't leave empty right-side gaps */
        meting-js, .meting-js, .aplayer, .aplayer-wrap, .APlayer, .Meting-player { width: 100% !important; max-width: 100% !important; box-sizing: border-box; }
        .audiolist > div { width: 100%; }
        .audiolist p { margin-bottom: 8px; }
        .style-group { position: fixed; right: 24px; bottom: 24px; display: flex; flex-direction: column; gap: 9px; align-items: center; z-index: 9999; }
        @media (max-width: 629px) { .style-group { right: 12px; bottom: 12px; gap: 6px; } }
        #htmlid.dark {
            .aplayer { background: #1e293b; }
            .aplayer .aplayer-lrc:before { background: linear-gradient(to bottom, rgb(30, 41, 59) 0%, rgba(255, 255, 255, 0) 100%); }
            .aplayer .aplayer-lrc:after { background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(30, 41, 59, 0.726) 100%); }
        }
    </style>

    <header class="site-nav container">
        <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
                <a href="/" style="font-weight:700;font-size:20px;color:inherit;text-decoration:none;">${navTitle}</a>
            </div>
            <nav>
                <a href="/" class="btn btn-link">首页</a>
                <a href="/test" class="btn btn-link">测试</a>
                <a href="/docs" class="btn btn-link">文档</a>
            </nav>
        </div>
    </header>

    <main class="container">
        ${bodyContent}
    </main>

    <footer class="site-footer">
        <div class="container">&copy; Meting API — 简洁的音乐元数据接口</div>
    </footer>

    <div class="btn-group style-group">
        <button class="btn" type="button" onclick="style_light()" id="style_light"><i class="icon icon-sun"></i></button>
        <button class="btn" type="button" onclick="style_dark()" id="style_dark"><i class="icon icon-moon"></i></button>
        <button class="btn active" type="button" onclick="style_auto()" id="style_auto"><i class="icon icon-desktop"></i></button>
    </div>

    <script src="https://unpkg.com/zui@3.0.0/dist/zui.js"></script>
    <script src="https://unpkg.com/aplayer/dist/APlayer.min.js"></script>
    ${extraScripts}

    <script>
        let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; let element = document.getElementById('htmlid'); element.classList.toggle('dark', isDarkMode); element.classList.toggle('light', !isDarkMode);
        function style_auto() { let click = document.getElementById('style_auto'); click.classList.add("active"); let rd = document.getElementById('style_dark'); rd.classList.remove("active"); let rl = document.getElementById('style_light'); rl.classList.remove("active"); let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; let element = document.getElementById('htmlid'); element.classList.toggle('dark', isDarkMode); element.classList.toggle('light', !isDarkMode); }
        function style_dark() { let click = document.getElementById('style_dark'); click.classList.add("active"); let rl = document.getElementById('style_light'); rl.classList.remove("active"); let ra = document.getElementById('style_auto'); ra.classList.remove("active"); let element = document.getElementById('htmlid'); element.className = "dark"; }
        function style_light() { let click = document.getElementById('style_light'); click.classList.add("active"); let rd = document.getElementById('style_dark'); rd.classList.remove("active"); let ra = document.getElementById('style_auto'); ra.classList.remove("active"); let element = document.getElementById('htmlid'); element.className = "light"; }
    </script>
</body>

</html>`
}

export function renderDocsLayout({title = 'Meting API 文档', bodyContent = '', extraHead = '', extraScripts = ''} = {}) {
    return renderLayout({title, bodyContent, extraHead, extraScripts})
}