#!/usr/bin/env node
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';

const home = process.env.HOME || process.env.USERPROFILE || '';
const lockPath = join(home, 'pnpm-lock.yaml');
try {
  await unlink(lockPath);
} catch (err) {
  // ignore if it doesn't exist
}
