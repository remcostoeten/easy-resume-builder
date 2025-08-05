function serialize<T>(value: T): string {
  return JSON.stringify(value, function replacer(key, val) {
    if (val instanceof Date) {
      return { $d: val.toISOString() };
    }
    return val;
  });
}

function deserialize<T>(raw: string): T {
  return JSON.parse(raw, function reviver(key, val) {
    if (val && typeof val === 'object' && '$d' in val && typeof val.$d === 'string') {
      return new Date(val.$d);
    }
    return val;
  });
}

export { serialize, deserialize };
