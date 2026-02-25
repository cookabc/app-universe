filepath = 'src/app/realtime-fund/page.tsx'

with open(filepath, 'r') as f:
    content = f.read()

search_str = """            for (const c of selectedCodes) {
                if (funds.some((f) => f.code === c)) continue
                try {
                    const data = await fetchFundData(c)
                    newFunds.push(data)
                } catch (err) {
                    failures.push({ code: c, name: nameMap[c] ?? '' })
                }
            }"""

replace_str = """            const codesToAdd = selectedCodes.filter((c) => !funds.some((f) => f.code === c))
            const results = await Promise.allSettled(codesToAdd.map((c) => fetchFundData(c)))

            results.forEach((result, idx) => {
                const c = codesToAdd[idx]
                if (result.status === 'fulfilled') {
                    newFunds.push(result.value)
                } else {
                    failures.push({ code: c, name: nameMap[c] ?? '' })
                }
            })"""

if search_str in content:
    new_content = content.replace(search_str, replace_str)
    with open(filepath, 'w') as f:
        f.write(new_content)
    print("Successfully updated addFund")
else:
    print("Could not find search string for addFund")
