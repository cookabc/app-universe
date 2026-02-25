import { sleep } from "bun";

// Mock fetchFundData to simulate network delay
async function fetchFundData(code: string): Promise<string> {
    // Simulate varying delay between 100ms and 300ms
    const delay = 100 + Math.random() * 200;
    await sleep(delay);
    if (Math.random() < 0.1) {
        throw new Error(`Failed to fetch ${code}`);
    }
    return `Data for ${code}`;
}

const codes = Array.from({ length: 20 }, (_, i) => i.toString().padStart(6, '0'));

async function sequentialRefresh() {
    const updated: string[] = [];
    const start = performance.now();
    for (const c of codes) {
        try {
            const data = await fetchFundData(c);
            updated.push(data);
        } catch (e) {
            // console.error(e);
        }
    }
    const end = performance.now();
    return end - start;
}

async function parallelRefresh() {
    const updated: string[] = [];
    const start = performance.now();

    const results = await Promise.allSettled(codes.map(c => fetchFundData(c)));

    for (const result of results) {
        if (result.status === 'fulfilled') {
            updated.push(result.value);
        } else {
            // console.error(result.reason);
        }
    }

    const end = performance.now();
    return end - start;
}

async function runBenchmark() {
    console.log(`Benchmarking refresh for ${codes.length} funds...`);

    // Warmup
    await sequentialRefresh();
    await parallelRefresh();

    const seqTime = await sequentialRefresh();
    console.log(`Sequential: ${seqTime.toFixed(2)}ms`);

    const parTime = await parallelRefresh();
    console.log(`Parallel:   ${parTime.toFixed(2)}ms`);

    const improvement = seqTime / parTime;
    console.log(`Speedup:    ${improvement.toFixed(2)}x`);
}

runBenchmark();
