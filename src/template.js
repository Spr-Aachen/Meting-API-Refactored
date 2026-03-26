import example from "./example.js"
import { get_runtime, get_url } from "./util.js"
import { renderLayout, renderDocsLayout } from "./layout.js"


let audiolist = `
<h1 style="padding: 30px;padding-bottom: 15px;">测试</h1>
<div class="audiolist">
`
Object.keys(example).map(provider => {
    Object.keys(example[provider]).map(type => {
        if (!example[provider][type].show) return

        audiolist += `
    <div>
        <p>${provider} ${type}</p>
        <meting-js server="${provider}" type="${type}" id="${example[provider][type].value}" list-folded=true />
    </div>
    <br/>
`
    })
})
audiolist += `
</div>
`

let html = renderLayout({
    title: '测试',
    bodyContent: audiolist,
    extraScripts: `
    <script>
        var meting_api = 'api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
    </script>
    <script src="https://unpkg.com/@xizeyoupan/meting@latest/dist/Meting.min.js"></script>
    `
})
export const docs = (c) => {
    const docsContent = `
    <h1 style="padding: 30px;padding-bottom: 15px;">文档</h1>
    <div class="text-lg" style="margin: 20px;padding: 10px;">
        <h2>接口使用说明</h2>
        <br>
        <div class="panel font-mono text-xl">
            ${get_url(c)}/server=<span class="special-pale">[server]</span>&type=<span
                class="special-pale">[type]</span>&id=<span class="special-pale">[id]</span>
        </div>
        <table class="table panel">
            <thead>
                <tr>
                    <th>参数名</th>
                    <th>默认值</th>
                    <th>参数介绍</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="special-pale">server</code></td>
                    <td><code>netease</code></td>
                    <td>指定获取 json 音乐相关信息的音乐平台名。选填 <code>netease</code>、<code>tencent</code>、<code>ytmusic</code>、<code>spotify</code>。</td>
                </tr>
                <tr>
                    <td><code class="special-pale">type</code></td>
                    <td><code>playlist</code></td>
                    <td>指定获取 json 音乐相关信息的类型。选填<code>lrc</code>(歌词)、<code>url</code>(歌曲链接)、<code>pic</code>(封面图片)、<code>song</code>(歌曲信息)、<code>playlist</code>(歌单)、<code>artist</code>(歌手)、<code>search</code>(搜索)。</td>
                </tr>
                <tr>
                    <td><code class="special-pale">id</code></td>
                    <td><code>9564899591</code></td>
                    <td>大多数情况下该值为歌曲id、歌单id。<code>search</code> 是个例外，请在 <code>search</code> 的 <code>id</code> 参数里写您要搜索的内容。</td>
                </tr>
            </tbody>
        </table>
        <br>
        <h2>支持的平台</h2>
        <br>
        <table class="table panel">
            <thead>
                <tr>
                    <th>平台</th>
                    <th>server参数</th>
                    <th>单曲</th>
                    <th>歌单</th>
                    <th>歌手</th>
                    <th>搜索</th>
                    <th>歌词</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>网易云音乐</td>
                    <td><code>netease</code></td>
                    <td>√</td>
                    <td>√</td>
                    <td>√</td>
                    <td>√</td>
                    <td>√</td>
                </tr>
                <tr>
                    <td>QQ音乐</td>
                    <td><code>tencent</code></td>
                    <td>√</td>
                    <td>√</td>
                    <td>-</td>
                    <td>-</td>
                    <td>√</td>
                </tr>
                <tr>
                    <td>YouTube Music</td>
                    <td><code>ytmusic</code></td>
                    <td>√</td>
                    <td>√</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>Spotify</td>
                    <td><code>spotify</code></td>
                    <td>√</td>
                    <td>√</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            </tbody>
        </table>
        <br>
        <h2>接口使用Demo</h2>
        <br>
        <div class="input-group panel">
            <select class="form-control mserver">
                <option>netease</option>
                <option>tencent</option>
                <option>ytmusic</option>
                <option>spotify</option>
            </select>
            <select class="form-control mclass">
                <option>playlist</option>
                <option>lrc</option>
                <option>url</option>
                <option>pic</option>
                <option>song</option>
                <option>artist</option>
                <option>search</option>
            </select>
            <input type="text" class="form-control mid" placeholder="id">
            <button type="button" class="btn" onclick="clearbutton()"><i class="icon icon-remove"></i></button>
            <button type="button" class="btn" onclick="searchbutton()"><i class="icon icon-search"></i></button>
        </div>
        <div id="aplayer"></div>
    </div>
    `

    const extraScripts = `
        <script src="https://cdn.jsdelivr.net/npm/aplayer@1.10.0/dist/APlayer.min.js"></script>
        <script>
            const ap = new APlayer({ container: document.getElementById('aplayer') });
            function clearbutton(){ ap.list.clear(); }
            function sendMusicRequest(mserver,mclass,mid) {
                const mserverv= encodeURIComponent(mserver);
                const mclassv= encodeURIComponent(mclass);
                const midv= encodeURIComponent(mid);
                const url = "api?server="+mserverv+"&type="+mclassv+"&id="+midv;
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const data = JSON.parse(xhr.responseText);
                        ap.list.add(data);
                    }
                };
                xhr.onerror = function() {};
                xhr.send();
            }
            function searchbutton() { sendMusicRequest(document.querySelector('.mserver').value, document.querySelector('.mclass').value, document.querySelector('.mid').value); }
        </script>
    `

    return c.html(renderDocsLayout({title: '文档', bodyContent: docsContent, extraScripts}))
}
export const handler = (c) => {
    return c.html(html)
}