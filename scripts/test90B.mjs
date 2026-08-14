import OpenAI from 'openai';

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const apiKey = process.env.NVIDIA_NIM_API_KEY?.trim();

async function test90B() {
  if (!apiKey) {
    console.error('NVIDIA_NIM_API_KEY not found');
    return;
  }
  const openai = new OpenAI({ apiKey, baseURL: NVIDIA_BASE_URL });

  // 1x1 transparent pixel
  const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  try {
    console.log('Testing meta/llama-3.2-90b-vision-instruct...');
    const response = await openai.chat.completions.create({
      model: 'meta/llama-3.2-90b-vision-instruct',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze image. Return JSON: {"color": "description"}' },
            { type: 'image_url', image_url: { url: dummyImage } }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 150
    });
    console.log('✅ Response from 90B Vision:', response.choices[0]?.message?.content);
  } catch (e) {
    console.error('❌ Error 90B:', e.message);
  }
}

test90B();
