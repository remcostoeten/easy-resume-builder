import { gzip, ungzip } from 'pako';
import LZString from 'lz-string';

function safeBase64Encode(str: string): string {
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(str);
  }
  return Buffer.from(str, 'binary').toString('base64');
}

function safeBase64Decode(b64: string): string {
  if (typeof window !== 'undefined' && window.atob) {
    return window.atob(b64);
  }
  return Buffer.from(b64, 'base64').toString('binary');
}

async function compress(raw: string): Promise<string> {
  if (typeof CompressionStream !== 'undefined') {
    const cs = new CompressionStream('gzip');
    const writer = cs.writable.getWriter();
    writer.write(new TextEncoder().encode(raw));
    writer.close();
    const base64 = await new Response(cs.readable).arrayBuffer().then(buf => safeBase64Encode(String.fromCharCode(...new Uint8Array(buf))));
    return base64;
  } else if (typeof gzip !== 'undefined') {
    const compressed = gzip(raw);
    return safeBase64Encode(String.fromCharCode(...compressed));
  } else {
    return LZString.compressToBase64(raw);
  }
}

async function decompress(comp: string): Promise<string> {
  if (typeof DecompressionStream !== 'undefined') {
    const ds = new DecompressionStream('gzip');
    const writer = ds.writable.getWriter();
    const data = new Uint8Array(safeBase64Decode(comp).split('').map(char => char.charCodeAt(0)));
    writer.write(data);
    writer.close();
    const text = await new Response(ds.readable).text();
    return text;
  } else if (typeof ungzip !== 'undefined') {
    const decompressed = ungzip(new Uint8Array(safeBase64Decode(comp).split('').map(char => char.charCodeAt(0))), { to: 'string' });
    return decompressed;
  } else {
    return LZString.decompressFromBase64(comp) || '';
  }
}

export { compress, decompress };
