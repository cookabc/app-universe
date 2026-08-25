import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site.ts'
import { buildHomeJsonLd } from './structured-data.ts'

test('homepage JSON-LD declares WebSite and Organization identity', () => {
    const jsonLd = buildHomeJsonLd() as {
        '@context': string
        '@graph': Array<Record<string, any>>
    }
    assert.equal(jsonLd['@context'], 'https://schema.org')

    const graph = jsonLd['@graph']
    const website = graph.find((node) => node['@type'] === 'WebSite')
    const organization = graph.find((node) => node['@type'] === 'Organization')

    assert.ok(website, 'JSON-LD graph includes a WebSite node')
    assert.equal(website.name, SITE_NAME)
    assert.equal(website.url, SITE_URL)
    assert.equal(website.description, SITE_DESCRIPTION)
    assert.deepEqual(website.inLanguage, ['en', 'zh'])

    assert.ok(organization, 'JSON-LD graph includes an Organization node')
    assert.equal(organization.name, SITE_NAME)
    assert.equal(organization.url, SITE_URL)
    assert.equal(organization.logo.url, `${SITE_URL}/icon.svg`)

    assert.equal(website.publisher['@id'], organization['@id'], 'WebSite references the Organization')
})

test('homepage JSON-LD serializes without undefined leaks', () => {
    const serialized = JSON.stringify(buildHomeJsonLd())
    assert.ok(!serialized.includes('undefined'))
    assert.deepEqual(JSON.parse(serialized), buildHomeJsonLd())
})
