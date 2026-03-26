import { describe, expect, test } from 'vitest'
import Providers from '../src/providers/index.js'


describe('Providers', () => {
    test('should register all providers', () => {
        const p = new Providers()
        const list = p.get_provider_list()
        
        expect(list).toContain('netease')
        expect(list).toContain('tencent')
        expect(list).toContain('ytmusic')
        expect(list).toContain('spotify')
    })

    test('should have correct support types', () => {
        const p = new Providers()
        const netease = p.get('netease')
        
        expect(netease.support_type).toContain('playlist')
        expect(netease.support_type).toContain('song')
        expect(netease.support_type).toContain('artist')
        expect(netease.support_type).toContain('search')
    })
})