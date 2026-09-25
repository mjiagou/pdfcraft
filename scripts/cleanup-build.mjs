import { rmSync, existsSync } from 'fs';
import { join } from 'path';

// Clean up .next directory after static export to free up disk space in CI (EdgeOne /dev/shm, etc.)
const nextDir = join(process.cwd(), '.next');
if (existsSync(nextDir)) {
  try {
    rmSync(nextDir, { recursive: true, force: true });
    console.log('[cleanup] Successfully removed .next directory to reclaim disk space.');
  } catch (err) {
    console.warn('[cleanup] Note: Could not remove .next directory:', err.message);
  }
}
