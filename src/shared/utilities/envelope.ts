import { compress, decompress } from './compression';
import { serialize, deserialize } from './serialization';

export const CURRENT_SCHEMA_VERSION = 1;

type TEnvelope = {
  v: number;
  t: number;
  data: string;
};

type TUnpackedData<T> = T & {
  __meta: {
    savedAt: Date;
    version: number;
  };
};

export async function pack<T>(data: T): Promise<string> {
  const serialized = serialize(data);
  const compressed = await compress(serialized);
  
  const envelope: TEnvelope = {
    v: CURRENT_SCHEMA_VERSION,
    t: Date.now(),
    data: compressed
  };
  
  return JSON.stringify(envelope);
}

export async function unpack<T>(raw: string): Promise<TUnpackedData<T>> {
  const envelope: TEnvelope = JSON.parse(raw);
  
  const decompressed = await decompress(envelope.data);
  const deserialized = deserialize<T>(decompressed);
  
  return {
    ...deserialized,
    __meta: {
      savedAt: new Date(envelope.t),
      version: envelope.v
    }
  };
}
