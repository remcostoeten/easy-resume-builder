import { compress, decompress } from './compression';
import { getItem, setItem, getItemSync, setItemSync } from '../../core/storage';

async function compressionExample() {
  const originalData = {
    name: 'John Doe',
    resume: {
      experience: [
        { company: 'TechCorp', position: 'Developer', duration: '2020-2023' },
        { company: 'WebInc', position: 'Senior Developer', duration: '2023-Present' }
      ],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      education: 'Computer Science Degree'
    }
  };

  const rawString = JSON.stringify(originalData);
  console.log('Original data size:', rawString.length);

  const compressedString = await compress(rawString);
  console.log('Compressed data size:', compressedString.length);
  console.log('Compression ratio:', ((compressedString.length / rawString.length) * 100).toFixed(2) + '%');
  console.log('Compressed string is base64:', /^[A-Za-z0-9+/]*={0,2}$/.test(compressedString));

  const decompressedString = await decompress(compressedString);
  const decompressedData = JSON.parse(decompressedString);
  
  console.log('Decompression successful:', JSON.stringify(decompressedData) === JSON.stringify(originalData));

  await setItem('resume-data', originalData, { compression: true });
  const retrievedData = await getItem('resume-data');
  console.log('Storage round-trip successful:', JSON.stringify(retrievedData) === JSON.stringify(originalData));

  setItemSync('resume-data-sync', originalData, { compression: false });
  const retrievedDataSync = getItemSync('resume-data-sync');
  console.log('Sync storage round-trip successful:', JSON.stringify(retrievedDataSync) === JSON.stringify(originalData));
}

export { compressionExample };
