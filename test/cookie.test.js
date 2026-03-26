import { describe, test, expect, afterEach } from 'vitest'
import { readCookieFile } from '../src/utils/cookie.js'
import { get_song_url } from '../src/providers/netease/song.js'


describe('Cookie env forwarding', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
    delete process.env.METING_COOKIE_NETEASE
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
})