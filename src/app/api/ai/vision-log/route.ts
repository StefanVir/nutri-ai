import { NextRequest, NextResponse } from 'next/server';
import { analyzeFoodImageWithNIM } from '@/lib/nimClient';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const imageBase64 = body?.imageBase64;
    const userHint = body?.userHint;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Imaginea în format Base64 este obligatorie.' },
        { status: 400 }
      );
    }

    const result = await analyzeFoodImageWithNIM(imageBase64, userHint);
    return NextResponse.json({
      success: true,
      ...result,
      meal: result,
    });
  } catch (error: any) {
    console.error('API vision-log error on Vercel:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Eroare la analiza imaginii cu AI Vision' },
      { status: 500 }
    );
  }
}
