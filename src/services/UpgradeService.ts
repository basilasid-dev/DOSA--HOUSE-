import { RestaurantUpgrade } from '../types/recipe';

export class UpgradeService {
  private static instance: UpgradeService;
  private playerCoins: number = 650; // Starting coins for player to experiment with
  private restaurantLevel: number = 1;
  private upgrades: RestaurantUpgrade[] = [
    // Kitchen Equipment
    {
      id: 'wet_grinder',
      name: 'Granite Wet Grinder',
      tamilName: 'கிரானைட் ஆட்டுக்கல்',
      category: 'kitchen',
      description: 'Traditional heavy granite roller stone. Grinds rice & urad dal into ultra-aerated, fluffy batter.',
      icon: '⚙️',
      currentLevel: 1,
      maxLevel: 3,
      costs: [250, 600, 1200],
      effectDescription: '+20% faster batter replenishment & lacy texture'
    },
    {
      id: 'dual_tawa',
      name: 'Dual Cast-Iron Kal Tawa',
      tamilName: 'இரட்டை இரும்பு தவா',
      category: 'kitchen',
      description: 'Second heavy seasoned iron tawa. Lets you maintain optimal cooking temperature continuously.',
      icon: '🍳',
      currentLevel: 0,
      maxLevel: 3,
      costs: [350, 850, 1600],
      effectDescription: 'Tawa heats up 30% faster & prevents burning'
    },
    {
      id: 'a2_ghee_jar',
      name: 'Pure Desi Cow Ghee Dispenser',
      tamilName: 'சுத்தமான நாட்டு மாட்டு நெய்',
      category: 'kitchen',
      description: 'Artisanal golden bilona ghee from grass-fed cows. Irresistible nutty aroma earns higher tips.',
      icon: '🧈',
      currentLevel: 1,
      maxLevel: 3,
      costs: [280, 700, 1400],
      effectDescription: '+25% bonus customer tip coins on every order'
    },
    {
      id: 'brass_bell',
      name: 'Temple Service Bell',
      tamilName: 'பித்தளை சேவை மணி',
      category: 'kitchen',
      description: 'Clear resonant brass bell. Ringing when plating attracts VIP food bloggers and royalty.',
      icon: '🔔',
      currentLevel: 0,
      maxLevel: 2,
      costs: [450, 1100],
      effectDescription: 'Attracts generous VIP diners with 2x rewards'
    },

    // Restaurant Decor & Ambiance
    {
      id: 'brass_lamps',
      name: 'Hanging Brass Thooku Vilakku',
      tamilName: 'பித்தளை தூக்கு விளக்கு',
      category: 'ambiance',
      description: 'Traditional tiered hanging oil lamps casting a warm, serene golden glow across the dining room.',
      icon: '🪔',
      currentLevel: 1,
      maxLevel: 3,
      costs: [200, 500, 1000],
      effectDescription: 'Calms guests; increases patience timer by +15 seconds'
    },
    {
      id: 'chettinad_pillars',
      name: 'Chettinad Teak Pillars',
      tamilName: 'செட்டிநாடு தேக்கு மரத்தூண்கள்',
      category: 'ambiance',
      description: 'Centuries-old hand-carved rosewood and teak pillars with lotus capitals and brass rings.',
      icon: '🏛️',
      currentLevel: 0,
      maxLevel: 3,
      costs: [400, 950, 1900],
      effectDescription: 'Elevates restaurant rating & increases customer traffic'
    },
    {
      id: 'marigold_garlands',
      name: 'Fresh Marigold & Mango Toran',
      tamilName: 'சாமந்தி & மா இலை தோரணம்',
      category: 'ambiance',
      description: 'Fragrant saffron marigold flowers and fresh mango leaves strung across the dining entrance.',
      icon: '🌼',
      currentLevel: 1,
      maxLevel: 2,
      costs: [150, 400],
      effectDescription: 'Welcomes larger dining groups; +1 extra order ticket slot'
    },
    {
      id: 'tanjore_paintings',
      name: 'Tanjore Gold Leaf Murals',
      tamilName: 'தஞ்சாவூர் தங்க ஓவியம்',
      category: 'ambiance',
      description: 'Sumptuous 22k gold foil embossed heritage paintings depicting South Indian harvest festivals.',
      icon: '🖼️',
      currentLevel: 0,
      maxLevel: 2,
      costs: [550, 1300],
      effectDescription: 'Royal prestige boost; +35% total score multiplier'
    }
  ];

  public static getInstance(): UpgradeService {
    if (!UpgradeService.instance) {
      UpgradeService.instance = new UpgradeService();
    }
    return UpgradeService.instance;
  }

  public getCoins(): number {
    return this.playerCoins;
  }

  public addCoins(amount: number): void {
    this.playerCoins += amount;
  }

  public deductCoins(amount: number): boolean {
    if (this.playerCoins >= amount) {
      this.playerCoins -= amount;
      return true;
    }
    return false;
  }

  public getLevel(): number {
    return this.restaurantLevel;
  }

  public setLevel(lvl: number): void {
    this.restaurantLevel = lvl;
  }

  public getAllUpgrades(): RestaurantUpgrade[] {
    return this.upgrades;
  }

  public getUpgrade(id: string): RestaurantUpgrade | undefined {
    return this.upgrades.find(u => u.id === id);
  }

  public canAfford(upgradeId: string): boolean {
    const up = this.getUpgrade(upgradeId);
    if (!up || up.currentLevel >= up.maxLevel) return false;
    const cost = up.costs[up.currentLevel];
    return this.playerCoins >= cost;
  }

  public purchaseUpgrade(upgradeId: string): boolean {
    const up = this.getUpgrade(upgradeId);
    if (!up || up.currentLevel >= up.maxLevel) return false;
    const cost = up.costs[up.currentLevel];
    if (this.deductCoins(cost)) {
      up.currentLevel++;
      return true;
    }
    return false;
  }
}
