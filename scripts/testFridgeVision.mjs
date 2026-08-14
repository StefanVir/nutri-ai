import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const client = new OpenAI({ apiKey, baseURL: NVIDIA_BASE_URL });

async function testFridgeVision() {
  const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const systemPrompt = `You are an expert computer vision model for NutriAI specialized in scanning fridges and pantries.
Identify all visible food items, produce, proteins, dairy, and grocery items.
Respond STRICTLY in valid JSON matching this schema:
{
  "detectedIngredients": ["Somon", "Ouă", "Spanac", "Telemea", "Lămâie"]
}`;

  const start = Date.now();
  console.log('Testing fridge vision scan with meta/llama-3.2-11b-vision-instruct...');
  try {
    const res = await client.chat.completions.create({
      model: 'meta/llama-3.2-11b-vision-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Scanează imaginea și listează toate ingredientele alimentare vizibile în limba Română.' },
            { type: 'image_url', image_url: { url: dummyImage } },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 300,
    });
    console.log(`⏱️ Vision scan finished in ${Date.now() - start}ms:`);
    console.log(res.choices[0]?.message?.content);
  } catch (e) {
    console.error('Error:', e);
  }
}

testFridgeVision();
