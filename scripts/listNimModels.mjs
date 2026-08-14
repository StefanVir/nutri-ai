import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const client = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function listModels() {
  try {
    const list = await client.models.list();
    console.log('Total models on NVIDIA NIM:', list.data.length);
    const names = list.data.map(m => m.id).sort();
    console.log('\nAvailable Models:');
    names.forEach(n => console.log(' - ' + n));
  } catch (e) {
    console.error('Error listing models:', e);
  }
}

listModels();
