async function testApi() {
  const res = await fetch('http://localhost:3000/api/ai/generate-deck', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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
    }),
  });

  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Success:', data.success);
  console.log(`Generated ${data.recipes?.length} recipes from Groq 70B:\n`);
  (data.recipes || []).forEach((c, idx) => {
    console.log(`[Rețeta ${idx + 1}] ${c.title}`);
    console.log(`   🏷️ Tags: ${c.tags?.join(', ')}`);
    console.log(`   📊 Macro: ${c.calories} kcal | ${c.protein}g P | ${c.carbs}g C | ${c.fat}g F`);
    console.log(`   💡 De ce: ${c.matchReason}`);
    console.log(`   📝 Ingrediente: ${c.ingredients?.map(i => `${i.name} (${i.amount})`).join(', ')}`);
    console.log(`   👨‍🍳 Instrucțiuni:`);
    c.instructions?.forEach((st, sIdx) => console.log(`      ${sIdx + 1}. ${st}`));
    console.log('--------------------------------------------------');
  });
}

testApi();
