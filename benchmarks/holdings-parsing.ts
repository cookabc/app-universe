
const htmlMock = `
<table>
    <thead>
        <tr>
            <td>序号</td>
            <td>股票代码</td>
            <td>股票名称</td>
            <td>相关资讯</td>
            <td>持仓占比</td>
            <td>持股数（万股）</td>
            <td>持股市值（万元）</td>
        </tr>
    </thead>
    <tbody>
        ${Array.from({ length: 10 }).map((_, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${(600000 + i).toString()}</td>
            <td>股票名称${i + 1}</td>
            <td>资讯</td>
            <td>${(5.5 - i * 0.1).toFixed(2)}%</td>
            <td>100.00</td>
            <td>550.00</td>
        </tr>
        `).join('')}
    </tbody>
</table>
`;

const CODE_REGEX = /^\d{6}$/;
const WEIGHT_REGEX = /\d+(?:\.\d+)?\s*%/;
const TD_REGEX = /<td[\s\S]*?>([\s\S]*?)<\/td>/gi;
const TAG_REGEX = /<[^>]*>/g;
const TR_REGEX = /<tr[\s\S]*?<\/tr>/gi;

function originalParsing(html: string) {
    const holdings: any[] = [];
    const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    for (const r of rows) {
        const cells = (r.match(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi) || []).map((td: string) =>
            td.replace(/<[^>]*>/g, '').trim(),
        );
        const codeIdx = cells.findIndex((txt: string) => /^\d{6}$/.test(txt));
        const weightIdx = cells.findIndex((txt: string) => /\d+(?:\.\d+)?\s*%/.test(txt));
        if (codeIdx >= 0 && weightIdx >= 0) {
            holdings.push({
                code: cells[codeIdx]!,
                name: cells[codeIdx + 1] ?? '',
                weight: cells[weightIdx]!,
                change: null,
            });
        }
    }
    return holdings;
}

function optimizedParsingV1(html: string) {
    const holdings: any[] = [];
    const rows = html.match(TR_REGEX) || [];
    let codeIdx = -1;
    let weightIdx = -1;

    for (const r of rows) {
        const tdMatches = r.match(TD_REGEX);
        if (!tdMatches) continue;

        const cells = tdMatches.map((td: string) =>
            td.replace(TAG_REGEX, '').trim(),
        );

        if (codeIdx === -1 || weightIdx === -1) {
            codeIdx = cells.findIndex((txt: string) => CODE_REGEX.test(txt));
            weightIdx = cells.findIndex((txt: string) => WEIGHT_REGEX.test(txt));
        }

        if (codeIdx >= 0 && weightIdx >= 0 && codeIdx < cells.length && weightIdx < cells.length) {
            const code = cells[codeIdx];
            if (CODE_REGEX.test(code)) {
                holdings.push({
                    code: code,
                    name: cells[codeIdx + 1] ?? '',
                    weight: cells[weightIdx]!,
                    change: null,
                });
            }
        }
    }
    return holdings;
}

function optimizedParsingV2(html: string) {
    const holdings: any[] = [];
    const rows = html.match(TR_REGEX) || [];
    let codeIdx = -1;
    let weightIdx = -1;

    for (const r of rows) {
        const tdMatches = r.match(TD_REGEX);
        if (!tdMatches) continue;

        if (codeIdx === -1 || weightIdx === -1) {
            const cells = tdMatches.map((td: string) =>
                td.replace(TAG_REGEX, '').trim(),
            );
            codeIdx = cells.findIndex((txt: string) => CODE_REGEX.test(txt));
            weightIdx = cells.findIndex((txt: string) => WEIGHT_REGEX.test(txt));

            if (codeIdx >= 0 && weightIdx >= 0) {
                 holdings.push({
                    code: cells[codeIdx],
                    name: cells[codeIdx + 1] ?? '',
                    weight: cells[weightIdx]!,
                    change: null,
                });
            }
        } else {
            if (codeIdx < tdMatches.length && weightIdx < tdMatches.length) {
                const code = tdMatches[codeIdx].replace(TAG_REGEX, '').trim();

                if (CODE_REGEX.test(code)) {
                    const weight = tdMatches[weightIdx].replace(TAG_REGEX, '').trim();
                    const nameTd = tdMatches[codeIdx + 1];
                    const name = nameTd ? nameTd.replace(TAG_REGEX, '').trim() : '';

                    holdings.push({
                        code,
                        name,
                        weight,
                        change: null,
                    });
                }
            }
        }
    }
    return holdings;
}

function runBenchmark() {
    const iterations = 10000;

    // Verify correctness
    const resOrig = originalParsing(htmlMock);
    const resV1 = optimizedParsingV1(htmlMock);
    const resV2 = optimizedParsingV2(htmlMock);

    if (JSON.stringify(resOrig) !== JSON.stringify(resV1)) {
        console.error("V1 Results don't match!");
    }
    if (JSON.stringify(resOrig) !== JSON.stringify(resV2)) {
        console.error("V2 Results don't match!");
    }

    console.log(`Running benchmark with ${iterations} iterations...`);

    const startOrig = performance.now();
    for (let i = 0; i < iterations; i++) {
        originalParsing(htmlMock);
    }
    const endOrig = performance.now();
    console.log(`Original:  ${(endOrig - startOrig).toFixed(2)}ms`);

    const startV1 = performance.now();
    for (let i = 0; i < iterations; i++) {
        optimizedParsingV1(htmlMock);
    }
    const endV1 = performance.now();
    console.log(`V1:        ${(endV1 - startV1).toFixed(2)}ms`);

    const startV2 = performance.now();
    for (let i = 0; i < iterations; i++) {
        optimizedParsingV2(htmlMock);
    }
    const endV2 = performance.now();
    console.log(`V2:        ${(endV2 - startV2).toFixed(2)}ms`);

    console.log(`V1 Improvement: ${( (endOrig - startOrig) / (endV1 - startV1) ).toFixed(2)}x`);
    console.log(`V2 Improvement: ${( (endOrig - startOrig) / (endV2 - startV2) ).toFixed(2)}x`);
}

runBenchmark();
