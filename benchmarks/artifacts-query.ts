import { performance } from 'perf_hooks';

// Simulation of Database Performance: Full Table Scan vs Index Scan

// Configuration
const TABLE_SIZE = 1_000_000;
const USER_ID_TO_FIND = 500_000;
const ITERATIONS = 100;

interface Artifact {
    id: number;
    userId: number;
    content: string;
}

console.log(`Generating ${TABLE_SIZE} artifacts...`);
const artifacts: Artifact[] = [];
for (let i = 0; i < TABLE_SIZE; i++) {
    artifacts.push({
        id: i,
        userId: Math.floor(Math.random() * 1_000_000), // Random user IDs
        content: `Content for artifact ${i}`
    });
}

// Ensure at least one artifact for our target user exists at a random position
artifacts[Math.floor(Math.random() * TABLE_SIZE)].userId = USER_ID_TO_FIND;

// Create an index (Map) on userId
console.log('Building index...');
const artifactsIndex = new Map<number, Artifact[]>();
for (const artifact of artifacts) {
    if (!artifactsIndex.has(artifact.userId)) {
        artifactsIndex.set(artifact.userId, []);
    }
    artifactsIndex.get(artifact.userId)?.push(artifact);
}

// Benchmark: Full Table Scan (O(N))
console.log('\n--- Benchmark: Full Table Scan (O(N)) ---');
const scanStart = performance.now();
let scanCount = 0;
for (let i = 0; i < ITERATIONS; i++) {
    // Simulate finding all artifacts for a user by scanning the entire array
    const results = artifacts.filter(a => a.userId === USER_ID_TO_FIND);
    scanCount += results.length;
}
const scanEnd = performance.now();
const scanTime = scanEnd - scanStart;
console.log(`Total time for ${ITERATIONS} scans: ${scanTime.toFixed(2)}ms`);
console.log(`Average time per scan: ${(scanTime / ITERATIONS).toFixed(4)}ms`);


// Benchmark: Index Lookup (O(1) / O(log N) depending on impl, Map is O(1) avg)
console.log('\n--- Benchmark: Index Lookup (O(1)) ---');
const indexStart = performance.now();
let indexCount = 0;
for (let i = 0; i < ITERATIONS; i++) {
    // Simulate using an index
    const results = artifactsIndex.get(USER_ID_TO_FIND) || [];
    indexCount += results.length;
}
const indexEnd = performance.now();
const indexTime = indexEnd - indexStart;
console.log(`Total time for ${ITERATIONS} lookups: ${indexTime.toFixed(2)}ms`);
console.log(`Average time per lookup: ${(indexTime / ITERATIONS).toFixed(4)}ms`);

console.log(`\nSpeedup Factor: ${(scanTime / indexTime).toFixed(2)}x`);
console.log('Note: This is an in-memory simulation. Database B-Tree index lookups are O(log N), while full table scans are O(N). This demonstrates the algorithmic advantage.');
