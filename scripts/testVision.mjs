import OpenAI from 'openai';

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const apiKey = process.env.NVIDIA_NIM_API_KEY?.trim();

async function testVision() {
  if (!apiKey) {
    console.error('NVIDIA_NIM_API_KEY not found in env');
    return;
  }
  const openai = new OpenAI({ apiKey, baseURL: NVIDIA_BASE_URL });

  // 1x1 transparent pixel base64 for schema testing
  const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const modelsToTest = [
    'meta/llama-3.2-11b-vision-instruct',
    'meta/llama-3.2-90b-vision-instruct',
    'mistralai/pixtral-12b-2409'
  ];

  for (const model of modelsToTest) {
    try {
      console.log(`Testing vision model: ${model}...`);
      const response = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Describe what you see in 5 words.' },
              { type: 'image_url', image_url: { url: dummyImage } }
            ]
          }
        ],
        max_tokens: 50
      });
      console.log(`✅ Success with ${model}:`, response.choices[0]?.message?.content);
      return model;
    } catch (e) {
      console.warn(`❌ Failed with ${model}:`, e.message);
    }
  }
}

testVision();
