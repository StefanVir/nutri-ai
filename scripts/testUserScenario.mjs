import { generateNIMMealDeck } from '../src/lib/nimClient.ts';

async function testUserScenario() {
  const deck = await generateNIMMealDeck({
    mode: 'fridge',
    mealCategory: 'lunch',
    remainingCalories: 1900,
    remainingProtein: 150,
    remainingCarbs: 180,
    remainingFat: 60,
    fridgeIngredients: ['Ouă', 'Telemea', 'Spanac', 'Lipii integrale'],
    appliances: ['Aragaz / Tigaie'],
    servings: 1,
    maxBudgetRon: 25,
  });

  console.log(`Generated ${deck.length} cards:\n`);
  deck.forEach((card, idx) => {
    console.log(`[Rețeta ${idx + 1}] ${card.title}`);
    console.log(`   🏷️ Tags: ${card.tags.join(', ')}`);
    console.log(`   📊 Macro: ${card.calories} kcal | ${card.protein}g P | ${card.carbs}g C | ${card.fat}g F`);
    console.log(`   💡 Match: ${card.matchReason}`);
    console.log(`   📝 Ingrediente: ${card.ingredients.map(i => `${i.name} (${i.amount})`).join(', ')}`);
    console.log(`   👨‍🍳 Pasi:`);
    card.instructions.forEach((st, sIdx) => console.log(`      ${sIdx + 1}. ${st}`));
    console.log('--------------------------------------------------');
  });
}

testUserScenario();
