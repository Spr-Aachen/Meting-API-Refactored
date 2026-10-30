import { describe, test, expect, afterEach } from 'vitest'
import { readCookieFile, parseCookie, isAllowedHost } from '../src/utils/cookie.js'
import { setEnv } from '../src/utils/env.js'
import { get_song_url } from '../src/providers/netease/song.js'


describe('Cookie env forwarding', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
    delete process.env.METING_COOKIE_NETEASE
    setEnv(null)
  })

  test('read METING_COOKIE_NETEASE and forward as Cookie header', async () => {
    process.env.METING_COOKIE_NETEASE = 'MUSIC_U=abc;TEST=1'

    const cookie = await readCookieFile('netease')
    expect(cookie).toBe('MUSIC_U=abc;TEST=1')

    let capturedCookie
    global.fetch = async (url, settings) => {
      capturedCookie = settings.headers && (settings.headers.Cookie || settings.headers.cookie)
      return {
        arrayBuffer: async () => {
          const payload = JSON.stringify({ data: [{ url: 'https://cdn.example/test.mp3' }] })
          return new TextEncoder().encode(payload).buffer
        }
      }
    }

    const url = await get_song_url('1874976923', cookie)
    expect(capturedCookie).toContain('MUSIC_U=abc')
    expect(url).toContain('https://cdn.example/test.mp3')
  })

  test('read cookie injected by runtime (cloudflare worker env)', async () => {
    // Worker 里 secrets 不在 process.env，只能通过 env 参数注入
    setEnv({ METING_COOKIE_WORKERTEST: 'MUSIC_U=worker' })
    const cookie = await readCookieFile('workertest')
    expect(cookie).toBe('MUSIC_U=worker')
  })

  test('strip "Cookie:" prefix and newlines', async () => {
    setEnv({ METING_COOKIE_FILETEST: 'Cookie: MUSIC_U=a\n; OS=pc' })
    const cookie = await readCookieFile('filetest')
    expect(cookie).toBe('MUSIC_U=a; OS=pc')
  })

  test('parseCookie keeps values with broken escape sequences', () => {
    const cookie = parseCookie('MUSIC_U=abc;gdxidpyhxdE=Vi6tIlyRN9jD%2')
    expect(cookie.MUSIC_U).toBe('abc')
    expect(cookie.gdxidpyhxdE).toBe('Vi6tIlyRN9jD%2')
  })

  test('truncated cookie still forwards MUSIC_U', async () => {
    let capturedCookie
    global.fetch = async (url, settings) => {
      capturedCookie = settings.headers.Cookie
      return {
        arrayBuffer: async () => {
          const payload = JSON.stringify({ data: [{ url: 'https://cdn.example/vip.mp3' }] })
          return new TextEncoder().encode(payload).buffer
        }
      }
    }

    const url = await get_song_url('1874976923', 'MUSIC_U=abc;gdxidpyhxdE=Vi6tIlyRN9jD%2')
    expect(capturedCookie).toContain('MUSIC_U=abc')
    expect(url).toBe('https://cdn.example/vip.mp3')
  })

  test('allowHosts read lazily from injected env', () => {
    expect(isAllowedHost('https://meting.example.com')).toBe(true)
    setEnv({ METING_COOKIE_ALLOW_HOSTS: ' Meting.Example.com , other.com' })
    expect(isAllowedHost('https://meting.example.com/player')).toBe(true)
    expect(isAllowedHost('https://evil.com')).toBe(false)
  })
})