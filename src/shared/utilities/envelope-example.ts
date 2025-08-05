import { pack, unpack, CURRENT_SCHEMA_VERSION } from './envelope';

type TExampleData = {
  name: string;
  email: string;
  preferences: {
    theme: string;
    notifications: boolean;
  };
  createdAt: Date;
};

export async function demonstrateEnvelopeUsage() {
  const sampleData: TExampleData = {
    name: 'John Doe',
    email: 'john@example.com',
    preferences: {
      theme: 'dark',
      notifications: true
    },
    createdAt: new Date()
  };

  console.log('Original data:', sampleData);
  console.log('Current schema version:', CURRENT_SCHEMA_VERSION);

  const packed = await pack(sampleData);
  console.log('Packed envelope:', packed);

  const unpacked = await unpack<TExampleData>(packed);
  console.log('Unpacked data:', unpacked);
  console.log('Metadata:', unpacked.__meta);

  return { packed, unpacked };
}
