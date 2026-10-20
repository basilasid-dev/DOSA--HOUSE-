import { RestaurantUpgrade, LevelDefinition } from '../types/recipe';
import { RecipeService } from './RecipeRegistry';

interface SaveData {
  playerCoins: number;
  currentDay: number;
  unlockedDay: number;
  dayStars: Record<number, number>;
  dayHighScores: Record<number, number>;
  upgrades: Record<string, number>;
}

const STORAGE_KEY = 'DOSA_HOUSE_SAVE_DATA_V1';

export class UpgradeService {
  private static instance: UpgradeService;
  private playerCoins: number = 250;
  private currentDay: number = 1;
  private unlockedDay: number = 1;
  private dayStars: Record<number, number> = {};
  private dayHighScores: Record<number, number> = {};

  private levels: LevelDefinition[] = [
    {
      day: 1,
      serviceTitle: 'Morning Tiffin Rush',
      tagline: 'Master the art of crispy Plain Roast & golden Masala Dosa.',
      requiredCustomers: 3,
      targetScore: 240,
      targetEarnings: 250,
      allowedRecipes: ['plain_roast', 'masala_dosa'],
      patienceMultiplier: 1.0,
      unlockedByDefault: true
    },
    {
      day: 2,
      serviceTitle: 'Fiery Gunpowder Rush',
      tagline: 'Diners demand aromatic Ghee Podi Roast and Giant Paper Roasts!',
      requiredCustomers: 4,
      targetScore: 360,
      targetEarnings: 380,
      allowedRecipes: ['plain_roast', 'masala_dosa', 'ghee_podi_dosa', 'paper_roast'],
      patienceMultiplier: 0.95,
      unlockedByDefault: false
    },
    {
      day: 3,
      serviceTitle: 'Evening Uthappam & Mysore Rush',
      tagline: 'Caramelized shallots and Mysore red garlic chutney sizzle on the tawa.',
      requiredCustomers: 5,
      targetScore: 480,
      targetEarnings: 520,
      allowedRecipes: ['plain_roast', 'masala_dosa', 'ghee_podi_dosa', 'onion_uthappam', 'mysore_masala'],
      patienceMultiplier: 0.90,
      unlockedByDefault: false
    },
    {
      day: 4,
      serviceTitle: 'Royal Chettinad & Cheese Feast',
      tagline: 'Spicy pepper paneer and molten Amul cheese dosas packed with flavor.',
      requiredCustomers: 6,
      targetScore: 620,
      targetEarnings: 700,
      allowedRecipes: ['plain_roast', 'masala_dosa', 'ghee_podi_dosa', 'onion_uthappam', 'mysore_masala', 'chettinad_paneer', 'cheese_chilli'],
      patienceMultiplier: 0.85,
      unlockedByDefault: false
    },
    {
      day: 5,
      serviceTitle: 'Grand Harvest Tiffin Festival',
      tagline: 'The ultimate culinary festival. All 10 heritage recipes are in high demand!',
      requiredCustomers: 8,
      targetScore: 850,
      targetEarnings: 950,
      allowedRecipes: ['plain_roast', 'masala_dosa', 'ghee_podi_dosa', 'onion_uthappam', 'mysore_masala', 'paper_roast', 'chettinad_paneer', 'cheese_chilli', 'rava_crispy', 'jaggery_coconut'],
      patienceMultiplier: 0.80,
      unlockedByDefault: false
    }
  ];

  private upgrades: RestaurantUpgrade[] = [
    // Kitchen Equipment
    {
      id: 'wet_grinder',
      name: 'Granite Wet Grinder',
      tamilName: 'கிரானைட் ஆட்டுக்கல்',
      category: 'kitchen',
      description: 'Traditional heavy granite roller stone. Grinds rice & urad dal into ultra-aerated, smooth batter.',
      icon: '⚙️',
      currentLevel: 0,
      maxLevel: 3,
      costs: [180, 420, 900],
      effectDescription: '+25% faster batter swirling & smoother spread'
    },
    {
      id: 'dual_tawa',
      name: 'Seasoned Heavy Kal Tawa',
      tamilName: 'பழக்கப்பட்ட இரும்பு தவா',
      category: 'kitchen',
      description: 'Superior heat-retention cast iron. Speeds up crisping and prevents sudden burning.',
      icon: '🍳',
      currentLevel: 0,
      maxLevel: 3,
      costs: [220, 500, 1100],
      effectDescription: '+20% faster roasting & +25% burn resistance'
    },
    {
      id: 'a2_ghee_jar',
      name: 'Pure Desi Cow Ghee Dispenser',
      tamilName: 'சுத்தமான நாட்டு மாட்டு நெய்',
      category: 'kitchen',
      description: 'Artisanal golden bilona ghee from grass-fed cows. Irresistible aroma earns higher tips.',
      icon: '🧈',
      currentLevel: 0,
      maxLevel: 3,
      costs: [200, 480, 950],
      effectDescription: '+25% bonus customer tip coins on every order'
    },
    {
      id: 'brass_bell',
      name: 'Temple Service Bell',
      tamilName: 'பித்தளை சேவை மணி',
      category: 'kitchen',
      description: 'Clear resonant brass bell. Ringing when plating attracts VIP food connoisseurs with 1.5x rewards.',
      icon: '🔔',
      currentLevel: 0,
      maxLevel: 2,
      costs: [300, 750],
      effectDescription: '+30% chance for VIP guests paying 1.5x coins'
    },

    // Restaurant Decor & Ambiance
    {
      id: 'brass_lamps',
      name: 'Hanging Brass Thooku Vilakku',
      tamilName: 'பித்தளை தூக்கு விளக்கு',
      category: 'ambiance',
      description: 'Tiered hanging brass oil lamps casting a warm, peaceful glow across the dining room.',
      icon: '🪔',
      currentLevel: 0,
      maxLevel: 3,
      costs: [150, 380, 800],
      effectDescription: 'Calms guests; increases patience timer by +12s'
    },
    {
      id: 'marigold_garlands',
      name: 'Fresh Marigold & Mango Toran',
      tamilName: 'சாமந்தி & மா இலை தோரணம்',
      category: 'ambiance',
      description: 'Fragrant saffron marigold flowers and fresh mango leaves strung across the restaurant.',
      icon: '🌼',
      currentLevel: 0,
      maxLevel: 2,
      costs: [140, 320],
      effectDescription: 'Welcomes diners warmly; +10% mood retention'
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
      costs: [350, 850],
      effectDescription: 'Royal prestige boost; +20% master chef score'
    }
  ];

  constructor() {
    this.load();
  }

  public static getInstance(): UpgradeService {
    if (!UpgradeService.instance) {
      UpgradeService.instance = new UpgradeService();
    }
    return UpgradeService.instance;
  }

  // ==================== COIN & BALANCE MANAGEMENT ====================

  public getCoins(): number {
    return this.playerCoins;
  }

  public addCoins(amount: number): void {
    this.playerCoins = Math.max(0, this.playerCoins + amount);
    this.save();
  }

  public deductCoins(amount: number): boolean {
    if (this.playerCoins >= amount) {
      this.playerCoins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  // ==================== LEVEL PROGRESSION ====================

  public getCurrentDay(): number {
    return this.currentDay;
  }

  public setCurrentDay(day: number): void {
    if (day >= 1 && day <= this.levels.length) {
      this.currentDay = day;
      this.save();
    }
  }

  public getUnlockedDay(): number {
    return this.unlockedDay;
  }

  public isLevelUnlocked(day: number): boolean {
    return day <= this.unlockedDay;
  }

  public getLevelDefinition(day: number): LevelDefinition {
    const found = this.levels.find(l => l.day === day);
    return found || this.levels[0];
  }

  public getAllLevels(): LevelDefinition[] {
    return this.levels;
  }

  public getStarsForDay(day: number): number {
    return this.dayStars[day] || 0;
  }

  public getHighScoreForDay(day: number): number {
    return this.dayHighScores[day] || 0;
  }

  public completeLevel(day: number, starsEarned: number, score: number, earnings: number): string[] {
    // Record highest stars and score
    this.dayStars[day] = Math.max(this.dayStars[day] || 0, starsEarned);
    this.dayHighScores[day] = Math.max(this.dayHighScores[day] || 0, score);

    // Unlock next level
    if (day >= this.unlockedDay && day < this.levels.length) {
      this.unlockedDay = day + 1;
    }

    this.save();

    // Unlock recipes for next day progression
    const newlyUnlocked = RecipeService.getInstance().unlockForDay(day + 1);
    return newlyUnlocked;
  }

  // ==================== UPGRADE PURCHASING ====================

  public getAllUpgrades(): RestaurantUpgrade[] {
    return this.upgrades;
  }

  public getUpgrade(id: string): RestaurantUpgrade | undefined {
    return this.upgrades.find(u => u.id === id);
  }

  public getUpgradeLevel(id: string): number {
    const up = this.getUpgrade(id);
    return up ? up.currentLevel : 0;
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
      this.save();
      return true;
    }
    return false;
  }

  // ==================== GAMEPLAY MODIFIERS ====================

  /**
   * Granite wet grinder: Faster batter spreading speed
   */
  public getSpreadSpeedMultiplier(): number {
    const lvl = this.getUpgradeLevel('wet_grinder');
    return 1.0 + lvl * 0.25;
  }

  /**
   * Seasoned kal tawa: Roasting crisp rate
   */
  public getCookingSpeedMultiplier(): number {
    const lvl = this.getUpgradeLevel('dual_tawa');
    return 1.0 + lvl * 0.20;
  }

  /**
   * Seasoned kal tawa: Extra seconds buffer before dosa burns
   */
  public getBurnResistanceBuffer(): number {
    const lvl = this.getUpgradeLevel('dual_tawa');
    return lvl * 0.15; // +15% per tier
  }

  /**
   * Desi cow ghee dispenser: Customer tip multiplier
   */
  public getTipBonusMultiplier(): number {
    const lvl = this.getUpgradeLevel('a2_ghee_jar');
    return 1.0 + lvl * 0.25;
  }

  /**
   * Brass Thooku Vilakku: Additional customer patience seconds
   */
  public getPatienceBonusSeconds(): number {
    const lvl = this.getUpgradeLevel('brass_lamps');
    return lvl * 12; // +12s per tier
  }

  /**
   * Temple service bell: Probability of VIP diner appearing (paying 1.5x coins)
   */
  public getVipCustomerChance(): number {
    const lvl = this.getUpgradeLevel('brass_bell');
    return lvl * 0.25; // 25% or 50% chance
  }

  /**
   * Tanjore gold leaf murals: Master chef score multiplier
   */
  public getScoreMultiplier(): number {
    const lvl = this.getUpgradeLevel('tanjore_paintings');
    return 1.0 + lvl * 0.20; // +20% score per tier
  }

  // ==================== PERSISTENT STORAGE ====================

  private save(): void {
    try {
      const upgradeLevels: Record<string, number> = {};
      this.upgrades.forEach(u => {
        upgradeLevels[u.id] = u.currentLevel;
      });

      const data: SaveData = {
        playerCoins: this.playerCoins,
        currentDay: this.currentDay,
        unlockedDay: this.unlockedDay,
        dayStars: this.dayStars,
        dayHighScores: this.dayHighScores,
        upgrades: upgradeLevels
      };

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  private load(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const data: SaveData = JSON.parse(raw);
      if (typeof data.playerCoins === 'number') {
        this.playerCoins = data.playerCoins;
      }
      if (typeof data.currentDay === 'number') {
        this.currentDay = data.currentDay;
      }
      if (typeof data.unlockedDay === 'number') {
        this.unlockedDay = data.unlockedDay;
      }
      if (data.dayStars) {
        this.dayStars = data.dayStars;
      }
      if (data.dayHighScores) {
        this.dayHighScores = data.dayHighScores;
      }
      if (data.upgrades) {
        this.upgrades.forEach(u => {
          if (typeof data.upgrades[u.id] === 'number') {
            u.currentLevel = Math.min(u.maxLevel, data.upgrades[u.id]);
          }
        });
      }
    } catch {
      // Corrupt save data, default values retained
    }
  }
}
