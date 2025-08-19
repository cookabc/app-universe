import { execSync } from 'child_process';
import { config } from 'dotenv';

config({ path: '.env.local' });

execSync('bunx drizzle-kit generate', { stdio: 'inherit' });
