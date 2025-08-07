#!/usr/bin/env bun
import { $ } from 'bun';
await $`rm -f $HOME/pnpm-lock.yaml`;
