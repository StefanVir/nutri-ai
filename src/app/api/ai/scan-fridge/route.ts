import { NextRequest, NextResponse } from 'next/server';
import { scanFridgeImageWithNIM } from '@/lib/nimClient';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const imageBase64 = body?.imageBase64;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Fotografia în format Base64 este obligatorie.' },
        { status: 400 }
      );
    }

    const detectedIngredients = await scanFridgeImageWithNIM(imageBase64);
    return NextResponse.json({
      success: true,
      detectedIngredients,
      modelUsed: 'meta/llama-3.2-11b-vision-instruct',
    });
  } catch (error: any) {
    console.error('API scan-fridge error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Eroare la scanarea frigiderului cu AI Vision' },
      { status: 500 }
    );
  }
}
