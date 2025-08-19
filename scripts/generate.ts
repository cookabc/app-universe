
import { config } from 'dotenv';
import { execSync } from 'child_process';

config({ path: '.env.local' });

execSync('bunx drizzle-kit generate', { stdio: 'inherit' });
