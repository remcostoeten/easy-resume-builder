# Compression Layer Implementation

This implementation provides a robust compression layer for localStorage that ensures ASCII-safe storage through base64 encoding.

## Features

### Core Functions
- `compress(raw: string): Promise<string>` - Compresses and base64-encodes strings
- `decompress(comp: string): Promise<string>` - Decompresses base64-encoded strings

### Compression Strategies (Priority Order)
1. **CompressionStream/DecompressionStream** (Modern browsers with native gzip support)
2. **Pako** (Gzip polyfill for broader browser support)
3. **LZ-String** (Fallback with efficient string compression)

### Storage Integration
- Async storage functions: `getItem()`, `setItem()`
- Sync storage functions: `getItemSync()`, `setItemSync()` (uses LZ-String for non-blocking operation)
- Backwards compatible with existing storage system

## Usage

```typescript
import { compress, decompress } from '@/shared/utilities/compression';
import { getItem, setItem, getItemSync, setItemSync } from '@/core/storage';

// Direct compression
const compressed = await compress('Hello World');
const decompressed = await decompress(compressed);

// Integrated storage (async with advanced compression)
await setItem('key', data, { compression: true });
const data = await getItem('key');

// Sync storage (for when you need blocking behavior)
setItemSync('key', data, { compression: true }); // Uses LZ-String
const data = getItemSync('key');
```

## Technical Details

### Base64 Encoding
All compressed strings are base64-encoded to ensure localStorage compatibility and prevent encoding issues.

### Environment Detection
- Browser: Uses native `btoa`/`atob` when available
- Node.js: Falls back to Buffer-based encoding

### Fallback Chain
1. Native browser gzip (`CompressionStream`) → pako gzip → LZ-String
2. All outputs are base64-encoded for consistent storage format

### Synchronous Support
When compression is disabled or when using sync functions, the system uses LZ-String compression to maintain non-blocking operation while still providing some compression benefits.
