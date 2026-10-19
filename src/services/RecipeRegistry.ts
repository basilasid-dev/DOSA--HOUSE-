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
    unlockedByDefault: true
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
    unlockedByDefault: true
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
    unlockedByDefault: true
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
    unlockedByDefault: true
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
    unlockedByDefault: true
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

  public unlock(id: string): void {
    this.unlockedIds.add(id);
  }
}
