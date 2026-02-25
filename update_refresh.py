import os

filepath = 'src/app/realtime-fund/page.tsx'

with open(filepath, 'r') as f:
    content = f.read()

search_str = """    const refreshAll = async (codes: string[]) => {
        if (refreshingRef.current) return
        refreshingRef.current = true
        setRefreshing(true)
        const uniqueCodes = Array.from(new Set(codes))
        try {
            const updated: FundData[] = []
            for (const c of uniqueCodes) {
                try {
                    const data = await fetchFundData(c)
                    updated.push(data)
                } catch (e) {
                    console.error(`刷新基金 ${c} 失败`, e)
                    setFunds((prev) => {
                        const old = prev.find((f) => f.code === c)
                        if (old) updated.push(old)
                        return prev
                    })
                }
            }

            if (updated.length > 0) {"""

replace_str = """    const refreshAll = async (codes: string[]) => {
        if (refreshingRef.current) return
        refreshingRef.current = true
        setRefreshing(true)
        const uniqueCodes = Array.from(new Set(codes))
        try {
            const results = await Promise.allSettled(uniqueCodes.map((c) => fetchFundData(c)))
            const updated: FundData[] = []

            results.forEach((result, idx) => {
                if (result.status === 'fulfilled') {
                    updated.push(result.value)
                } else {
                    const c = uniqueCodes[idx]
                    console.error(`刷新基金 ${c} 失败`, result.reason)
                    const old = funds.find((f) => f.code === c)
                    if (old) updated.push(old)
                }
            })

            if (updated.length > 0) {"""

if search_str in content:
    new_content = content.replace(search_str, replace_str)
    with open(filepath, 'w') as f:
        f.write(new_content)
    print("Successfully updated refreshAll")
else:
    print("Could not find search string")
    # Debug: print first few chars of search string and where they might be
    print("Search string start:", search_str[:100])
