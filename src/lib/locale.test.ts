import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import tools from '../data/tools.ts'
import {
    fillTemplate,
    legacyStorageRedirect,
    localeFromAcceptLanguage,
    localeFromCookie,
    localeFromPathname,
    localePath,
    preferredLocale,
    replaceLocale,
    stripLocalePrefix,
} from './locale.ts'
import { planPublicRequest } from './locale-routing.ts'
import { buildLanguageAlternates, buildPageMetadata, buildSitemapEntries } from './seo.ts'
import { SITE_NAME, SITE_URL } from './site.ts'

test('locale paths keep both languages addressable and preserve query and hash', () => {
    assert.equal(localePath('en', '/'), '/en')
    assert.equal(localePath('zh', '/'), '/zh')
    assert.equal(localePath('zh', '/t/open-design'), '/zh/t/open-design')
    assert.equal(localePath('en', '/privacy'), '/en/privacy')
    assert.equal(localePath('zh', '/?tag=ai#tools'), '/zh?tag=ai#tools')
    assert.equal(localePath('en', '/t/open-design?seed=abc#tools'), '/en/t/open-design?seed=abc#tools')
    assert.equal(replaceLocale('/en/t/open-design', 'zh'), '/zh/t/open-design')
    assert.equal(replaceLocale('/zh', 'en'), '/en')
    assert.equal(replaceLocale('/privacy', 'zh'), '/zh/privacy')
})

test('only exact /en and /zh prefixes are locales', () => {
    assert.equal(localeFromPathname('/en'), 'en')
    assert.equal(localeFromPathname('/zh/t/open-design'), 'zh')
    assert.equal(localeFromPathname('/'), null)
    assert.equal(localeFromPathname('/privacy'), null)
    assert.equal(localeFromPathname('/enterprise'), null)
    assert.equal(localeFromPathname('/en-us'), null)
    assert.equal(stripLocalePrefix('/en'), '/')
    assert.equal(stripLocalePrefix('/zh/t/open-design'), '/t/open-design')
    assert.equal(stripLocalePrefix('/en/'), '/')
    assert.equal(stripLocalePrefix('/privacy'), '/privacy')
    assert.equal(stripLocalePrefix('/enterprise'), '/enterprise')
})

test('cookie wins over Accept-Language, then English', () => {
    assert.equal(localeFromCookie('theme=dark; i18next=zh'), 'zh')
    assert.equal(localeFromCookie('i18next=zh-CN'), 'zh')
    assert.equal(localeFromCookie('i18next=EN'), 'en')
    assert.equal(localeFromCookie('i18next=fr'), null)
    assert.equal(localeFromCookie(null), null)

    assert.equal(localeFromAcceptLanguage('zh-CN,zh;q=0.9,en;q=0.8'), 'zh')
    assert.equal(localeFromAcceptLanguage('en-US,en;q=0.9,zh-CN;q=0.8'), 'en')
    assert.equal(localeFromAcceptLanguage('fr-FR,fr;q=0.9,zh;q=0.8'), 'zh')
    assert.equal(localeFromAcceptLanguage('fr,de'), null)
    assert.equal(localeFromAcceptLanguage('zh;q=0, en;q=0.1'), 'en')
    assert.equal(localeFromAcceptLanguage('*'), null)

    assert.equal(preferredLocale('i18next=en', 'zh-CN,zh;q=0.9'), 'en')
    assert.equal(preferredLocale('i18next=nope', 'zh'), 'zh')
    assert.equal(preferredLocale(null, null), 'en')
})

test('legacy storage redirect only bridges a missing cookie', () => {
    assert.equal(legacyStorageRedirect('/en/t/open-design', 'zh', null), '/zh/t/open-design')
    assert.equal(legacyStorageRedirect('/en?tag=ai#tools', 'zh-Hans', null), '/zh?tag=ai#tools')
    assert.equal(legacyStorageRedirect('/zh/privacy', 'en', null), '/en/privacy')
    assert.equal(legacyStorageRedirect('/zh', 'zh', null), null)
    assert.equal(legacyStorageRedirect('/en', 'zh', 'i18next=en'), null)
    assert.equal(legacyStorageRedirect('/en', null, null), null)
    assert.equal(legacyStorageRedirect('/en', 'fr', null), null)
    assert.equal(legacyStorageRedirect('/privacy', 'zh', null), null)
})

test('markdown negotiation happens before the locale redirect', () => {
    assert.deepEqual(
        planPublicRequest({
            pathname: '/',
            accept: 'text/markdown',
            cookieHeader: 'i18next=zh',
            acceptLanguage: null,
        }),
        { kind: 'markdown' },
    )
    assert.deepEqual(
        planPublicRequest({
            pathname: '/zh/privacy',
            accept: 'text/markdown',
            cookieHeader: null,
            acceptLanguage: null,
        }),
        { kind: 'markdown' },
    )
    assert.deepEqual(
        planPublicRequest({
            pathname: '/',
            accept: 'text/html',
            cookieHeader: 'i18next=zh',
            acceptLanguage: 'en',
        }),
        { kind: 'redirect', locale: 'zh', pathname: '/zh' },
    )
    assert.deepEqual(
        planPublicRequest({
            pathname: '/t/open-design',
            accept: null,
            cookieHeader: null,
            acceptLanguage: 'zh-CN,zh;q=0.9,en;q=0.8',
        }),
        { kind: 'redirect', locale: 'zh', pathname: '/zh/t/open-design' },
    )
    assert.deepEqual(
        planPublicRequest({
            pathname: '/privacy',
            accept: null,
            cookieHeader: null,
            acceptLanguage: null,
        }),
        { kind: 'redirect', locale: 'en', pathname: '/en/privacy' },
    )
    assert.deepEqual(
        planPublicRequest({
            pathname: '/en/terms',
            accept: 'text/html',
            cookieHeader: 'i18next=zh',
            acceptLanguage: null,
        }),
        { kind: 'html', locale: 'en' },
    )
    assert.equal(
        planPublicRequest({ pathname: '/robots.txt', accept: null, cookieHeader: null, acceptLanguage: null }).kind,
        'passthrough',
    )
    assert.equal(
        planPublicRequest({ pathname: '/opengraph-image', accept: null, cookieHeader: null, acceptLanguage: null })
            .kind,
        'passthrough',
    )
    assert.equal(
        planPublicRequest({
            pathname: '/zh/t/open-design/opengraph-image',
            accept: 'text/markdown',
            cookieHeader: null,
            acceptLanguage: null,
        }).kind,
        'passthrough',
    )
})

test('page metadata advertises canonical, hreflang, and the page language', () => {
    const home = buildPageMetadata({
        locale: 'zh',
        suffix: '/',
        title: 'App Universe — 值得留下的工具',
        description: '中文简介',
        absoluteTitle: true,
    })
    assert.equal(home.alternates?.canonical, '/zh')
    assert.equal(home.alternates?.languages?.en, '/en')
    assert.equal(home.alternates?.languages?.zh, '/zh')
    assert.equal(home.alternates?.languages?.['x-default'], '/en')
    assert.deepEqual(home.title, { absolute: 'App Universe — 值得留下的工具' })
    assert.equal(home.description, '中文简介')
    assert.equal(home.openGraph?.locale, 'zh_CN')
    assert.deepEqual(home.openGraph?.alternateLocale, ['en_US'])
    assert.equal(home.openGraph?.url, `${SITE_URL}/zh`)

    const tool = buildPageMetadata({
        locale: 'en',
        suffix: '/t/open-design',
        title: 'Open Design',
        description: 'A note',
    })
    assert.equal(tool.title, 'Open Design')
    assert.equal(tool.openGraph?.title, `Open Design — ${SITE_NAME}`)
    assert.equal(tool.alternates?.canonical, '/en/t/open-design')
    assert.equal(tool.alternates?.languages?.zh, '/zh/t/open-design')
    assert.deepEqual(buildLanguageAlternates('en', '/privacy').languages, {
        en: '/en/privacy',
        zh: '/zh/privacy',
        'x-default': '/en/privacy',
    })
})

test('sitemap lists every page in both languages and omits legacy unprefixed URLs', () => {
    const entries = buildSitemapEntries(new Date('2026-07-17T00:00:00.000Z'))
    assert.equal(entries.length, (3 + tools.length) * 2)

    const urls = entries.map((entry) => entry.url)
    assert.ok(urls.includes(`${SITE_URL}/en`))
    assert.ok(urls.includes(`${SITE_URL}/zh`))
    assert.ok(urls.includes(`${SITE_URL}/en/privacy`))
    assert.ok(urls.includes(`${SITE_URL}/zh/terms`))
    for (const tool of tools) {
        assert.ok(urls.includes(`${SITE_URL}/en/t/${tool.id}`))
        assert.ok(urls.includes(`${SITE_URL}/zh/t/${tool.id}`))
    }
    assert.equal(
        urls.some((url) => url === SITE_URL || url === `${SITE_URL}/` || url === `${SITE_URL}/privacy`),
        false,
    )
    assert.equal(
        urls.some((url) => /\/t\/[^/]+$/.test(url) && !/\/(en|zh)\/t\//.test(url)),
        false,
    )

    const homeZh = entries.find((entry) => entry.url === `${SITE_URL}/zh`)
    assert.ok(homeZh)
    assert.equal(homeZh.alternates?.languages?.en, `${SITE_URL}/en`)
    assert.equal(homeZh.alternates?.languages?.zh, `${SITE_URL}/zh`)
    assert.equal(homeZh.alternates?.languages?.['x-default'], `${SITE_URL}/en`)
    assert.equal(homeZh.priority, 1)

    const featured = tools.find((tool) => tool.featured)
    const plain = tools.find((tool) => !tool.featured)
    assert.ok(featured && plain)
    assert.equal(entries.find((entry) => entry.url === `${SITE_URL}/en/t/${featured.id}`)?.priority, 0.8)
    assert.equal(entries.find((entry) => entry.url === `${SITE_URL}/zh/t/${plain.id}`)?.priority, 0.6)
})

test('both locale files translate the skip link, legal pages, and home metadata', () => {
    const en = JSON.parse(readFileSync(new URL('../../public/locales/en/common.json', import.meta.url), 'utf8'))
    const zh = JSON.parse(readFileSync(new URL('../../public/locales/zh/common.json', import.meta.url), 'utf8'))

    assert.equal(en.nav.skipToContent, 'Skip to content')
    assert.notEqual(zh.nav.skipToContent, en.nav.skipToContent)
    assert.equal(en.meta.description.includes('hand-curated field guide'), true)
    assert.notEqual(zh.meta.title, en.meta.title)
    assert.notEqual(zh.meta.description, en.meta.description)

    for (const key of [
        'backHome',
        'updated',
        'questionsLead',
        'privacyTitle',
        'privacyDescription',
        'privacyIntro',
        'privacySpecifically',
        'privacyTheme',
        'privacyLanguage',
        'privacyExternal',
        'privacyChanges',
        'termsTitle',
        'termsDescription',
        'termsIntro',
        'termsRisk',
        'termsWarranty',
    ]) {
        assert.equal(typeof en.legal[key], 'string', `en.legal.${key}`)
        assert.equal(typeof zh.legal[key], 'string', `zh.legal.${key}`)
        assert.notEqual(zh.legal[key], en.legal[key], key)
    }
    assert.match(fillTemplate(en.legal.privacyIntro, { site: 'App Universe' }), /does not collect personal data/)
    assert.match(fillTemplate(zh.legal.privacyIntro, { site: 'App Universe' }), /不收集个人数据/)
    assert.match(en.legal.termsWarranty, /as is/)
    assert.match(zh.legal.privacyTheme, /主题/)
})
