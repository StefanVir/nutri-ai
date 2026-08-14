import { z } from 'zod';

export const IngredientItemSchema = z.object({
  name: z.string().min(1),
  amount: z.string().min(1),
  isPantryStock: z.boolean().default(false),
  toBuy: z.boolean().default(false),
  estimatedPriceRon: z.number().nonnegative().optional(),
});

export const MealCardProposalSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  mode: z.enum(['fridge', 'grocery_empty', 'grocery_stock', 'restaurant']),
  imageUrl: z.string().optional(),
  calories: z.number().int().positive(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  prepTimeMinutes: z.number().int().nonnegative(),
  cookTimeMinutes: z.number().int().nonnegative(),
  difficulty: z.enum(['Ușor', 'Mediu', 'Avansat']).default('Ușor'),
  servings: z.number().int().positive().default(1),
  appliancesUsed: z.array(z.string()).default([]),
  estimatedCostRon: z.number().nonnegative().optional(),
  matchReason: z.string().min(5),
  tags: z.array(z.string()).default([]),
  ingredients: z.array(IngredientItemSchema).min(1),
  instructions: z.array(z.string().min(3)).min(1),
});

export const MealCardDeckSchema = z.object({
  recipes: z.array(MealCardProposalSchema).min(1),
});

export const QuickLogOutputSchema = z.object({
  title: z.string().min(2),
  calories: z.number().int().positive(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  confidenceNotes: z.string().optional().default(''),
});

export const VisionMealOutputSchema = z.object({
  title: z.string().min(2),
  calories: z.number().int().positive(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  spatialReasoning: z.object({
    scaleAnchor: z.string().default('Farfurie și tacâmuri'),
    calculationNotes: z.string().default(''),
  }).optional(),
  detectedItems: z.array(
    z.object({
      name: z.string(),
      dimensionsEstimate: z.string().optional(),
      estimatedGrams: z.number().nonnegative().optional(),
      calories: z.number().nonnegative().optional(),
      protein: z.number().nonnegative().optional(),
      carbs: z.number().nonnegative().optional(),
      fat: z.number().nonnegative().optional(),
    })
  ).default([]),
  confidenceNotes: z.string().default(''),
});

export type IngredientItem = z.infer<typeof IngredientItemSchema>;
export type MealCardProposal = z.infer<typeof MealCardProposalSchema>;
export type MealCardDeck = z.infer<typeof MealCardDeckSchema>;
export type QuickLogOutput = z.infer<typeof QuickLogOutputSchema>;
export type VisionMealOutput = z.infer<typeof VisionMealOutputSchema>;


