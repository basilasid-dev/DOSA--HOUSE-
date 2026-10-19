import { Recipe } from '../types/recipe';

export const RECIPES: Recipe[] = [
  {
    id: 'plain_roast',
    name: 'Plain Golden Roast',
    tamilName: 'நெய் ரோஸ்ட் (Ney Roast)',
    tagline: 'Paper-thin, golden perfection with pure clarified butter.',
    description: 'The golden standard of South Indian breakfast. Fermented rice and urad dal batter swirled razor-thin on a seasoned cast-iron tawa, drizzled generously with aromatic desi ghee until lacy and crunchy.',
    difficulty: 1,
    cookingTimeSec: 45,
    calories: '180 kcal',
    foldType: 'cylinder',
    imageKey: 'photo_plain_roast',
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1 rounded ladle', culinaryRole: 'Aged rice & urad dal foam creating lacy holes' },
      { id: 'ghee', name: 'Desi Cow Ghee', icon: '🧈', required: true, amountText: '2 tsp', culinaryRole: 'Imparts nutty aroma and crisp golden sheen' },
      { id: 'sesame_oil', name: 'Gingelly Oil', icon: '🫗', required: false, amountText: '1 tsp', culinaryRole: 'Non-stick seasoning for heavy cast iron' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Splash a drop of water on the tawa to test sizzle heat.' },
      { stepNumber: 2, instruction: 'Pour batter into center; spread in rapid concentric spirals.' },
      { stepNumber: 3, instruction: 'Drizzle golden ghee around perimeter until edges lift up.' },
      { stepNumber: 4, instruction: 'Roll smoothly into a tight golden cylindrical flute.' }
    ],
    prepStages: [
      { stageNumber: 1, title: 'Heat & Water Test', detail: 'Tawa must sizzle sharply at 185°C. Wipe lightly with gingelly oil.', icon: '🔥', proTip: 'Listen for the high-pitched water hiss.' },
      { stageNumber: 2, title: 'Center Pour & Swirl', detail: 'Pour 1 ladle in center. Spiral outward quickly without lifting ladle base.', icon: '🌀', proTip: 'Keep consistent pressure for paper-thin edges.' },
      { stageNumber: 3, title: 'Desi Ghee Drizzle', detail: 'Swirl golden melted ghee around outer rim and center holes.', icon: '🧈', proTip: 'Ghee seeps underneath to release the crepe.' },
      { stageNumber: 4, title: 'Golden Roll & Plate', detail: 'Once edges turn deep golden amber, slide spatula underneath and roll into a flute.', icon: '🌯', proTip: 'Serve immediately while steaming hot.' }
    ],
    condiments: ['Fresh Coconut Chutney', 'Piping Hot Drumstick Sambar', 'Tangy Tomato-Onion Chutney'],
    lore: 'Historically celebrated in ancient Sangam literature and the 12th-century Sanskrit encyclopedia Manasollasa as "Dosaka", perfected into a paper-thin art by Udupi chefs.',
    unlockedByDefault: true,
    unlockCostCoins: 0,
    requiredLevel: 1
  },
  {
    id: 'masala_dosa',
    name: 'Classic Masala Dosa',
    tamilName: 'மசாலா தோசை',
    tagline: 'Stuffed with turmeric-spiced comforting potato curry.',
    description: 'Crispy on the outside, tender on the inside. Spread with love and folded around a fragrant filling of mashed potatoes, mustard seeds, sauteed onions, ginger, and fresh green chillies.',
    difficulty: 2,
    cookingTimeSec: 60,
    calories: '280 kcal',
    foldType: 'triangle',
    imageKey: 'photo_masala_dosa',
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1 ladle', culinaryRole: 'Provides crispy outer crust with soft interior' },
      { id: 'potato_masala', name: 'Spiced Potato Curry', icon: '🥔', required: true, amountText: '2 generous scoops', culinaryRole: 'Turmeric, mustard seeds, onions & green chillies' },
      { id: 'ghee', name: 'Desi Cow Ghee', icon: '🧈', required: true, amountText: '1.5 tsp', culinaryRole: 'Crisps the base while keeping center supple' },
      { id: 'curry_leaves', name: 'Crisp Curry Leaves', icon: '🌿', required: true, amountText: 'A pinch', culinaryRole: 'Authentic South Indian aromatic punch' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Spread fermented batter evenly across hot seasoned tawa.' },
      { stepNumber: 2, instruction: 'Drizzle ghee around the edges and wait for the golden glow.' },
      { stepNumber: 3, instruction: 'Spoon warm potato bhaji into the center fold line.' },
      { stepNumber: 4, instruction: 'Fold both sides into the iconic royal triangular envelop.' }
    ],
    prepStages: [
      { stageNumber: 1, title: 'Cast Iron Preheating', detail: 'Ensure even surface heat so batter browns uniformly.', icon: '🍳', proTip: 'Medium-high heat prevents batter tearing.' },
      { stageNumber: 2, title: 'Spiral Swirl', detail: 'Glide ladle base outward in uniform continuous spirals.', icon: '🌀', proTip: 'Slightly thicker center cradles the warm potato masala.' },
      { stageNumber: 3, title: 'Potato Masala Scoop', detail: 'Place warm turmeric potato curry down the central axis.', icon: '🥔', proTip: 'Warm potatoes help steam the inner layer.' },
      { stageNumber: 4, title: 'Royal Triangle Fold', detail: 'Fold left edge to center, then right edge over, forming a triangle envelope.', icon: '📐', proTip: 'Edges should crackle with crispness.' }
    ],
    condiments: ['Coriander Mint Chutney', 'Drumstick Sambar', 'Shallot Garlic Chutney'],
    lore: 'Legend has it that masala dosa was born in Udupi kitchens when royal chefs sought an ingenious way to combine potato curry into a portable, mess-free crispy crepe.',
    unlockedByDefault: true,
    unlockCostCoins: 0,
    requiredLevel: 1
  },
  {
    id: 'ghee_podi_dosa',
    name: 'Ghee Podi Roast',
    tamilName: 'நெய் பொடி தோசை',
    tagline: 'Fiery gunpowder spice blend seared with molten ghee.',
    description: 'A fiery, addictive sensory masterpiece. Freshly roasted idli podi (spiced lentil and red chilli powder) sprinkled generously over sizzling batter, drenched in bubbling ghee to form a spicy ruby crust.',
    difficulty: 2,
    cookingTimeSec: 50,
    calories: '260 kcal',
    foldType: 'half_moon',
    imageKey: 'photo_ghee_podi',
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1 ladle', culinaryRole: 'Slightly thicker spread to absorb the rich spice oil' },
      { id: 'idli_podi', name: 'Gunpowder (Idli Podi)', icon: '🌶️', required: true, amountText: '2 tbsp', culinaryRole: 'Roasted chana dal, sesame seeds & Byadagi chillies' },
      { id: 'ghee', name: 'Desi Cow Ghee', icon: '🧈', required: true, amountText: '2.5 tsp', culinaryRole: 'Blooms the roasted podi spices into a rich crust' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Swirl batter slightly thicker for maximum podi absorption.' },
      { stepNumber: 2, instruction: 'Liberally dust spicy gunpowder across the wet surface.' },
      { stepNumber: 3, instruction: 'Pour steaming ghee; watch the podi turn a rich dark maroon.' },
      { stepNumber: 4, instruction: 'Fold in half to lock in the caramelized spicy aroma.' }
    ],
    prepStages: [
      { stageNumber: 1, title: 'Batter Swirl', detail: 'Spread batter medium-thick so spices don\'t burn on direct iron.', icon: '🌀', proTip: 'Do not spread too thin.' },
      { stageNumber: 2, title: 'Gunpowder Dusting', detail: 'Shake coarse red idli podi generously across the moist wet batter.', icon: '🌶️', proTip: 'Apply while wet so podi sticks firmly.' },
      { stageNumber: 3, title: 'Molten Ghee Bloom', detail: 'Drizzle piping hot cow ghee over the podi; spices sizzle into maroon paste.', icon: '🧈', proTip: 'You will smell the toasted sesame immediately.' },
      { stageNumber: 4, title: 'Half-Moon Fold', detail: 'Fold crepe clean in half; sear both sides for 5 seconds on the tawa.', icon: '🌙', proTip: 'Serve with extra sweet tomato thokku.' }
    ],
    condiments: ['Creamy Coconut Chutney', 'Sweet Tomato Thokku'],
    lore: 'Idli Podi is celebrated across Tamil Nadu and Andhra as "gunpowder" because of its explosive kick of roasted lentils, sesame, and fiery dry chillies tempered in ghee.',
    unlockedByDefault: true,
    unlockCostCoins: 0,
    requiredLevel: 1
  },
  {
    id: 'onion_uthappam',
    name: 'Caramelized Onion Uthappam',
    tamilName: 'வெங்காய ஊத்தப்பம்',
    tagline: 'Thick, pillowy pancake crowned with sweet caramelized shallots.',
    description: 'Thicker, spongy and comforting. A deep bed of fermented batter topped with heaps of sliced shallots, finely diced green chillies, and fresh cilantro, flipped once to achieve deep caramelization.',
    difficulty: 2,
    cookingTimeSec: 75,
    calories: '230 kcal',
    foldType: 'open_face',
    imageKey: 'photo_onion_uthappam',
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1.5 ladles (thick)', culinaryRole: 'Creates fluffy, spongy crumb with steam pockets' },
      { id: 'shallots', name: 'Diced Sambar Onions', icon: '🧅', required: true, amountText: '1 small bowl', culinaryRole: 'Sweet caramelization when flipped onto tawa' },
      { id: 'chillies', name: 'Finely Chopped Green Chillies', icon: '🌶️', required: false, amountText: '1 tsp', culinaryRole: 'Pleasant sharp heat that balances sweet shallots' },
      { id: 'sesame_oil', name: 'Cold Pressed Sesame Oil', icon: '🫗', required: true, amountText: '2 tsp', culinaryRole: 'Imparts earthy aroma to the seared onions' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Pour thick batter and spread gently into a cushiony disc.' },
      { stepNumber: 2, instruction: 'Press diced shallots and chillies firmly into wet batter.' },
      { stepNumber: 3, instruction: 'Drizzle sesame oil around edges and gently flip once.' },
      { stepNumber: 4, instruction: 'Sear until onions are golden, sweet, and lightly charred.' }
    ],
    prepStages: [
      { stageNumber: 1, title: 'Thick Pour', detail: 'Pour 1.5 ladles; do not swirl thin. Keep 10mm pillow thickness.', icon: '🥞', proTip: 'Look for crumpet-like rising air bubbles.' },
      { stageNumber: 2, title: 'Topping Embed', detail: 'Shower sliced shallots and green chillies; press in lightly with spatula.', icon: '🧅', proTip: 'Pressing prevents toppings separating during flip.' },
      { stageNumber: 3, title: 'The Sizzling Flip', detail: 'Flip upside down onto seasoned tawa; press gently to sear onions.', icon: '🔄', proTip: 'Listen to the sweet shallots caramelize.' },
      { stageNumber: 4, title: 'Open-Face Serve', detail: 'Flip back up to reveal golden browned shallots. Serve unfolded.', icon: '✨', proTip: 'Pair with spicy kara chutney.' }
    ],
    condiments: ['Red Chilli Garlic Chutney', 'Piping Hot Sambar'],
    lore: 'Unlike crispy paper dosas, Uthappam celebrates the soft, porous, fermented interior of batter, turning ordinary street breakfast into comfort food.',
    unlockedByDefault: true,
    unlockCostCoins: 0,
    requiredLevel: 1
  },
  {
    id: 'mysore_masala',
    name: 'Mysore Royal Masala Dosa',
    tamilName: 'மைசூர் மசாலா தோசை',
    tagline: 'Smear of spicy red garlic chutney with rich butter.',
    description: 'A regal specialty straight from the royal palace kitchens of Mysore. The inner face of the golden roast is lacquered with a fiery red paste of roasted chana dal, garlic, and Kashmiri chillies, with buttery potatoes.',
    difficulty: 3,
    cookingTimeSec: 65,
    calories: '320 kcal',
    foldType: 'triangle',
    imageKey: 'photo_mysore_masala',
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1 ladle', culinaryRole: 'Crispy golden shell with rich buttery foundation' },
      { id: 'mysore_paste', name: 'Fiery Red Garlic Chutney', icon: '🧄', required: true, amountText: '1.5 tbsp', culinaryRole: 'Roasted Byadagi chilli, garlic, tamarind & chana dal' },
      { id: 'butter', name: 'White Makhan Butter', icon: '🧈', required: true, amountText: '1 large dollop', culinaryRole: 'Melts over hot chutney to create silky glaze' },
      { id: 'potato_masala', name: 'Silky Masala Filling', icon: '🥔', required: true, amountText: '1 scoop', culinaryRole: 'Comforting turmeric potato core' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Swirl crisp thin batter over tawa at high heat.' },
      { stepNumber: 2, instruction: 'Smear ruby Mysore paste across entire inner face with spatula.' },
      { stepNumber: 3, instruction: 'Drop dollop of white butter and spiced potato center.' },
      { stepNumber: 4, instruction: 'Fold tightly into crisp golden triangle.' }
    ],
    prepStages: [
      { stageNumber: 1, title: 'Crisp Base Swirl', detail: 'Swirl batter evenly on high heat until translucent and starting to brown.', icon: '🌀', proTip: 'Must be hot enough so bottom crisps while top is moist.' },
      { stageNumber: 2, title: 'Red Chutney Lacquer', detail: 'Use back of spoon to paint red Mysore garlic paste across the inner surface.', icon: '🖌️', proTip: 'Cover edge to edge for flavor in every bite.' },
      { stageNumber: 3, title: 'White Butter Dollop', detail: 'Drop generous white makhan butter; watch it sizzle and melt into the paste.', icon: '🧈', proTip: 'Butter tempers the red chili garlic heat.' },
      { stageNumber: 4, title: 'Royal Envelop Fold', detail: 'Center the spiced potatoes; fold crisply into a grand triangle.', icon: '👑', proTip: 'Serve immediately with frothy filter coffee.' }
    ],
    condiments: ['Coconut-Coriander Chutney', 'Traditional Hotel Sambar'],
    lore: 'Created in the legendary cafes of Mysore, the addition of garlic-chilli chutney and white butter elevated the humble dosa into a royal feast fit for maharajas.',
    unlockedByDefault: true,
    unlockCostCoins: 0,
    requiredLevel: 1
  },
  {
    id: 'paper_roast',
    name: 'Giant Paper Ghee Roast',
    tamilName: 'பேப்பர் ரோஸ்ட் (Family Size)',
    tagline: 'An astonishing 3-foot crispy golden canopy glistening with ghee.',
    description: 'The showstopper of South Indian tiffin. Made on massive 36-inch cast-iron tawas, rolled into a spectacular giant golden telescope that spans across multiple banana leaves.',
    difficulty: 3,
    cookingTimeSec: 80,
    calories: '340 kcal',
    foldType: 'cylinder',
    imageKey: 'photo_plain_roast',
    ingredients: [
      { id: 'batter', name: 'Ultra-Fine Fermented Batter', icon: '🥣', required: true, amountText: '2 ladles', culinaryRole: 'Higher rice ratio for unmatched crackle' },
      { id: 'ghee', name: 'Desi Cow Ghee', icon: '🧈', required: true, amountText: '4 tsp', culinaryRole: 'Generous basting along the 3-foot length' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Ensure maximum tawa radius is evenly seasoned.' },
      { stepNumber: 2, instruction: 'Spread 2 ladles in massive expanding concentric rings.' },
      { stepNumber: 3, instruction: 'Drizzle molten ghee liberally from brass spoon.' },
      { stepNumber: 4, instruction: 'Roll with two spatulas into a monumental 3-foot flute.' }
    ],
    prepStages: [
      { stageNumber: 1, title: 'Tawa Diameter Heat', detail: 'Even temperature across the whole cast iron surface.', icon: '🔥', proTip: 'Use continuous heat across dual burners.' },
      { stageNumber: 2, title: 'Broad Spiral Glide', detail: 'Sweep the ladle base with wide swift strokes.', icon: '🌀', proTip: 'Lacy holes must form across the entire wingspan.' },
      { stageNumber: 3, title: 'Dual Ghee Stream', detail: 'Stream ghee in concentric tracks to release the wide crepe.', icon: '🧈', proTip: 'Ghee creates the legendary paper sheen.' },
      { stageNumber: 4, title: 'Grand Roll', detail: 'Using twin spatulas, roll into a majestic cylindrical flute.', icon: '📜', proTip: 'Takes center stage on two banana leaves.' }
    ],
    condiments: ['Trio of Chutneys', 'Piping Hot Sambar', 'Gunpowder Podi Cup'],
    lore: 'Famous in Chennai and Madurai hotel dining halls, the Giant Paper Roast is an iconic spectacle that always turns heads when carried across the restaurant.',
    unlockedByDefault: false,
    unlockCostCoins: 300,
    requiredLevel: 2
  },
  {
    id: 'chettinad_paneer',
    name: 'Chettinad Spicy Paneer Dosa',
    tamilName: 'செட்டிநாடு பன்னீர் தோசை',
    tagline: 'Fresh Malai paneer tossed in fiery black pepper and fennel masala.',
    description: 'A fiery heritage creation from Chettinad spice estates. Crispy golden dosa filled with crumbly fresh paneer, crushed black peppercorns, star anise, curry leaves, and toasted fennel.',
    difficulty: 3,
    cookingTimeSec: 70,
    calories: '360 kcal',
    foldType: 'triangle',
    imageKey: 'photo_masala_dosa',
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1 ladle', culinaryRole: 'Crispy outer shell' },
      { id: 'paneer_masala', name: 'Spicy Chettinad Paneer', icon: '🧀', required: true, amountText: '2 generous scoops', culinaryRole: 'Fresh malai paneer, black pepper & fennel' },
      { id: 'ghee', name: 'Desi Cow Ghee', icon: '🧈', required: true, amountText: '2 tsp', culinaryRole: 'Tempering Chettinad spices' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Swirl batter thin and crisp on hot seasoned tawa.' },
      { stepNumber: 2, instruction: 'Drizzle ghee and wait for golden brown lattice.' },
      { stepNumber: 3, instruction: 'Heap warm spicy Chettinad pepper paneer in center.' },
      { stepNumber: 4, instruction: 'Fold tightly into crispy golden triangle envelope.' }
    ],
    prepStages: [
      { stageNumber: 1, title: 'Pepper Roast Batter', detail: 'Thin swirl at high heat for maximum crunch.', icon: '🌀', proTip: 'Crunchy base offsets the tender paneer.' },
      { stageNumber: 2, title: 'Spice Aroma Check', detail: 'Warm pepper and star anise aromas fill the tiffin room.', icon: '🌶️', proTip: 'Freshly cracked Tellicherry black pepper is essential.' },
      { stageNumber: 3, title: 'Paneer Heap', detail: 'Spoon generous spicy paneer cubes down center line.', icon: '🧀', proTip: 'Paneer retains juices inside the crepe.' },
      { stageNumber: 4, title: 'Crispy Fold', detail: 'Fold envelope style; garnish with chopped cilantro.', icon: '📐', proTip: 'Pair with spicy shallot garlic chutney.' }
    ],
    condiments: ['Shallot Garlic Chutney', 'Chettinad Sambar', 'Mint Chutney'],
    lore: 'Chettinad cuisine is world-renowned for its bold use of whole spices, black pepper, and stone-ground masalas cultivated along maritime spice trading routes.',
    unlockedByDefault: false,
    unlockCostCoins: 500,
    requiredLevel: 3
  },
  {
    id: 'cheese_chilli',
    name: 'Amul Cheese & Green Chilli Dosa',
    tamilName: 'சீஸ் மிளகாய் தோசை',
    tagline: 'Molten salted cheese pull with fiery chopped green chillies.',
    description: 'A modern street-food sensation! Crispy golden dosa smothered with a snowy mountain of freshly grated Amul cheese, finely diced green chillies, and melted butter.',
    difficulty: 2,
    cookingTimeSec: 55,
    calories: '380 kcal',
    foldType: 'half_moon',
    imageKey: 'photo_ghee_podi',
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1 ladle', culinaryRole: 'Lacy, sturdy crepe' },
      { id: 'amul_cheese', name: 'Grated Amul Cheese', icon: '🧀', required: true, amountText: '1 generous cup', culinaryRole: 'Melts into a stretchy, gooey golden blanket' },
      { id: 'green_chillies', name: 'Spicy Green Chillies', icon: '🌶️', required: true, amountText: '1 tbsp', culinaryRole: 'Cuts through rich dairy fat' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Swirl batter slightly crispy on medium-high tawa.' },
      { stepNumber: 2, instruction: 'Shower a mountain of grated cheese across surface.' },
      { stepNumber: 3, instruction: 'Scatter diced spicy green chillies over melting cheese.' },
      { stepNumber: 4, instruction: 'Fold in half as cheese bubbles into a gooey molten pool.' }
    ],
    prepStages: [
      { stageNumber: 1, title: 'Thin Base Swirl', detail: 'Swirl batter evenly so heat melts the cheese rapidly.', icon: '🌀', proTip: 'Medium heat ensures bottom doesn\'t burn while cheese melts.' },
      { stageNumber: 2, title: 'Cheese Snowfall', detail: 'Liberally grate chilled block cheese over entire surface.', icon: '🧀', proTip: 'Cover all the way to crispy edges.' },
      { stageNumber: 3, title: 'Chilli Tempering', detail: 'Sprinkle fine diced bird\'s eye chillies and black pepper.', icon: '🌶️', proTip: 'Heat wakes up the chilli oils in molten cheese.' },
      { stageNumber: 4, title: 'Molten Fold', detail: 'Fold in half; cheese pulls in long golden strings.', icon: '🌙', proTip: 'Best enjoyed sizzling hot from the tawa!' }
    ],
    condiments: ['Tangy Tomato Thokku', 'Coconut Chutney'],
    lore: 'Born in the buzzing night food streets of Bangalore and Mumbai, this fusion combines classic South Indian fermented batter with nostalgic salty Amul cheese.',
    unlockedByDefault: false,
    unlockCostCoins: 750,
    requiredLevel: 4
  },
  {
    id: 'rava_crispy',
    name: 'Lacy Rava Cumin Roast',
    tamilName: 'ரவா தோசை (Sooji Dosa)',
    tagline: 'Delicate net-like lattice speckled with black peppercorns and cumin.',
    description: 'Crispy semolina batter poured in rapid splashes onto a smoking-hot tawa, forming a magnificent golden mesh dotted with crushed peppercorns, cumin seeds, and fresh ginger.',
    difficulty: 3,
    cookingTimeSec: 65,
    calories: '220 kcal',
    foldType: 'triangle',
    imageKey: 'photo_plain_roast',
    ingredients: [
      { id: 'rava_batter', name: 'Semolina & Rice Flour Batter', icon: '🥣', required: true, amountText: '1 cup runny batter', culinaryRole: 'Liquid batter that creates webbed mesh' },
      { id: 'cumin_pepper', name: 'Whole Cumin & Peppercorns', icon: '🧂', required: true, amountText: '1 tsp', culinaryRole: 'Warm crunch in every lacy bite' },
      { id: 'ghee', name: 'Desi Cow Ghee', icon: '🧈', required: true, amountText: '2.5 tsp', culinaryRole: 'Crisps every delicate strand of semolina' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Heat cast-iron tawa until water droplets dance rapidly.' },
      { stepNumber: 2, instruction: 'Splash runny semolina batter from outside rim inwards.' },
      { stepNumber: 3, instruction: 'Drizzle ghee into every tiny pore of the golden lattice.' },
      { stepNumber: 4, instruction: 'Cook without flipping until lattice is wafer-thin and crisp.' }
    ],
    prepStages: [
      { stageNumber: 1, title: 'Smoking Hot Tawa', detail: 'Rava requires smoking hot iron to form instant pores.', icon: '🔥', proTip: 'Too cold and batter forms a soggy pancake instead of lace.' },
      { stageNumber: 2, title: 'Splash Technique', detail: 'Do not swirl! Splash batter from bowl rim-to-center.', icon: '🌊', proTip: 'Let the holes form naturally like honeycomb.' },
      { stageNumber: 3, title: 'Ghee Infiltration', detail: 'Drizzle ghee liberally through every hole in the lattice.', icon: '🧈', proTip: 'Ghee deep-fries each semolina granule.' },
      { stageNumber: 4, title: 'Wafer Lift', detail: 'Patience! Wait until the whole sheet lifts effortlessly.', icon: '✨', proTip: 'Fold once; it will shatter like glass.' }
    ],
    condiments: ['Coconut Ginger Chutney', 'Madras Sambar', 'Tomato Onion Chutney'],
    lore: 'Unlike fermented rice dosas, Rava Dosa relies on unfermented semolina and buttermilk, inventing the famous "honeycomb lattice" that culinary tourists travel miles to taste.',
    unlockedByDefault: false,
    unlockCostCoins: 1000,
    requiredLevel: 5
  },
  {
    id: 'jaggery_coconut',
    name: 'Sweet Jaggery Coconut Dosa',
    tamilName: 'வெல்லம் தேங்காய் தோசை (Vellam Dosa)',
    tagline: 'Fragrant palm jaggery, grated coconut and green cardamom dessert.',
    description: 'The beloved traditional festival delicacy. Sweetened batter enriched with organic dark palm jaggery, crushed cardamom pods, and tender grated coconut, seared in pure cow ghee.',
    difficulty: 2,
    cookingTimeSec: 50,
    calories: '290 kcal',
    foldType: 'half_moon',
    imageKey: 'photo_onion_uthappam',
    ingredients: [
      { id: 'sweet_batter', name: 'Jaggery Fermented Batter', icon: '🥣', required: true, amountText: '1 ladle', culinaryRole: 'Caramelizes into dark amber sweetness' },
      { id: 'fresh_coconut', name: 'Grated Tender Coconut', icon: '🥥', required: true, amountText: '3 tbsp', culinaryRole: 'Sweet juicy crunch' },
      { id: 'cardamom', name: 'Green Cardamom & Nutmeg', icon: '🌿', required: true, amountText: '1/2 tsp', culinaryRole: 'Temple festival aroma' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Spread golden jaggery batter over medium-heated tawa.' },
      { stepNumber: 2, instruction: 'Sprinkle freshly grated coconut and crushed cardamom.' },
      { stepNumber: 3, instruction: 'Drizzle golden ghee; watch jaggery edges caramelize.' },
      { stepNumber: 4, instruction: 'Fold into half-moon; serve as royal tiffin dessert.' }
    ],
    prepStages: [
      { stageNumber: 1, title: 'Medium Heat Setting', detail: 'Sugar burns easily; use gentle medium heat.', icon: '🔥', proTip: 'Keep temperature below 160°C.' },
      { stageNumber: 2, title: 'Jaggery Spread', detail: 'Smooth ladle stroke creates soft amber disc.', icon: '🌀', proTip: 'Rich caramel color develops instantly.' },
      { stageNumber: 3, title: 'Coconut Garnish', detail: 'Snowfall of sweet grated coconut and cardamom.', icon: '🥥', proTip: 'Steam traps fragrance inside.' },
      { stageNumber: 4, title: 'Sweet Crescent', detail: 'Fold gently into a warm dessert crescent.', icon: '🌙', proTip: 'Top with a dollop of fresh churned butter.' }
    ],
    condiments: ['Melted Desi Ghee', 'Filter Coffee'],
    lore: 'Prepared during Karthigai Deepam and Pongal harvest celebrations in Tamil Nadu, this sweet treat honors the sweetness of life and ancestral tiffin traditions.',
    unlockedByDefault: false,
    unlockCostCoins: 1500,
    requiredLevel: 6
  }
];

export class RecipeService {
  private static instance: RecipeService;
  private recipes: Recipe[] = RECIPES;
  private unlockedIds: Set<string> = new Set(['plain_roast', 'masala_dosa', 'ghee_podi_dosa', 'onion_uthappam', 'mysore_masala']);

  public static getInstance(): RecipeService {
    if (!RecipeService.instance) {
      RecipeService.instance = new RecipeService();
    }
    return RecipeService.instance;
  }

  public getAll(): Recipe[] {
    return this.recipes;
  }

  public getById(id: string): Recipe | undefined {
    return this.recipes.find(r => r.id === id);
  }

  public isUnlocked(id: string): boolean {
    return this.unlockedIds.has(id);
  }

  public unlock(id: string): boolean {
    this.unlockedIds.add(id);
    return true;
  }
}
