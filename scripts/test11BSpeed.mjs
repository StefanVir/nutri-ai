import OpenAI from 'openai';

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const apiKey = process.env.NVIDIA_NIM_API_KEY?.trim();

async function test11bSpeed() {
  const openai = new OpenAI({ apiKey, baseURL: NVIDIA_BASE_URL });
  const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const start = Date.now();
  console.log('Starting 11B Vision test...');
  try {
    const res = await openai.chat.completions.create({
      model: 'meta/llama-3.2-11b-vision-instruct',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Output JSON: {"food": "detected"}' },
            { type: 'image_url', image_url: { url: dummyImage } }
          ]
        }
      ],
      max_tokens: 100,
      temperature: 0.1
    });
    console.log(`⏱️ Finished in ${Date.now() - start}ms:`, res.choices[0]?.message?.content);
  } catch (e) {
    console.error('Error:', e);
  }
}

test11bSpeed();
