import { NextResponse } from 'next/server'

// 模拟树形结构数据
const mockTreeData = [
    {
        dentryId: 1,
        inodeId: 1,
        parentId: null,
        name: 'ETF',
        type: 'folder',
        children: [
            {
                dentryId: 2,
                inodeId: 2,
                parentId: 1,
                name: 'QQQ',
                type: 'stock',
                symbol: 'QQQ',
                ticker: 'QQQ',
                description: 'Invesco QQQ Trust',
            },
            {
                dentryId: 3,
                inodeId: 3,
                parentId: 1,
                name: 'SPY',
                type: 'stock',
                symbol: 'SPY',
                ticker: 'SPY',
                description: 'SPDR S&P 500 ETF Trust',
            },
        ],
    },
    {
        dentryId: 4,
        inodeId: 4,
        parentId: null,
        name: '数据中心',
        type: 'folder',
        children: [
            {
                dentryId: 5,
                inodeId: 5,
                parentId: 4,
                name: 'NVDA',
                type: 'stock',
                symbol: 'NVDA',
                ticker: 'NVDA',
                description: 'NVIDIA Corporation',
            },
            {
                dentryId: 6,
                inodeId: 6,
                parentId: 4,
                name: 'AMD',
                type: 'stock',
                symbol: 'AMD',
                ticker: 'AMD',
                description: 'Advanced Micro Devices, Inc.',
            },
        ],
    },
    {
        dentryId: 7,
        inodeId: 7,
        parentId: null,
        name: 'AI产业链',
        type: 'folder',
        children: [
            {
                dentryId: 8,
                inodeId: 8,
                parentId: 7,
                name: 'AAPL',
                type: 'stock',
                symbol: 'AAPL',
                ticker: 'AAPL',
                description: 'Apple Inc.',
            },
            {
                dentryId: 9,
                inodeId: 9,
                parentId: 7,
                name: 'MSFT',
                type: 'stock',
                symbol: 'MSFT',
                ticker: 'MSFT',
                description: 'Microsoft Corporation',
            },
            {
                dentryId: 10,
                inodeId: 10,
                parentId: 7,
                name: 'GOOG.US',
                type: 'stock',
                symbol: 'GOOGL',
                ticker: 'GOOG',
                description: 'Alphabet - C',
            },
        ],
    },
    {
        dentryId: 11,
        inodeId: 11,
        parentId: null,
        name: '存储',
        type: 'folder',
        children: [
            {
                dentryId: 12,
                inodeId: 12,
                parentId: 11,
                name: 'MU',
                type: 'stock',
                symbol: 'MU',
                ticker: 'MU',
                description: 'Micron Technology, Inc.',
            },
        ],
    },
    {
        dentryId: 13,
        inodeId: 13,
        parentId: null,
        name: '半导体设备',
        type: 'folder',
        children: [
            {
                dentryId: 14,
                inodeId: 14,
                parentId: 13,
                name: 'ASML',
                type: 'stock',
                symbol: 'ASML',
                ticker: 'ASML',
                description: 'ASML Holding N.V.',
            },
        ],
    },
    {
        dentryId: 15,
        inodeId: 15,
        parentId: null,
        name: '加密货币挖矿',
        type: 'folder',
        children: [
            {
                dentryId: 16,
                inodeId: 16,
                parentId: 15,
                name: 'MARA',
                type: 'stock',
                symbol: 'MARA',
                ticker: 'MARA',
                description: 'Marathon Digital Holdings, Inc.',
            },
            {
                dentryId: 17,
                inodeId: 17,
                parentId: 15,
                name: 'RIOT',
                type: 'stock',
                symbol: 'RIOT',
                ticker: 'RIOT',
                description: 'Riot Platforms, Inc.',
            },
        ],
    },
    {
        dentryId: 18,
        inodeId: 18,
        parentId: null,
        name: '科技巨头',
        type: 'folder',
        children: [
            {
                dentryId: 19,
                inodeId: 19,
                parentId: 18,
                name: 'META',
                type: 'stock',
                symbol: 'META',
                ticker: 'META',
                description: 'Meta Platforms, Inc.',
            },
            {
                dentryId: 20,
                inodeId: 20,
                parentId: 18,
                name: 'AMZN',
                type: 'stock',
                symbol: 'AMZN',
                ticker: 'AMZN',
                description: 'Amazon.com, Inc.',
            },
            {
                dentryId: 21,
                inodeId: 21,
                parentId: 18,
                name: 'TSLA',
                type: 'stock',
                symbol: 'TSLA',
                ticker: 'TSLA',
                description: 'Tesla, Inc.',
            },
        ],
    },
    {
        dentryId: 22,
        inodeId: 22,
        parentId: null,
        name: '加密货币',
        type: 'folder',
        children: [
            {
                dentryId: 23,
                inodeId: 23,
                parentId: 22,
                name: 'BTC-USD',
                type: 'stock',
                symbol: 'BTC-USD',
                ticker: 'BTC',
                description: 'Bitcoin USD',
            },
            {
                dentryId: 24,
                inodeId: 24,
                parentId: 22,
                name: 'ETH-USD',
                type: 'stock',
                symbol: 'ETH-USD',
                ticker: 'ETH',
                description: 'Ethereum USD',
            },
        ],
    },
]

export async function GET() {
    try {
        // 模拟数据库查询延迟
        await new Promise((resolve) => setTimeout(resolve, 200))

        return NextResponse.json(mockTreeData, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error fetching portfolio tree:', error)
        return NextResponse.json({ error: 'Failed to fetch portfolio tree' }, { status: 500 })
    }
}
