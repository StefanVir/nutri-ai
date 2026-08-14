import { NextRequest, NextResponse } from 'next/server';
import { generateNIMMealDeck } from '@/lib/nimClient';
import { PreSwipeContext } from '@/types/nutrition';

// Vercel Serverless Function Configuration
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const context: PreSwipeContext = await req.json();
    
    if (!context || !context.mode) {
      return NextResponse.json(
        { success: false, error: 'Contextul pre-swipe este invalid sau incomplet.' },
        { status: 400 }
      );
    }

    const recipes = await generateNIMMealDeck(context);
    return NextResponse.json({ success: true, recipes });
  } catch (error: any) {
    console.error('API generate-deck error on Vercel:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Eroare internă la procesarea pachetului de rețete' },
      { status: 500 }
    );
  }
}
