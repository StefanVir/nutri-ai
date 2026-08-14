async function testApi() {
  const res = await fetch('http://localhost:3000/api/ai/generate-deck', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'fridge',
      mealCategory: 'lunch',
      remainingCalories: 1800,
      remainingProtein: 140,
      remainingCarbs: 180,
      remainingFat: 60,
      fridgeIngredients: ['Mușchi de vită', 'Conserve de ton', 'Ouă', 'Spanac proaspăt', 'Avocado'],
      appliances: ['Aragaz / Tigaie', 'Airfryer'],
      servings: 1,
      maxBudgetRon: 30,
    }),
  });

  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Success:', data.success);
  console.log('Recipes length:', data.recipes?.length);
  (data.recipes || []).forEach((c, idx) => {
    console.log(`\n[Card ${idx + 1}] ${c.title} (${c.calories} kcal | ${c.protein}g P | ${c.carbs}g C | ${c.fat}g F)`);
    console.log(`   💡 De ce: ${c.matchReason}`);
    console.log(`   📝 Ingrediente: ${c.ingredients?.map(i => `${i.name} (${i.amount})`).join(', ')}`);
    console.log(`   👨‍🍳 Instrucțiuni (${c.instructions?.length} pași):`);
    c.instructions?.forEach((st, sIdx) => console.log(`      ${sIdx + 1}. ${st}`));
  });
}

testApi();
