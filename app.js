document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('diet-form');
    const formSection = document.getElementById('form-section');
    const loadingSection = document.getElementById('loading-section');
    const resultsSection = document.getElementById('results-section');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const printBtn = document.getElementById('print-btn');

    // Diet data definitions
    const meals = {
        veg: {
            breakfast: [
                "2 Idlis with Sambar and Coconut Chutney",
                "1 Appam with Vegetable Stew",
                "Puttu (1 slice) with Kadala Curry",
                "Upma (1 small bowl) with Banana",
                "2 Dosa with Sambar and Tomato Chutney",
                "Idiyappam (2 pcs) with Veg Korma",
                "Oats porridge cooked in skimmed milk with 1/2 apple"
            ],
            lunch: [
                "1/2 cup Matta Rice + 1 cup Parippu (Dal) + Cabbage Thoran + Moru (Buttermilk) curry",
                "1/2 cup Matta Rice + Sambar + Beans Mezhukkupuratti + Cucumber Salad",
                "2 Chapatis + Mixed Veg Korma + Cucumber Raita",
                "1/2 cup Matta Rice + Avial (mix vegetables) + Rasam + Carrot Salad",
                "1/2 cup Quinoa/Brown Rice + Soya Chunks Curry + Vendakka (Okra) Thoran",
                "1/2 cup Matta Rice + Kumbalanga (Ash Gourd) Curry + Beetroot Thoran + Curd",
                "2 Chapatis + Paneer/Tofu Roast + Green Salad"
            ],
            dinner: [
                "2 Chapatis + Cherupayar (Green Gram) Curry + Salad",
                "1 Appam + Veg Mappas (Coconut milk based curry)",
                "Oats Upma with lots of veggies (carrot, beans, peas)",
                "2 Wheat Dosa + Tomato/Onion Chutney",
                "Large bowl of clear Veg Soup + 1 Chapati with Dal",
                "Pesarattu (Moong Dal Dosa) + Mint Chutney",
                "2 Chapatis + Mushroom Masala + Cucumber Slices"
            ],
            snacks: [
                "1 Apple OR 1 Guava + Green Tea",
                "Handful of roasted peanuts (unsalted)",
                "1 cup Lemon Black Tea (Kattan Chaya without sugar)",
                "1 cup Papaya chunks",
                "Roasted Chana (1 small bowl)",
                "1 small Banana (Cherupazham)",
                "Cucumber & Carrot sticks with homemade hummus/curd dip"
            ]
        },
        nonVeg: {
            breakfast: [
                "2 Idlis with Sambar and 1 Boiled Egg",
                "1 Appam with Egg Roast/Stew",
                "Puttu (1 slice) with Kadala Curry + 1 Egg White",
                "2 Dosa with Sambar + 1 Boiled Egg",
                "Idiyappam (2 pcs) with Egg Korma",
                "Oats porridge cooked in water + 2 Scrambled Egg Whites",
                "2 Chapatis with Egg Curry (without coconut)"
            ],
            lunch: [
                "1/2 cup Matta Rice + Fish Curry (Meen Mulakittathu) + Cabbage Thoran + Moru",
                "1/2 cup Matta Rice + Chicken Curry (no coconut milk) + Beans Mezhukkupuratti + Salad",
                "2 Chapatis + Fish Moilee (light coconut milk) + Cucumber Raita",
                "1/2 cup Matta Rice + Ayila/Sardine Curry + Avial + Carrot Salad",
                "1/2 cup Brown Rice + Chicken Roast (dry) + Vendakka Thoran + Curd",
                "1/2 cup Matta Rice + Prawns/Netholi Curry + Beetroot Thoran + Salad",
                "2 Chapatis + Grilled/Pan-seared Fish + Green Salad"
            ],
            dinner: [
                "2 Chapatis + Chicken Curry (breast piece) + Salad",
                "1 Appam + Fish Curry (Meen Vevichathu)",
                "Large bowl of clear Chicken Soup + 1 slice of whole wheat bread",
                "2 Wheat Dosa + 2 Egg Whites Omlette with veggies",
                "Grilled Chicken Salad with lemon-olive oil dressing",
                "2 Chapatis + Egg Roast + Cucumber Slices",
                "Baked/Grilled Fish piece with steamed vegetables (broccoli, beans, carrots)"
            ],
            snacks: [
                "1 Boiled Egg (or 2 egg whites) + Green Tea",
                "1 cup Lemon Black Tea (Kattan Chaya without sugar)",
                "1 cup Papaya chunks",
                "Roasted Chana (1 small bowl)",
                "Handful of almonds & walnuts (5-6 pieces)",
                "1 Apple OR 1 Guava",
                "Cucumber & Carrot sticks"
            ]
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get values
        const userDetails = {
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            weight: parseFloat(document.getElementById('weight').value),
            height: parseInt(document.getElementById('height').value),
            activity: document.getElementById('activity').value,
            preference: document.getElementById('preference').value,
            goal: document.getElementById('goal').value
        };

        // UI Transition
        formSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        // Simulate network/generation time
        setTimeout(() => {
            generatePlan(userDetails);
        }, 1500);
    });

    regenerateBtn.addEventListener('click', () => {
        resultsSection.classList.add('hidden');
        formSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    printBtn.addEventListener('click', () => {
        window.print();
    });

    function generatePlan(details) {
        // 1. Calculate BMR (Mifflin-St Jeor Equation)
        let bmr = 0;
        if (details.gender === 'male') {
            bmr = (10 * details.weight) + (6.25 * details.height) - (5 * details.age) + 5;
        } else {
            bmr = (10 * details.weight) + (6.25 * details.height) - (5 * details.age) - 161;
        }

        // 2. Calculate TDEE
        const activityMultipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725
        };
        const tdee = bmr * activityMultipliers[details.activity];

        // 3. Calculate Calorie Target based on Goal
        const deficitMultipliers = {
            'mild': 250,      // ~0.25kg/week
            'moderate': 500,  // ~0.5kg/week
            'fast': 1000      // ~1kg/week (cap at min healthy intake)
        };

        let targetCalories = Math.round(tdee - deficitMultipliers[details.goal]);

        // Safety cap (don't recommend diets below 1200 kcal for women, 1500 for men usually, but 1200 is a safe hard floor)
        const minCals = details.gender === 'male' ? 1500 : 1200;
        if (targetCalories < minCals) targetCalories = minCals;

        // 4. Calculate Water Intake (baseline 30-35ml per kg)
        const waterLiters = Math.max((details.weight * 0.035).toFixed(1), 2.5);

        // 5. Update UI Metrics
        document.getElementById('res-calories').innerText = targetCalories;
        document.getElementById('res-water').innerText = waterLiters;

        const typeEl = document.getElementById('res-type');
        typeEl.innerText = details.preference === 'veg' ? 'Vegetarian' : 'Non-Veg';
        typeEl.style.color = details.preference === 'veg' ? '#34d399' : '#f87171';

        // 6. Generate 7-Day Plan
        renderDietPlan(details.preference);

        // Transition UI
        loadingSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('slide-up');
    }

    function renderDietPlan(preference) {
        const container = document.getElementById('diet-plan-container');
        container.innerHTML = ''; // Clear previous

        const mealData = meals[preference === 'veg' ? 'veg' : 'nonVeg'];
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        days.forEach((day, index) => {
            // Pick variation for the day without randomizing perfectly, just rotate array index
            const bIndex = index % mealData.breakfast.length;
            const lIndex = index % mealData.lunch.length;
            const sIndex = index % mealData.snacks.length;
            const dIndex = index % mealData.dinner.length;

            const dayHTML = `
                <div class="day-card ${index === 0 ? 'active' : ''}">
                    <div class="day-header" onclick="toggleDay(this)">
                        <span>Day ${index + 1}: ${day}</span>
                    </div>
                    <div class="day-content">
                        <div class="meal-row">
                            <span class="meal-time">🌅 Early Mng</span>
                            <span class="meal-desc">1 glass warm water with a squeeze of lemon + 4-5 soaked almonds</span>
                        </div>
                        <div class="meal-row">
                            <span class="meal-time">🍳 Breakfast</span>
                            <span class="meal-desc">${mealData.breakfast[bIndex]}</span>
                        </div>
                        <div class="meal-row">
                            <span class="meal-time">☀️ Mid-Mng</span>
                            <span class="meal-desc">${mealData.snacks[sIndex]}</span>
                        </div>
                        <div class="meal-row">
                            <span class="meal-time">🍱 Lunch</span>
                            <span class="meal-desc">${mealData.lunch[lIndex]}</span>
                        </div>
                        <div class="meal-row">
                            <span class="meal-time">☕ Evening</span>
                            <span class="meal-desc">Tea/Coffee (no sugar) + 1 boiled Egg/Handful of roasted Chana</span>
                        </div>
                        <div class="meal-row">
                            <span class="meal-time">🌙 Dinner</span>
                            <span class="meal-desc">${mealData.dinner[dIndex]} <br><small><i>Try to finish by 8 PM</i></small></span>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', dayHTML);
        });
    }
});

// Global function for onclick attribute
window.toggleDay = function (element) {
    // Close other days
    const allDays = document.querySelectorAll('.day-card');
    const parent = element.parentElement;

    // Toggle current
    if (parent.classList.contains('active')) {
        parent.classList.remove('active');
    } else {
        // Optional: uncomment below to make accordion auto-close others
        /*
        allDays.forEach(day => {
            if (day !== parent) day.classList.remove('active');
        });
        */
        parent.classList.add('active');
    }
};
