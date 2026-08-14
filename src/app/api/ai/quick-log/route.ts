import { NextRequest, NextResponse } from 'next/server';
import { parseQuickAILog } from '@/lib/nimClient';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body?.text || body?.description;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Descrierea text a mesei este obligatorie.' },
        { status: 400 }
      );
    }

    const parsedMeal = await parseQuickAILog(text.trim());
    return NextResponse.json({
      success: true,
      title: parsedMeal.title,
      calories: parsedMeal.calories,
      protein: parsedMeal.protein,
      carbs: parsedMeal.carbs,
      fat: parsedMeal.fat,
      confidenceNotes: parsedMeal.confidenceNotes,
      meal: parsedMeal,
    });
  } catch (error: any) {
    console.error('API quick-log error on Vercel:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Eroare la parsarea descrierii cu AI' },
      { status: 500 }
    );
  }
}
