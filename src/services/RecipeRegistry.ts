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
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1 rounded ladle' },
      { id: 'ghee', name: 'Desi Cow Ghee', icon: '🧈', required: true, amountText: '2 tsp' },
      { id: 'sesame_oil', name: 'Gingelly Oil', icon: '🫗', required: false, amountText: '1 tsp for seasoning' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Splash a drop of water on the tawa to test sizzle heat.' },
      { stepNumber: 2, instruction: 'Pour batter into the center; spread in rapid concentric spirals.' },
      { stepNumber: 3, instruction: 'Drizzle golden ghee around the perimeter until edges lift up.' },
      { stepNumber: 4, instruction: 'Roll smoothly into a tight golden cylindrical flute.' }
    ],
    condiments: ['Fresh Coconut Chutney', 'Piping Hot Drumstick Sambar', 'Tangy Tomato-Onion Chutney'],
    lore: 'Historically mentioned in the 12th-century Sanskrit encyclopedia Manasollasa as "Dosaka", this beloved dish has been perfected through generations of South Indian culinary masters.',
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
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1 ladle' },
      { id: 'potato_masala', name: 'Spiced Potato Curry', icon: '🥔', required: true, amountText: '2 generous scoops' },
      { id: 'ghee', name: 'Desi Cow Ghee', icon: '🧈', required: true, amountText: '1.5 tsp' },
      { id: 'curry_leaves', name: 'Crisp Curry Leaves', icon: '🌿', required: true, amountText: 'A pinch' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Spread fermented batter evenly across hot seasoned tawa.' },
      { stepNumber: 2, instruction: 'Drizzle ghee around the edges and wait for the golden glow.' },
      { stepNumber: 3, instruction: 'Spoon warm potato bhaji into the center fold line.' },
      { stepNumber: 4, instruction: 'Fold both sides into the iconic royal triangular envelop.' }
    ],
    condiments: ['Coriander Mint Chutney', 'Drumstick Sambar', 'Shallot Garlic Chutney'],
    lore: 'Legend has it that masala dosa was born in Udupi kitchens when chefs sought an ingenious way to combine potato curry into a portable, mess-free crispy crepe.',
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
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1 ladle' },
      { id: 'idli_podi', name: 'Fiery Gunpowder (Idli Podi)', icon: '🌶️', required: true, amountText: '2 tbsp' },
      { id: 'ghee', name: 'Desi Cow Ghee', icon: '🧈', required: true, amountText: '2.5 tsp' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Swirl the batter slightly thicker for maximum podi absorption.' },
      { stepNumber: 2, instruction: 'Liberally dust spicy gunpowder across the wet surface.' },
      { stepNumber: 3, instruction: 'Pour steaming ghee; watch the podi turn a rich dark maroon.' },
      { stepNumber: 4, instruction: 'Fold in half to lock in the caramelized spicy aroma.' }
    ],
    condiments: ['Creamy Coconut Chutney', 'Sweet Tomato Thokku'],
    lore: 'Idli Podi is celebrated as South Indian "gunpowder" because of its instant blast of roasted lentils, sesame, and dry red Byadagi chillies seared in ghee.',
    unlockedByDefault: false
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
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1.5 ladles (thick)' },
      { id: 'shallots', name: 'Diced Sambar Onions', icon: '🧅', required: true, amountText: '1 small bowl' },
      { id: 'chillies', name: 'Finely Chopped Green Chillies', icon: '🌶️', required: false, amountText: '1 tsp' },
      { id: 'sesame_oil', name: 'Cold Pressed Sesame Oil', icon: '🫗', required: true, amountText: '2 tsp' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Pour thick batter and spread gently into a cushiony disc.' },
      { stepNumber: 2, instruction: 'Press diced shallots and chillies firmly into the wet batter.' },
      { stepNumber: 3, instruction: 'Drizzle sesame oil around edges and gently flip once.' },
      { stepNumber: 4, instruction: 'Sear until onions are golden, sweet, and lightly charred.' }
    ],
    condiments: ['Red Chilli Garlic Chutney', 'Piping Hot Sambar'],
    lore: 'Unlike thin dosas, Uthappam celebrates the fluffy, porous texture of naturally fermented batter, creating sweet pockets where onions brown beautifully.',
    unlockedByDefault: false
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
    ingredients: [
      { id: 'batter', name: 'Fermented Dosa Batter', icon: '🥣', required: true, amountText: '1 ladle' },
      { id: 'mysore_paste', name: 'Fiery Red Garlic Chutney', icon: '🧄', required: true, amountText: '1.5 tbsp' },
      { id: 'butter', name: 'White Makhan Butter', icon: '🧈', required: true, amountText: '1 large dollop' },
      { id: 'potato_masala', name: 'Silky Masala Filling', icon: '🥔', required: true, amountText: '1 scoop' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Swirl crisp thin batter over tawa at high heat.' },
      { stepNumber: 2, instruction: 'Smear ruby Mysore paste across entire inner face with spatula.' },
      { stepNumber: 3, instruction: 'Drop dollop of white butter and spiced potato center.' },
      { stepNumber: 4, instruction: 'Fold tightly into crisp golden triangle.' }
    ],
    condiments: ['Coconut-Coriander Chutney', 'Traditional Hotel Sambar'],
    lore: 'Invented in the historic cafes of Mysore, the addition of red chili-garlic paste transformed the humble dosa into a luxurious royal feast.',
    unlockedByDefault: false
  }
];

export class RecipeService {
  private static instance: RecipeService;
  private recipes: Recipe[] = RECIPES;
  private unlockedIds: Set<string> = new Set(['plain_roast', 'masala_dosa']);

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
