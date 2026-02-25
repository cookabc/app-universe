
interface FundData {
    code: string
    name: string
    dwjz?: string
    gsz?: string
    gztime?: string
    jzrq?: string
    gszzl?: string | number
    estGszzl?: number
    estGsz?: number
    estPricedCoverage?: number
    zzl?: number
}

interface Group {
    id: string
    name: string
    codes: string[]
}

const generateFunds = (count: number): FundData[] => {
    return Array.from({ length: count }, (_, i) => ({
        code: i.toString().padStart(6, '0'),
        name: `Fund ${i}`,
        gszzl: Math.random() * 10 - 5,
        estGszzl: Math.random() * 10 - 5,
    }))
}

const funds = generateFunds(1000)
const favorites = new Set(funds.slice(0, 100).map(f => f.code))
const groups: Group[] = [
    { id: 'group1', name: 'Group 1', codes: funds.slice(100, 200).map(f => f.code) }
]
const currentTab = 'all'
const sortBy = 'yield'

function runLogic() {
    return funds
        .filter((f) => {
            if (currentTab === 'all') return true
            if (currentTab === 'fav') return favorites.has(f.code)
            const group = groups.find((g) => g.id === currentTab)
            return group ? group.codes.includes(f.code) : true
        })
        .sort((a, b) => {
            if (sortBy === 'yield') {
                const valA = typeof a.estGszzl === 'number' ? a.estGszzl : Number(a.gszzl) || 0
                const valB = typeof b.estGszzl === 'number' ? b.estGszzl : Number(b.gszzl) || 0
                return valB - valA
            }
            if (sortBy === 'name') return a.name.localeCompare(b.name, 'zh-CN')
            if (sortBy === 'code') return a.code.localeCompare(b.code)
            return 0
        })
}

console.log('Running benchmark...')
const start = performance.now()
const iterations = 1000
for (let i = 0; i < iterations; i++) {
    runLogic()
}
const end = performance.now()
console.log(`Time taken for ${iterations} iterations with 1000 funds: ${(end - start).toFixed(2)}ms`)
console.log(`Average time per iteration: ${((end - start) / iterations).toFixed(4)}ms`)
