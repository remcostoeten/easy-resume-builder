function ensureDomMatrix(): void {
  if (typeof globalThis !== 'undefined' && !(globalThis as any).DOMMatrix) {
    try {
      const { DOMMatrix } = require('canvas');
      (globalThis as any).DOMMatrix = DOMMatrix;
    } catch (error) {
      console.warn('Failed to load DOMMatrix from canvas package:', error);
    }
  }
}

export { ensureDomMatrix };
