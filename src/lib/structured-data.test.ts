import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site.ts'
import { buildHomeJsonLd } from './structured-data.ts'

test('homepage JSON-LD declares a language-specific WebSite and a shared Organization', () => {
    const jsonLd = buildHomeJsonLd('en') as {
        '@context': string
        '@graph': Array<Record<string, any>>
    }
    assert.equal(jsonLd['@context'], 'https://schema.org')

    const graph = jsonLd['@graph']
    const website = graph.find((node) => node['@type'] === 'WebSite')
    const organization = graph.find((node) => node['@type'] === 'Organization')

    assert.ok(website, 'JSON-LD graph includes a WebSite node')
    assert.equal(website.name, SITE_NAME)
    assert.equal(website.url, `${SITE_URL}/en`)
    assert.equal(website.description, SITE_DESCRIPTION)
    assert.equal(website.inLanguage, 'en')

    assert.ok(organization, 'JSON-LD graph includes an Organization node')
    assert.equal(organization.name, SITE_NAME)
    assert.equal(organization.url, SITE_URL)
    assert.equal(organization.description, SITE_DESCRIPTION)
    assert.equal(organization.logo.url, `${SITE_URL}/icon.svg`)

    assert.equal(website.publisher['@id'], organization['@id'], 'WebSite references the Organization')
})

test('Chinese homepage JSON-LD points at the Chinese URL', () => {
    const description = '面向设计、开发与创意工作的人工策展指南。'
    const jsonLd = buildHomeJsonLd('zh', description) as {
        '@graph': Array<Record<string, any>>
    }
    const website = jsonLd['@graph'].find((node) => node['@type'] === 'WebSite')
    const organization = jsonLd['@graph'].find((node) => node['@type'] === 'Organization')
    assert.ok(website)
    assert.ok(organization)
    assert.equal(website.url, `${SITE_URL}/zh`)
    assert.equal(website['@id'], `${SITE_URL}/zh/#website`)
    assert.equal(website.description, description)
    assert.equal(website.inLanguage, 'zh')
    assert.equal(organization['@id'], `${SITE_URL}/#organization`)
})

test('homepage JSON-LD serializes without undefined leaks', () => {
    const serialized = JSON.stringify(buildHomeJsonLd('en'))
    assert.ok(!serialized.includes('undefined'))
    assert.deepEqual(JSON.parse(serialized), buildHomeJsonLd('en'))
})
