#!/usr/bin/env node
import { rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const files = [
  'bun.lock',
  'bun.lockb',
  'yarn.lock',
  'package-lock.json'
];

async function cleanLocks() {
  for (const f of files) {
    if (existsSync(f)) {
      try {
        await rm(f, { force: true });
        process.stdout.write(`[pre-commit] removed ${f}\n`);
      } catch {}
    }
  }
}

function checkPnpm() {
  const res = spawnSync('pnpm', ['--version'], { encoding: 'utf8' });
  if (res.error) return; // pnpm not installed; don't block
  const ver = (res.stdout || '').trim();
  const major = parseInt(ver.split('.')[0] || '0', 10);
  if (!Number.isNaN(major) && major < 9) {
    process.stdout.write(`[pre-commit] pnpm ${ver} detected. Consider upgrading to >= 9 for Vercel.\n`);
  }
}

await cleanLocks();
checkPnpm();

