import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { CozyButton } from '../ui/CozyButton';
import { SteamEmitter } from '../ui/SteamParticles';
import { RecipeBookModal } from '../ui/RecipeBookModal';
import { SettingsModal } from '../ui/SettingsModal';
import { UpgradesModal } from '../ui/UpgradesModal';
import { LevelCompleteModal } from '../ui/LevelCompleteModal';
import { LevelSelectModal } from '../ui/LevelSelectModal';
import { CustomerOrderCard } from '../ui/CustomerOrderCard';
import { UpgradeService } from '../services/UpgradeService';
import { CustomerOrder, LevelResult, Recipe, LevelDefinition } from '../types/recipe';
import { DosaSurface, DosaCookingQuality } from '../mechanics/DosaSurface';
import { QualityReviewModal } from '../ui/QualityReviewModal';
import { RECIPES, RecipeService } from '../services/RecipeRegistry';

interface CustomerTemplate {
  customerName: string;
  customerTitle: string;
  avatarKey: string;
  recipeId: string;
  recipeName: string;
  dishImageKey: string;
  crispinessPreference: 'soft' | 'medium' | 'extra_crispy';
  extraGhee: boolean;
  specialNote: string;
  timeLimitSec: number;
  rewardCoins: number;
}

const CUSTOMER_ROSTER: CustomerTemplate[] = [
  {
    customerName: 'Uncle Venkatesh',
    customerTitle: 'Regular Foodie',
    avatarKey: 'avatar_venkatesh',
    recipeId: 'masala_dosa',
    recipeName: 'Masala Dosa',
    dishImageKey: 'photo_masala_dosa',
    crispinessPreference: 'extra_crispy',
    extraGhee: true,
    specialNote: 'Extra golden crisp, double potato curry filling!',
    timeLimitSec: 65,
    rewardCoins: 120
  },
  {
    customerName: 'Priya',
    customerTitle: 'Morning Regular',
    avatarKey: 'avatar_priya',
    recipeId: 'plain_roast',
    recipeName: 'Plain Ghee Roast',
    dishImageKey: 'photo_plain_roast',
    crispinessPreference: 'extra_crispy',
    extraGhee: true,
    specialNote: 'Paper-thin cylindrical flute, pure cow ghee aroma',
    timeLimitSec: 50,
    rewardCoins: 95
  },
  {
    customerName: 'Karthik',
    customerTitle: 'Spice Connoisseur',
    avatarKey: 'avatar_karthik',
    recipeId: 'ghee_podi_dosa',
    recipeName: 'Ghee Podi Roast',
    dishImageKey: 'photo_ghee_podi',
    crispinessPreference: 'medium',
    extraGhee: true,
    specialNote: 'Heavy gunpowder dust seared in bubbling desi ghee',
    timeLimitSec: 55,
    rewardCoins: 140
  },
  {
    customerName: 'Auntie Meenakshi',
    customerTitle: 'Grandma & Food Critic',
    avatarKey: 'avatar_meenakshi',
    recipeId: 'onion_uthappam',
    recipeName: 'Caramelized Onion Uthappam',
    dishImageKey: 'photo_onion_uthappam',
    crispinessPreference: 'medium',
    extraGhee: true,
    specialNote: 'Thick spongy pancake with caramelized shallots',
    timeLimitSec: 70,
    rewardCoins: 110
  },
  {
    customerName: 'Manoj & Table',
    customerTitle: 'Weekend Family Feast',
    avatarKey: 'avatar_venkatesh',
    recipeId: 'paper_roast',
    recipeName: 'Giant Paper Ghee Roast',
    dishImageKey: 'photo_paper_roast',
    crispinessPreference: 'extra_crispy',
    extraGhee: true,
    specialNote: 'A monumental 3-foot crispy golden telescope for the table!',
    timeLimitSec: 80,
    rewardCoins: 180
  },
  {
    customerName: 'Rajesh',
    customerTitle: 'Royal Connoisseur',
    avatarKey: 'avatar_karthik',
    recipeId: 'mysore_masala',
    recipeName: 'Mysore Royal Masala Dosa',
    dishImageKey: 'photo_mysore_masala',
    crispinessPreference: 'extra_crispy',
    extraGhee: true,
    specialNote: 'Fiery red garlic chutney smear with spiced potatoes!',
    timeLimitSec: 70,
    rewardCoins: 165
  },
  {
    customerName: 'Dr. Subramanian',
    customerTitle: 'Chettinad Gourmet',
    avatarKey: 'avatar_venkatesh',
    recipeId: 'chettinad_paneer',
    recipeName: 'Chettinad Spicy Paneer Dosa',
    dishImageKey: 'photo_chettinad_paneer',
    crispinessPreference: 'medium',
    extraGhee: true,
    specialNote: 'Crumbled malai paneer in black pepper & fennel masala!',
    timeLimitSec: 75,
    rewardCoins: 190
  },
  {
    customerName: 'Divya',
    customerTitle: 'Street Food Connoisseur',
    avatarKey: 'avatar_priya',
    recipeId: 'cheese_chilli',
    recipeName: 'Amul Cheese & Green Chilli Dosa',
    dishImageKey: 'photo_cheese_chilli',
    crispinessPreference: 'medium',
    extraGhee: true,
    specialNote: 'A mountain of melted gooey cheese with spicy green chillies!',
    timeLimitSec: 60,
    rewardCoins: 175
  },
  {
    customerName: 'Srinivasan',
    customerTitle: 'Lacy Tiffin Master',
    avatarKey: 'avatar_karthik',
    recipeId: 'rava_crispy',
    recipeName: 'Lacy Rava Cumin Roast',
    dishImageKey: 'photo_rava_crispy',
    crispinessPreference: 'extra_crispy',
    extraGhee: true,
    specialNote: 'Wafer-thin golden honeycomb lattice with whole cumin seeds!',
    timeLimitSec: 70,
    rewardCoins: 160
  },
  {
    customerName: 'Revathi',
    customerTitle: 'Festival Sweet Tooth',
    avatarKey: 'avatar_meenakshi',
    recipeId: 'jaggery_coconut',
    recipeName: 'Sweet Jaggery Coconut Dosa',
    dishImageKey: 'photo_jaggery_coconut',
    crispinessPreference: 'medium',
    extraGhee: true,
    specialNote: 'Caramelized dark palm jaggery with sweet fresh coconut & cardamom!',
    timeLimitSec: 55,
    rewardCoins: 150
  }
];

export class GameScene extends Phaser.Scene {
  private tawaTempText?: Phaser.GameObjects.Text;
  private tawaGlow?: Phaser.GameObjects.Graphics;
  private cashText?: Phaser.GameObjects.Text;
  private dinersGoalText?: Phaser.GameObjects.Text;
  private scoreGoalText?: Phaser.GameObjects.Text;
  private dayTitleText?: Phaser.GameObjects.Text;

  private sizzleCount: number = 0;
  private currentTemp: number = 185;
  private activeOrderIndex: number = 0;
  private isModalOpen: boolean = false;
  private rosterIndex: number = 0;

  // Level Progression & Shift Statistics
  private currentDay: number = 1;
  private levelDef!: LevelDefinition;
  private levelCustomersServed: number = 0;
  private levelScoreTotal: number = 0;
  private levelEarningsTotal: number = 0;
  private perfectDosasCount: number = 0;

  // Active customer slots (3 customer slots on the ticket rail)
  private slotOrders: (CustomerOrder | null)[] = [null, null, null];
  private orderCards: (CustomerOrderCard | null)[] = [null, null, null];
  private slotXPositions: number[] = [350, 640, 930];
  private readonly railY: number = 118;

  // Interactive Dosa Cooking & Plating Mechanics
  private dosaSurface!: DosaSurface;
  private ladle!: Phaser.GameObjects.Image;
  private ladleHomePos: { x: number; y: number } = { x: 165, y: 360 };
  private tawaCenter: { x: number; y: number } = { x: 640, y: 375 };
  private isLadleAtTawa: boolean = false;
  private guidanceText?: Phaser.GameObjects.Text;
  private promptArrow?: Phaser.GameObjects.Text;
  private spatulaImg?: Phaser.GameObjects.Image;

  // Plating & Serving System
  private plateContainer?: Phaser.GameObjects.Container;
  private plateGlow?: Phaser.GameObjects.Graphics;
  private isDosaPlated: boolean = false;
  private dragProxy?: Phaser.GameObjects.Container;
  private serveBarBtnBg?: Phaser.GameObjects.Graphics;
  private serveBarBtnTxt?: Phaser.GameObjects.Text;
  private serveBarBtnContainer?: Phaser.GameObjects.Container;

  // Combo & Streak Visual Effects
  private comboCount: number = 0;
  private lastServeTime: number = 0;
  private readonly comboWindowMs: number = 28000;

  // Right Toppings Station State & Recipe Target Override
  private toppingsPageIndex: number = 0;
  private toppingsItemsContainer?: Phaser.GameObjects.Container;
  private toppingsPageToggleText?: Phaser.GameObjects.Text;
  private recipeOverride: Recipe | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    const { width, height } = THEME.dimensions;
    const sound = SoundFX.getInstance();
    const upgradeService = UpgradeService.getInstance();

    // 1. Initialize Current Level Definition & Statistics
    this.currentDay = upgradeService.getCurrentDay();
    this.levelDef = upgradeService.getLevelDefinition(this.currentDay);
    this.levelCustomersServed = 0;
    this.levelScoreTotal = 0;
    this.levelEarningsTotal = 0;
    this.perfectDosasCount = 0;
    this.comboCount = 0;
    this.lastServeTime = 0;
    this.slotOrders = [null, null, null];
    this.orderCards = [null, null, null];
    this.isDosaPlated = false;
    this.isModalOpen = false;

    this.cameras.main.fadeIn(350, 26, 14, 7);

    // 2. Restaurant Dining Hall Illustrated Backdrop (Same model as Main Menu)
    const bg = this.add.image(width / 2, height / 2, 'restaurant_bg');
    bg.setDisplaySize(width, height);
    bg.setAlpha(0.68);

    // Warm Teak Color Grading
    const warmOverlay = this.add.graphics();
    warmOverlay.fillStyle(THEME.colors.teakWood, 0.35);
    warmOverlay.fillRect(0, 0, width, height);

    // Polished Kitchen Workbench Countertop for Cast-Iron Tawa & Prep Stations
    const counterTop = this.add.graphics();
    counterTop.fillStyle(THEME.colors.darkWood, 0.72);
    counterTop.fillRect(0, 222, width, height - 222);
    // Brass counter trim
    counterTop.lineStyle(2.5, THEME.colors.brass, 0.8);
    counterTop.lineBetween(0, 222, width, 222);
    counterTop.lineStyle(1, THEME.colors.turmericGold, 0.45);
    counterTop.lineBetween(0, 225, width, 225);

    // Vignette
    const vignette = this.add.image(width / 2, height / 2, 'fx_vignette');
    vignette.setDisplaySize(width, height);
    vignette.setAlpha(0.75);

    // 3. Top Kitchen Status HUD (y: 0..48) with Level Goals
    this.createKitchenHUD(width);

    // 4. Customer Order Ticket Rail (y: 50..182)
    this.createOrderTicketRail(width);

    // 5. Interactive Guidance Banner (y: 198)
    this.createInstructionHUD();

    // 6. Central Cooking Station: Cast-Iron Tawa (y: 375)
    this.createCentralTawaStation(this.tawaCenter.x, this.tawaCenter.y);

    // 7. Left Station: Fermented Batter & Water Cup (x: 150, y: 385)
    this.createLeftPrepStation(150, 385);

    // 8. Right Station: Ghee Cup & Toppings Rack (x: 1130, y: 385)
    this.createRightToppingsStation(1130, 385);

    // 9. Bottom Station: Banana Leaf Platter & Condiment Bowls (y: 645)
    this.createPlatingStation(640, 645);

    // 10. Bottom Navigation Controls (y: 698)
    this.createBottomControls(width, height);

    // 11. Prompt Arrow for first-time players
    this.createPromptArrow();

    // 12. Global Pointer movement listeners for circular swirl gesture
    this.setupSwirlInputListeners();

    // 13. Spawn initial customers with gentle staggered bell rings
    this.spawnInitialCustomers();

    // Play subtle opening kitchen ambience
    sound.playSizzle(0.6);
  }

  /**
   * Top HUD with restaurant day, goals progress, register cash, upgrades, days selector, sound, and menu
   */
  private createKitchenHUD(width: number): void {
    const hudContainer = this.add.container(0, 0);
    hudContainer.setDepth(40);
    const upgradeService = UpgradeService.getInstance();

    const hudBg = this.add.graphics();
    hudBg.fillStyle(THEME.colors.teakWood, 0.96);
    hudBg.fillRect(0, 0, width, 48);
    hudBg.lineStyle(2, THEME.colors.brass, 0.9);
    hudBg.lineBetween(0, 48, width, 48);
    hudContainer.add(hudBg);

    // Day & Service period
    this.dayTitleText = this.add.text(18, 14, `DAY ${this.currentDay}: ${this.levelDef.serviceTitle.toUpperCase()} ☀️`, {
      fontFamily: THEME.fonts.title,
      fontSize: '13px',
      color: THEME.colors.turmericBrightHex
    });
    hudContainer.add(this.dayTitleText);

    // Level Diners Goal Tracker
    this.dinersGoalText = this.add.text(285, 14, `👥 DINERS: 0/${this.levelDef.requiredCustomers}`, {
      fontFamily: THEME.fonts.title,
      fontSize: '13px',
      color: THEME.colors.creamHex
    });
    hudContainer.add(this.dinersGoalText);

    // Level Score Goal Tracker
    this.scoreGoalText = this.add.text(415, 14, `🎯 SCORE: 0/${this.levelDef.targetScore}`, {
      fontFamily: THEME.fonts.title,
      fontSize: '13px',
      color: THEME.colors.turmericGoldHex
    });
    hudContainer.add(this.scoreGoalText);

    // Live Treasury Cash Register
    this.cashText = this.add.text(565, 14, `💰 CASH: ₹ ${upgradeService.getCoins()}`, {
      fontFamily: THEME.fonts.title,
      fontSize: '13px',
      color: THEME.colors.creamHex
    });
    hudContainer.add(this.cashText);

    // Upgrades Button
    const upBtn = this.add.container(width - 505, 24);
    const upBg = this.add.graphics();
    upBg.fillStyle(THEME.colors.lightWood, 0.9);
    upBg.fillRoundedRect(-46, -14, 92, 28, 6);
    upBg.lineStyle(1.2, THEME.colors.brass, 0.8);
    upBg.strokeRoundedRect(-46, -14, 92, 28, 6);
    upBtn.add(upBg);

    const upTxt = this.add.text(0, 0, '🏛️ UPGRADES', {
      fontFamily: THEME.fonts.body,
      fontSize: '9px',
      fontStyle: 'bold',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    upBtn.add(upTxt);

    upBtn.setSize(92, 28);
    upBtn.setInteractive({ useHandCursor: true });
    upBtn.on('pointerover', () => {
      SoundFX.getInstance().playHover();
      this.tweens.add({ targets: upBtn, scaleX: 1.06, scaleY: 1.06, duration: 100, ease: 'Back.easeOut' });
    });
    upBtn.on('pointerout', () => {
      this.tweens.add({ targets: upBtn, scaleX: 1.0, scaleY: 1.0, duration: 100, ease: 'Quad.easeOut' });
    });
    upBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.openUpgrades();
    });
    hudContainer.add(upBtn);

    // Days / Levels Select button
    const dayBtn = this.add.container(width - 405, 24);
    const dayBg = this.add.graphics();
    dayBg.fillStyle(THEME.colors.lightWood, 0.9);
    dayBg.fillRoundedRect(-43, -14, 86, 28, 6);
    dayBg.lineStyle(1.2, THEME.colors.brass, 0.8);
    dayBg.strokeRoundedRect(-43, -14, 86, 28, 6);
    dayBtn.add(dayBg);

    const dayTxt = this.add.text(0, 0, '🗓️ DAYS (5)', {
      fontFamily: THEME.fonts.body,
      fontSize: '9px',
      fontStyle: 'bold',
      color: THEME.colors.turmericGoldHex
    }).setOrigin(0.5);
    dayBtn.add(dayTxt);

    dayBtn.setSize(86, 28);
    dayBtn.setInteractive({ useHandCursor: true });
    dayBtn.on('pointerover', () => {
      SoundFX.getInstance().playHover();
      this.tweens.add({ targets: dayBtn, scaleX: 1.06, scaleY: 1.06, duration: 100, ease: 'Back.easeOut' });
    });
    dayBtn.on('pointerout', () => {
      this.tweens.add({ targets: dayBtn, scaleX: 1.0, scaleY: 1.0, duration: 100, ease: 'Quad.easeOut' });
    });
    dayBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.openLevelSelect();
    });
    hudContainer.add(dayBtn);

    // Recipe Guide button
    const bookBtn = this.add.container(width - 310, 24);
    const bookBg = this.add.graphics();
    bookBg.fillStyle(THEME.colors.lightWood, 0.9);
    bookBg.fillRoundedRect(-43, -14, 86, 28, 6);
    bookBg.lineStyle(1.2, THEME.colors.brass, 0.8);
    bookBg.strokeRoundedRect(-43, -14, 86, 28, 6);
    bookBtn.add(bookBg);

    const bookTxt = this.add.text(0, 0, '📖 RECIPES', {
      fontFamily: THEME.fonts.body,
      fontSize: '9px',
      fontStyle: 'bold',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    bookBtn.add(bookTxt);

    bookBtn.setSize(86, 28);
    bookBtn.setInteractive({ useHandCursor: true });
    bookBtn.on('pointerover', () => {
      SoundFX.getInstance().playHover();
      this.tweens.add({ targets: bookBtn, scaleX: 1.06, scaleY: 1.06, duration: 100, ease: 'Back.easeOut' });
    });
    bookBtn.on('pointerout', () => {
      this.tweens.add({ targets: bookBtn, scaleX: 1.0, scaleY: 1.0, duration: 100, ease: 'Quad.easeOut' });
    });
    bookBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.openRecipeBook();
    });
    hudContainer.add(bookBtn);

    // Settings Modal button
    const setBtn = this.add.container(width - 215, 24);
    const setBg = this.add.graphics();
    setBg.fillStyle(THEME.colors.lightWood, 0.9);
    setBg.fillRoundedRect(-43, -14, 86, 28, 6);
    setBg.lineStyle(1.2, THEME.colors.brass, 0.8);
    setBg.strokeRoundedRect(-43, -14, 86, 28, 6);
    setBtn.add(setBg);

    const setTxt = this.add.text(0, 0, '⚙️ SETTINGS', {
      fontFamily: THEME.fonts.body,
      fontSize: '9px',
      fontStyle: 'bold',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    setBtn.add(setTxt);

    setBtn.setSize(86, 28);
    setBtn.setInteractive({ useHandCursor: true });
    setBtn.on('pointerover', () => {
      SoundFX.getInstance().playHover();
      this.tweens.add({ targets: setBtn, scaleX: 1.06, scaleY: 1.06, duration: 100, ease: 'Back.easeOut' });
    });
    setBtn.on('pointerout', () => {
      this.tweens.add({ targets: setBtn, scaleX: 1.0, scaleY: 1.0, duration: 100, ease: 'Quad.easeOut' });
    });
    setBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.openSettings();
    });
    hudContainer.add(setBtn);

    // Audio quick toggle
    const sound = SoundFX.getInstance();
    const soundBtn = this.add.container(width - 138, 24);
    const soundIcon = this.add.image(0, 0, sound.isMuted() ? 'icon_sound_off' : 'icon_sound_on').setScale(0.65);
    soundBtn.add(soundIcon);
    soundBtn.setSize(30, 30);
    soundBtn.setInteractive({ useHandCursor: true });
    soundBtn.on('pointerover', () => {
      this.tweens.add({ targets: soundBtn, scaleX: 1.15, scaleY: 1.15, duration: 100 });
    });
    soundBtn.on('pointerout', () => {
      this.tweens.add({ targets: soundBtn, scaleX: 1.0, scaleY: 1.0, duration: 100 });
    });
    soundBtn.on('pointerdown', () => {
      const isMuted = sound.toggleMute();
      soundIcon.setTexture(isMuted ? 'icon_sound_off' : 'icon_sound_on');
      if (!isMuted) sound.playClick();
    });
    hudContainer.add(soundBtn);

    // Fullscreen quick toggle (for smartphone immersion)
    const fsBtn = this.add.container(width - 110, 24);
    const fsTxt = this.add.text(0, 0, '⛶', {
      fontSize: '15px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    fsBtn.add(fsTxt);
    fsBtn.setSize(24, 24);
    fsBtn.setInteractive({ useHandCursor: true });
    fsBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });
    hudContainer.add(fsBtn);

    // Main Menu Return Button
    const menuBtn = this.add.container(width - 65, 24);
    const menuBg = this.add.graphics();
    menuBg.fillStyle(THEME.colors.terracotta, 0.9);
    menuBg.fillRoundedRect(-40, -14, 80, 28, 6);
    menuBg.lineStyle(1.2, THEME.colors.brassBright, 0.8);
    menuBg.strokeRoundedRect(-40, -14, 80, 28, 6);
    menuBtn.add(menuBg);

    const menuTxt = this.add.text(0, 0, '🚪 MENU', {
      fontFamily: THEME.fonts.body,
      fontSize: '9.5px',
      fontStyle: 'bold',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    menuBtn.add(menuTxt);

    menuBtn.setSize(80, 28);
    menuBtn.setInteractive({ useHandCursor: true });
    menuBtn.on('pointerover', () => {
      SoundFX.getInstance().playHover();
      this.tweens.add({ targets: menuBtn, scaleX: 1.06, scaleY: 1.06, duration: 100, ease: 'Back.easeOut' });
    });
    menuBtn.on('pointerout', () => {
      this.tweens.add({ targets: menuBtn, scaleX: 1.0, scaleY: 1.0, duration: 100, ease: 'Quad.easeOut' });
    });
    menuBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.cameras.main.fadeOut(300, 26, 14, 7);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MainMenuScene');
      });
    });
    hudContainer.add(menuBtn);
  }

  /**
   * Top Customer Order Ticket Rail backing
   */
  private createOrderTicketRail(width: number): void {
    const rail = this.add.graphics();
    rail.fillStyle(THEME.colors.teakWood, 0.95);
    rail.fillRect(width / 2 - 470, 48, 940, 14);
    rail.lineStyle(1.5, THEME.colors.brass, 0.85);
    rail.strokeRect(width / 2 - 470, 48, 940, 14);
  }

  /**
   * Spawn initial customers across the 3 slots
   */
  private spawnInitialCustomers(): void {
    this.spawnCustomerAtSlot(0, 100);
    this.spawnCustomerAtSlot(1, 450);
    this.spawnCustomerAtSlot(2, 800);
  }

  /**
   * Spawn a customer into a specific rail slot, respecting level recipes and upgrade modifiers
   */
  private spawnCustomerAtSlot(slotIdx: number, delayMs: number = 0): void {
    this.time.delayedCall(delayMs, () => {
      const upgradeService = UpgradeService.getInstance();

      // Filter roster by allowed recipes for this day's shift and unlocked recipes
      const recipeService = RecipeService.getInstance();
      const allowedTemplates = CUSTOMER_ROSTER.filter(t =>
        this.levelDef.allowedRecipes.includes(t.recipeId) && recipeService.isUnlocked(t.recipeId)
      );
      const unlockedTemplates = CUSTOMER_ROSTER.filter(t => recipeService.isUnlocked(t.recipeId));
      const pool = allowedTemplates.length > 0 ? allowedTemplates : (unlockedTemplates.length > 0 ? unlockedTemplates : CUSTOMER_ROSTER);
      const template = pool[this.rosterIndex % pool.length];
      this.rosterIndex++;

      // Temple service bell upgrade: Check for generous VIP diner
      const vipChance = upgradeService.getVipCustomerChance();
      const isVip = Math.random() < vipChance;

      // Hanging brass lamps upgrade: Additional customer patience time
      const patienceBonus = upgradeService.getPatienceBonusSeconds();
      const baseTime = Math.round(template.timeLimitSec * this.levelDef.patienceMultiplier) + patienceBonus;

      const newOrder: CustomerOrder = {
        id: `ord_${Date.now()}_${slotIdx}`,
        customerName: isVip ? `VIP ${template.customerName}` : template.customerName,
        customerTitle: isVip ? '👑 VIP Foodie' : template.customerTitle,
        avatarKey: template.avatarKey,
        tableNumber: slotIdx + 1,
        recipeId: template.recipeId,
        recipeName: template.recipeName,
        dishImageKey: template.dishImageKey,
        crispinessPreference: template.crispinessPreference,
        extraGhee: template.extraGhee,
        specialNote: template.specialNote,
        timeLimitSec: baseTime,
        patienceRemainingSec: baseTime,
        rewardCoins: isVip ? Math.round(template.rewardCoins * 1.5) : template.rewardCoins,
        mood: 'happy',
        isAccepted: slotIdx === 0, // Auto-accept first slot for immediate action
        status: slotIdx === 0 ? 'accepted' : 'waiting'
      };

      this.slotOrders[slotIdx] = newOrder;

      const cardX = this.slotXPositions[slotIdx];
      const isSelected = slotIdx === this.activeOrderIndex;

      // Start card above rail for smooth slide-in arrival
      const card = new CustomerOrderCard(
        this,
        cardX,
        -80,
        newOrder,
        isSelected,
        // On Select
        () => {
          this.activeOrderIndex = slotIdx;
          this.refreshOrderSelection();
        },
        // On Accept
        () => {
          this.activeOrderIndex = slotIdx;
          this.refreshOrderSelection();
          this.spawnStationTip(`Accepted order for ${newOrder.customerName}!`);
        },
        // On Timeout
        (timedOutOrder) => {
          this.handleCustomerTimeout(slotIdx, timedOutOrder);
        },
        // On Click while Plated (Serve attempt)
        (targetOrder) => {
          if (this.isDosaPlated) {
            this.handleServeToCustomer(card, targetOrder, slotIdx);
          }
        }
      );

      // Slide-down arrival animation
      this.tweens.add({
        targets: card,
        y: this.railY,
        duration: 380,
        ease: 'Back.easeOut',
        onComplete: () => {
          SoundFX.getInstance().playOrderBell();
        }
      });

      this.orderCards[slotIdx] = card;
      this.refreshOrderSelection();
    });
  }

  /**
   * Handle customer timing out and leaving
   */
  private handleCustomerTimeout(slotIdx: number, order: CustomerOrder): void {
    const card = this.orderCards[slotIdx];
    if (card) {
      card.exitAnimation('timeout', () => {
        this.orderCards[slotIdx] = null;
        this.slotOrders[slotIdx] = null;

        // Tip penalty
        const upgradeService = UpgradeService.getInstance();
        const coins = upgradeService.getCoins();
        const penalty = Math.min(15, coins);
        if (penalty > 0) {
          upgradeService.addCoins(-penalty);
          if (this.cashText) {
            this.cashText.setText(`💰 CASH: ₹ ${upgradeService.getCoins()}`);
          }
        }

        this.spawnStationTip(`${order.customerName} left disappointed! -₹${penalty}`);

        // Schedule next customer arrival
        this.spawnCustomerAtSlot(slotIdx, 2500);

        // Auto-select another available customer if this was active
        if (this.activeOrderIndex === slotIdx) {
          const nextSlot = this.slotOrders.findIndex(o => o !== null);
          if (nextSlot !== -1) {
            this.activeOrderIndex = nextSlot;
            this.refreshOrderSelection();
          }
        }
      });
    }
  }

  private refreshOrderSelection(): void {
    this.orderCards.forEach((card, idx) => {
      if (card) {
        card.setSelected(idx === this.activeOrderIndex);
      }
    });
    this.updateInstructionHUD();
  }

  /**
   * Central Cooking Station with Cast-Iron Tawa
   */
  private createCentralTawaStation(x: number, y: number): void {
    this.tawaCenter = { x, y };
    const stationContainer = this.add.container(x, y);

    // Heat glow beneath tawa
    this.tawaGlow = this.add.graphics();
    this.tawaGlow.fillStyle(THEME.colors.turmeric, 0.16);
    this.tawaGlow.fillCircle(0, 0, 175);
    stationContainer.add(this.tawaGlow);

    this.tweens.add({
      targets: this.tawaGlow,
      alpha: 0.35,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Realistic Cast-Iron Tawa Sprite (size: 350x350)
    const tawaImg = this.add.image(0, 0, 'realistic_cast_iron_tawa');
    tawaImg.setDisplaySize(350, 350);
    stationContainer.add(tawaImg);

    // Procedural Dosa Surface cooking mechanic (radius: 135)
    this.dosaSurface = new DosaSurface({
      scene: this,
      x,
      y,
      radius: 135,
      getTemperature: () => this.currentTemp,
      onStateChange: () => {
        this.updateInstructionHUD();
      },
      onSpreadComplete: () => {
        this.onDosaSpreadComplete();
      }
    });

    this.dosaSurface.setOnPlatedClick(() => {
      this.servePlatedDosaToTarget();
    });

    // Real-time Steam Particles rising from the hot iron surface
    new SteamEmitter(this, x - 15, y - 20, 150);

    // Dosa Spatula (Thiruppi)
    this.spatulaImg = this.add.image(155, 70, 'realistic_spatula');
    this.spatulaImg.setScale(0.8);
    this.spatulaImg.setRotation(0.35);
    this.spatulaImg.setInteractive({ useHandCursor: true });
    this.spatulaImg.on('pointerdown', () => {
      this.handleSpatulaClick();
    });
    stationContainer.add(this.spatulaImg);

    // Interactive Hitbox for direct touch/click on tawa surface
    const hitbox = this.add.circle(0, 0, 145, 0x000000, 0);
    hitbox.setInteractive({ useHandCursor: true });

    hitbox.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const state = this.dosaSurface.getState();
      if (state === 'POURED' || state === 'SPREADING') {
        this.dosaSurface.startSpread(pointer.worldX, pointer.worldY);
      } else if (state === 'EMPTY') {
        this.sizzleCount++;
        SoundFX.getInstance().playSizzle(1.2);

        const flash = this.add.circle(x, y, 135, THEME.colors.turmericBright, 0.3);
        this.tweens.add({
          targets: flash,
          alpha: 0,
          duration: 250,
          onComplete: () => flash.destroy()
        });

        this.currentTemp = 185 + (this.sizzleCount % 5) * 4;
      }
    });
    stationContainer.add(hitbox);

    // Temperature Badge (y: 148 inside station)
    const gaugeContainer = this.add.container(0, 148);
    const gaugeG = this.add.graphics();
    gaugeG.fillStyle(THEME.colors.teakWood, 0.94);
    gaugeG.fillRoundedRect(-190, -14, 380, 28, 7);
    gaugeG.lineStyle(1.5, THEME.colors.brass, 0.9);
    gaugeG.strokeRoundedRect(-190, -14, 380, 28, 7);
    gaugeContainer.add(gaugeG);

    this.tawaTempText = this.add.text(0, 0, `SEASONED KAL TAWA: ${this.currentTemp}°C • OPTIMAL HEAT`, {
      fontFamily: THEME.fonts.body,
      fontSize: '10.5px',
      fontStyle: 'bold',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    gaugeContainer.add(this.tawaTempText);

    stationContainer.add(gaugeContainer);

    // Cooking Action Bar: [🔄 FLIP] [🧈 +GHEE] [🌯 FOLD] [🍽️ SERVE] [🧹 RESET] (y: 180 inside station)
    const barContainer = this.add.container(0, 180);

    const makeBarBtn = (btnX: number, btnW: number, label: string, color: number, onClick: () => void) => {
      const btn = this.add.container(btnX, 0);
      const bg = this.add.graphics();
      bg.fillStyle(color, 0.95);
      bg.fillRoundedRect(-btnW / 2, -14, btnW, 28, 6);
      bg.lineStyle(1.4, THEME.colors.brassBright, 0.9);
      bg.strokeRoundedRect(-btnW / 2, -14, btnW, 28, 6);
      btn.add(bg);

      const txt = this.add.text(0, 0, label, {
        fontFamily: THEME.fonts.body,
        fontSize: '9.5px',
        fontStyle: 'bold',
        color: THEME.colors.creamHex
      }).setOrigin(0.5);
      btn.add(txt);

      btn.setSize(btnW, 32);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => {
        SoundFX.getInstance().playHover();
        this.tweens.add({ targets: btn, scaleX: 1.06, scaleY: 1.06, duration: 110, ease: 'Back.easeOut' });
      });
      btn.on('pointerout', () => {
        this.tweens.add({ targets: btn, scaleX: 1.0, scaleY: 1.0, duration: 110, ease: 'Quad.easeOut' });
      });
      btn.on('pointerdown', () => {
        SoundFX.getInstance().playClick();
        this.tweens.add({ targets: btn, scaleX: 0.92, scaleY: 0.92, duration: 70, yoyo: true });
        onClick();
      });
      return { btn, bg, txt };
    };

    barContainer.add(makeBarBtn(-148, 68, '🔄 FLIP', THEME.colors.teakWood, () => this.handleFlipAction()).btn);
    barContainer.add(makeBarBtn(-75, 72, '🧈 +GHEE', THEME.colors.turmeric, () => this.handleGheeAction()).btn);
    barContainer.add(makeBarBtn(0, 72, '🌯 FOLD', THEME.colors.terracotta, () => this.handleFoldAction()).btn);

    const serveBtnObj = makeBarBtn(78, 86, '🍽️ SERVE', THEME.colors.curryGreen, () => this.handlePlateAction());
    this.serveBarBtnContainer = serveBtnObj.btn;
    this.serveBarBtnBg = serveBtnObj.bg;
    this.serveBarBtnTxt = serveBtnObj.txt;
    barContainer.add(serveBtnObj.btn);

    barContainer.add(makeBarBtn(154, 66, '🧹 RESET', THEME.colors.teakWood, () => this.handleResetAction()).btn);

    stationContainer.add(barContainer);
  }

  /**
   * Left Station: Fermented Batter Vessel with Ladle & Sizzle Water Cup
   */
  private createLeftPrepStation(x: number, y: number): void {
    const prepContainer = this.add.container(x, y);

    const board = this.add.graphics();
    board.fillStyle(THEME.colors.teakWood, 0.9);
    board.fillRoundedRect(-95, -125, 190, 250, 14);
    board.lineStyle(2, THEME.colors.brass, 0.7);
    board.strokeRoundedRect(-95, -125, 190, 250, 14);
    prepContainer.add(board);

    const title = this.add.text(0, -108, 'BATTER STATION', {
      fontFamily: THEME.fonts.title,
      fontSize: '12.5px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    prepContainer.add(title);

    const batterBowl = this.add.image(0, -15, 'realistic_batter_bowl_vessel');
    batterBowl.setScale(0.82);
    batterBowl.setInteractive({ useHandCursor: true });
    batterBowl.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.tweens.add({ targets: batterBowl, scaleX: 0.9, scaleY: 0.9, duration: 80, yoyo: true });
    });
    prepContainer.add(batterBowl);

    const batterLabel = this.add.text(0, 44, 'AGED 12H BATTER\n(Rice & Urad Dal)', {
      fontFamily: THEME.fonts.body,
      fontSize: '9.5px',
      align: 'center',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    prepContainer.add(batterLabel);

    // Water cup for heat test
    const waterCup = this.add.image(-42, 88, 'realistic_water_cup');
    waterCup.setScale(0.72);
    waterCup.setInteractive({ useHandCursor: true });
    waterCup.on('pointerdown', () => {
      SoundFX.getInstance().playSizzle(0.7);
      this.tweens.add({ targets: waterCup, scaleX: 0.8, scaleY: 0.8, duration: 80, yoyo: true });
      const splash = this.add.circle(this.tawaCenter.x, this.tawaCenter.y, 14, THEME.colors.cream, 0.6);
      this.tweens.add({
        targets: splash,
        scaleX: 2.2,
        scaleY: 2.2,
        alpha: 0,
        duration: 280,
        onComplete: () => splash.destroy()
      });
    });
    prepContainer.add(waterCup);

    const waterLabel = this.add.text(12, 88, 'WATER CUP\n(Test heat)', {
      fontFamily: THEME.fonts.body,
      fontSize: '9px',
      color: THEME.colors.creamDarkHex
    }).setOrigin(0, 0.5);
    prepContainer.add(waterLabel);

    // Interactive Batter Ladle
    this.ladleHomePos = { x: x + 15, y: y - 25 };
    this.ladle = this.add.image(this.ladleHomePos.x, this.ladleHomePos.y, 'realistic_ladle_full');
    this.ladle.setScale(0.82);
    this.ladle.setRotation(0.25);
    this.ladle.setDepth(50);
    this.ladle.setInteractive({ useHandCursor: true, draggable: true });
    this.input.setDraggable(this.ladle);

    this.ladle.on('dragstart', () => {
      SoundFX.getInstance().playClick();
      this.tweens.add({ targets: this.ladle, scaleX: 0.92, scaleY: 0.92, duration: 80 });
      if (this.promptArrow) this.promptArrow.setVisible(false);
    });

    this.ladle.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      this.ladle.setPosition(dragX, dragY);
      const dist = Phaser.Math.Distance.Between(dragX, dragY, this.tawaCenter.x, this.tawaCenter.y);

      if (this.dosaSurface.getState() === 'EMPTY') {
        if (dist < 145) {
          this.tawaGlow?.setAlpha(0.65);
        } else {
          this.tawaGlow?.setAlpha(0.25);
        }
      } else if (this.isLadleAtTawa) {
        if (this.dosaSurface.getState() === 'POURED') {
          this.dosaSurface.startSpread(dragX, dragY);
        }
        if (this.dosaSurface.getState() === 'SPREADING') {
          this.dosaSurface.updateSpread(dragX, dragY);
        }
      }
    });

    this.ladle.on('dragend', () => {
      const dist = Phaser.Math.Distance.Between(this.ladle.x, this.ladle.y, this.tawaCenter.x, this.tawaCenter.y);
      if (this.dosaSurface.getState() === 'EMPTY') {
        if (dist < 145) {
          this.animatePourBatter();
        } else {
          this.returnLadleToBowl();
        }
      } else if (this.dosaSurface.getState() === 'SPREADING') {
        this.dosaSurface.endSpread();
      }
    });
  }

  /**
   * Right Station: Brass Ghee Pot & Toppings Rack (2 Pages: Traditional & Specialty)
   */
  private createRightToppingsStation(x: number, y: number): void {
    const rackContainer = this.add.container(x, y);

    const board = this.add.graphics();
    board.fillStyle(THEME.colors.teakWood, 0.9);
    board.fillRoundedRect(-105, -135, 210, 270, 14);
    board.lineStyle(2, THEME.colors.brass, 0.7);
    board.strokeRoundedRect(-105, -135, 210, 270, 14);
    rackContainer.add(board);

    const title = this.add.text(0, -120, 'GHEE & TOPPINGS', {
      fontFamily: THEME.fonts.title,
      fontSize: '12px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    rackContainer.add(title);

    // Page Toggle Button
    const toggleBtn = this.add.container(0, -98);
    const toggleBg = this.add.graphics();
    toggleBg.fillStyle(THEME.colors.terracotta, 0.95);
    toggleBg.fillRoundedRect(-92, -11, 184, 22, 6);
    toggleBg.lineStyle(1.2, THEME.colors.brassBright, 0.9);
    toggleBg.strokeRoundedRect(-92, -11, 184, 22, 6);
    toggleBtn.add(toggleBg);

    this.toppingsPageToggleText = this.add.text(0, 0, '◀ TRADITIONAL (1/2) ▶', {
      fontFamily: THEME.fonts.title,
      fontSize: '9px',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    toggleBtn.add(this.toppingsPageToggleText);

    toggleBtn.setSize(184, 22);
    toggleBtn.setInteractive({ useHandCursor: true });
    toggleBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.toppingsPageIndex = this.toppingsPageIndex === 0 ? 1 : 0;
      this.renderToppingsPage();
    });
    rackContainer.add(toggleBtn);

    // Inner items container
    this.toppingsItemsContainer = this.add.container(0, 0);
    rackContainer.add(this.toppingsItemsContainer);

    this.renderToppingsPage();
  }

  private renderToppingsPage(): void {
    if (!this.toppingsItemsContainer) return;
    this.toppingsItemsContainer.removeAll(true);

    if (this.toppingsPageToggleText) {
      this.toppingsPageToggleText.setText(
        this.toppingsPageIndex === 0 ? '◀ TRADITIONAL (1/2) ▶' : '◀ SPECIALTY (2/2) ▶'
      );
    }

    const makeItem = (
      y: number,
      imgKey: string,
      scale: number,
      title: string,
      subtitle: string,
      titleColor: string,
      onClick: () => void
    ) => {
      const itemContainer = this.add.container(0, y);

      const bowl = this.add.image(-42, 0, imgKey);
      bowl.setScale(scale);
      bowl.setInteractive({ useHandCursor: true });
      bowl.on('pointerdown', () => {
        onClick();
        this.tweens.add({ targets: bowl, scaleX: scale * 1.1, scaleY: scale * 1.1, duration: 80, yoyo: true });
      });
      itemContainer.add(bowl);

      const label = this.add.text(12, 0, `${title}\n(${subtitle})`, {
        fontFamily: THEME.fonts.body,
        fontSize: '9.5px',
        color: titleColor
      }).setOrigin(0, 0.5);
      label.setInteractive({ useHandCursor: true });
      label.on('pointerdown', () => {
        onClick();
        this.tweens.add({ targets: bowl, scaleX: scale * 1.1, scaleY: scale * 1.1, duration: 80, yoyo: true });
      });
      itemContainer.add(label);

      return itemContainer;
    };

    if (this.toppingsPageIndex === 0) {
      // Page 1: Traditional
      this.toppingsItemsContainer.add(
        makeItem(-62, 'realistic_ghee_cup', 0.68, 'DESI GHEE', 'Molten butter', THEME.colors.turmericBrightHex, () => {
          this.handleGheeAction();
        })
      );
      this.toppingsItemsContainer.add(
        makeItem(-10, 'realistic_potato_masala_bowl', 0.62, 'POTATO MASALA', 'Turmeric spiced', THEME.colors.creamHex, () => {
          this.handleToppingAction('potato_masala');
        })
      );
      this.toppingsItemsContainer.add(
        makeItem(42, 'realistic_podi_bowl', 0.62, 'IDLI PODI', 'Gunpowder spices', THEME.colors.terracottaBrightHex, () => {
          this.handleToppingAction('idli_podi');
        })
      );
      this.toppingsItemsContainer.add(
        makeItem(94, 'realistic_shallots_bowl', 0.58, 'SHALLOTS', '& Green chillies', THEME.colors.creamHex, () => {
          this.handleToppingAction('shallots');
        })
      );
    } else {
      // Page 2: Specialty & Fusion
      this.toppingsItemsContainer.add(
        makeItem(-62, 'realistic_mysore_paste_bowl', 0.62, 'MYSORE CHUTNEY', 'Red garlic paste', '#E74C3C', () => {
          this.handleToppingAction('mysore_paste');
        })
      );
      this.toppingsItemsContainer.add(
        makeItem(-10, 'realistic_paneer_masala_bowl', 0.62, 'CHETTINAD PANEER', 'Pepper & fennel', '#F39C12', () => {
          this.handleToppingAction('paneer_masala');
        })
      );
      this.toppingsItemsContainer.add(
        makeItem(42, 'realistic_cheese_bowl', 0.62, 'AMUL CHEESE', 'Grated & melted', '#F9E79F', () => {
          this.handleToppingAction('amul_cheese');
        })
      );
      this.toppingsItemsContainer.add(
        makeItem(94, 'realistic_coconut_bowl', 0.62, 'SWEET COCONUT', '& Cardamom pods', '#FFFFFF', () => {
          this.handleToppingAction('fresh_coconut');
        })
      );
    }
  }

  /**
   * Bottom Station: Banana Leaf Platter & Condiment Bowls
   */
  private createPlatingStation(x: number, y: number): void {
    this.plateContainer = this.add.container(x, y);

    // Glow beacon when plated dosa is ready to be served
    this.plateGlow = this.add.graphics();
    this.plateContainer.add(this.plateGlow);

    const leaf = this.add.image(0, 0, 'realistic_banana_leaf_platter');
    leaf.setDisplaySize(420, 82);
    leaf.setInteractive({ useHandCursor: true });

    this.plateContainer.add(leaf);

    const cocoChut = this.add.image(-135, -2, 'realistic_coconut_chutney_bowl');
    cocoChut.setScale(0.52);
    this.plateContainer.add(cocoChut);

    const tomChut = this.add.image(-52, -2, 'realistic_tomato_chutney_bowl');
    tomChut.setScale(0.52);
    this.plateContainer.add(tomChut);

    const samBowl = this.add.image(32, -2, 'realistic_sambar_bowl');
    samBowl.setScale(0.54);
    this.plateContainer.add(samBowl);

    new SteamEmitter(this, x + 32, y - 22, 28);

    const plateText = this.add.text(135, 0, 'PLATING STATION\nFolded Dosa Landing Spot', {
      fontFamily: THEME.fonts.body,
      fontSize: '9.5px',
      fontStyle: 'bold',
      color: THEME.colors.creamWarmHex
    }).setOrigin(0, 0.5);
    this.plateContainer.add(plateText);

    // Setup Draggable & Click Serving Mechanism
    this.setupPlatedDosaDragger(leaf);
  }

  /**
   * Setup Draggable & Click Serving Mechanism from Platter to Customer Cards
   */
  private setupPlatedDosaDragger(leaf: Phaser.GameObjects.Image): void {
    this.input.setDraggable(leaf);
    let isDraggingLeaf = false;

    leaf.on('dragstart', (pointer: Phaser.Input.Pointer) => {
      if (!this.isDosaPlated) return;
      isDraggingLeaf = true;
      SoundFX.getInstance().playClick();

      // Highlight all customer cards as drop targets
      this.orderCards.forEach(c => c?.setDropTargetHighlight(true));

      // Create floating drag proxy
      this.dragProxy = this.add.container(pointer.worldX, pointer.worldY);
      this.dragProxy.setDepth(120);

      const proxyLeaf = this.add.image(0, 0, 'realistic_banana_leaf_platter');
      proxyLeaf.setDisplaySize(180, 48);
      this.dragProxy.add(proxyLeaf);

      const proxyDosa = this.add.circle(0, 0, 18, THEME.colors.turmericGold, 0.95);
      this.dragProxy.add(proxyDosa);

      const tip = this.add.text(0, -32, '🍽️ DRAG TO SERVE CUSTOMER', {
        fontFamily: THEME.fonts.body,
        fontSize: '9px',
        fontStyle: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#1a0e07dd',
        padding: { x: 6, y: 3 }
      }).setOrigin(0.5);
      this.dragProxy.add(tip);
    });

    leaf.on('drag', (pointer: Phaser.Input.Pointer) => {
      if (this.dragProxy) {
        this.dragProxy.setPosition(pointer.worldX, pointer.worldY);
      }
    });

    leaf.on('dragend', (pointer: Phaser.Input.Pointer) => {
      this.orderCards.forEach(c => c?.setDropTargetHighlight(false));

      if (this.dragProxy) {
        this.dragProxy.destroy();
        this.dragProxy = undefined;
      }

      this.time.delayedCall(60, () => {
        isDraggingLeaf = false;
      });

      if (!this.isDosaPlated) return;

      // Check if dropped onto a customer card
      let servedSlot = -1;
      this.orderCards.forEach((card, idx) => {
        if (card && card.containsPoint(pointer.worldX, pointer.worldY)) {
          servedSlot = idx;
        }
      });

      if (servedSlot !== -1 && this.orderCards[servedSlot] && this.slotOrders[servedSlot]) {
        this.handleServeToCustomer(this.orderCards[servedSlot]!, this.slotOrders[servedSlot]!, servedSlot);
      }
    });

    // Clicking leaf: plates if unplated, serves if plated!
    leaf.on('pointerup', () => {
      if (isDraggingLeaf) return;
      if (!this.isDosaPlated) {
        this.handlePlateAction();
      } else {
        this.servePlatedDosaToTarget();
      }
    });
  }

  /**
   * Bottom Navigation Controls
   */
  private createBottomControls(width: number, height: number): void {
    // 1. Finish Service / Review Shift Button (Left)
    new CozyButton(this, {
      x: 120,
      y: height - 24,
      text: 'Finish Service',
      subText: `Complete Day ${this.currentDay} ★`,
      width: 180,
      onClick: () => {
        this.showLevelCompletion();
      }
    });

    // 2. Center Workflow Guide Subtitle
    const hintText = this.add.text(
      width / 2,
      height - 24,
      '👨‍🍳 Kitchen Flow: Accept Order ➔ Swirl Batter ➔ Ghee & Toppings ➔ Fold ➔ Plate ➔ Drag to Customer',
      {
        fontFamily: THEME.fonts.body,
        fontSize: '10.5px',
        color: THEME.colors.creamDarkHex
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: hintText,
      alpha: 0.65,
      duration: 2400,
      yoyo: true,
      repeat: -1
    });

    // 3. Quick Recipe Guide Button (Right)
    new CozyButton(this, {
      x: width - 120,
      y: height - 24,
      text: 'Recipe Guide',
      subText: 'Check Authentic Dosas',
      width: 180,
      onClick: () => {
        this.openRecipeBook();
      }
    });
  }

  /**
   * Guidance banner showing clear next steps for the player
   */
  private createInstructionHUD(): void {
    const guideContainer = this.add.container(640, 198);
    guideContainer.setDepth(35);

    const guideBg = this.add.graphics();
    guideBg.fillStyle(THEME.colors.teakWood, 0.94);
    guideBg.fillRoundedRect(-240, -13, 480, 26, 7);
    guideBg.lineStyle(1.5, THEME.colors.turmeric, 0.85);
    guideBg.strokeRoundedRect(-240, -13, 480, 26, 7);
    guideContainer.add(guideBg);

    this.guidanceText = this.add.text(0, 0, '👉 STEP 1: DRAG LADLE FROM BOWL ONTO HOT TAWA', {
      fontFamily: THEME.fonts.title,
      fontSize: '11px',
      fontStyle: 'bold',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    guideContainer.add(this.guidanceText);

    this.tweens.add({
      targets: this.guidanceText,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createPromptArrow(): void {
    this.promptArrow = this.add.text(225, 360, '👉', { fontSize: '24px' }).setOrigin(0.5);
    this.promptArrow.setDepth(45);
    this.tweens.add({
      targets: this.promptArrow,
      x: 245,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private getActiveOrder(): CustomerOrder | null {
    return this.slotOrders[this.activeOrderIndex] || this.slotOrders.find(o => o !== null) || null;
  }

  private getActiveRecipe(): Recipe {
    const order = this.getActiveOrder();
    if (order) {
      const rec = RECIPES.find(r => r.id === order.recipeId);
      if (rec) return rec;
    }
    if (this.recipeOverride) {
      return this.recipeOverride;
    }
    return RECIPES[0];
  }

  private animatePourBatter(): void {
    this.isLadleAtTawa = true;
    this.tweens.add({
      targets: this.ladle,
      x: this.tawaCenter.x - 8,
      y: this.tawaCenter.y - 35,
      angle: -26,
      duration: 180,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.dosaSurface.pourBatter(this.tawaCenter.x, this.tawaCenter.y);
        this.ladle.setTexture('realistic_ladle_empty');

        this.tweens.add({
          targets: this.ladle,
          x: this.tawaCenter.x,
          y: this.tawaCenter.y - 12,
          angle: 14,
          duration: 160,
          ease: 'Sine.easeOut'
        });
      }
    });
  }

  private onDosaSpreadComplete(): void {
    this.isLadleAtTawa = false;
    this.returnLadleToBowl();
  }

  private returnLadleToBowl(onComplete?: () => void): void {
    this.isLadleAtTawa = false;
    this.tweens.add({
      targets: this.ladle,
      x: this.ladleHomePos.x,
      y: this.ladleHomePos.y,
      scaleX: 0.82,
      scaleY: 0.82,
      angle: 14,
      duration: 380,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.ladle.setTexture('realistic_ladle_full');
        onComplete?.();
      }
    });
  }

  private setupSwirlInputListeners(): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const dist = Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, this.tawaCenter.x, this.tawaCenter.y);
      if (dist < 155) {
        const state = this.dosaSurface.getState();
        if (state === 'POURED' || state === 'SPREADING') {
          this.dosaSurface.startSpread(pointer.worldX, pointer.worldY);
        }
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && this.dosaSurface.getState() === 'SPREADING') {
        this.dosaSurface.updateSpread(pointer.worldX, pointer.worldY);
        if (this.isLadleAtTawa) {
          this.ladle.setPosition(pointer.worldX, pointer.worldY - 15);
          this.ladle.setRotation(0.22);
        }
      }
    });

    this.input.on('pointerup', () => {
      if (this.dosaSurface.getState() === 'SPREADING') {
        this.dosaSurface.endSpread();
      }
    });
  }

  private handleGheeAction(): void {
    const state = this.dosaSurface.getState();
    if (state === 'COOKING' || state === 'PERFECT_ROAST') {
      SoundFX.getInstance().playToppingSprinkle('liquid');
      this.dosaSurface.addGhee();
      this.updateInstructionHUD();
    } else {
      SoundFX.getInstance().playClick();
      this.spawnStationTip('Spread batter first before drizzling ghee!');
    }
  }

  private handleToppingAction(toppingId: string): void {
    const state = this.dosaSurface.getState();
    if (state === 'COOKING' || state === 'PERFECT_ROAST') {
      let category: 'powder' | 'paste' | 'chunk' | 'liquid' = 'chunk';
      if (toppingId === 'idli_podi' || toppingId === 'fresh_coconut' || toppingId === 'cumin_pepper') {
        category = 'powder';
      } else if (toppingId === 'mysore_paste') {
        category = 'paste';
      }
      SoundFX.getInstance().playToppingSprinkle(category);
      this.dosaSurface.addTopping(toppingId);
      this.updateInstructionHUD();
    } else {
      SoundFX.getInstance().playClick();
      this.spawnStationTip('Cook batter on tawa before adding fillings!');
    }
  }

  private handleFlipAction(): void {
    const state = this.dosaSurface.getState();
    if (state === 'COOKING' || state === 'PERFECT_ROAST') {
      this.dosaSurface.flipDosa();
      if (this.spatulaImg) {
        this.tweens.add({ targets: this.spatulaImg, rotation: 0.05, duration: 150, yoyo: true });
      }
      this.updateInstructionHUD();
    } else {
      SoundFX.getInstance().playClick();
      this.spawnStationTip('Dosa must be cooking before flipping!');
    }
  }

  private handleFoldAction(): void {
    const state = this.dosaSurface.getState();
    if (state === 'COOKING' || state === 'PERFECT_ROAST') {
      const recipe = this.getActiveRecipe();
      this.dosaSurface.foldDosa(recipe.foldType);
      if (this.spatulaImg) {
        this.tweens.add({ targets: this.spatulaImg, x: 135, y: 45, rotation: 0.1, duration: 160, yoyo: true });
      }
      this.updateInstructionHUD();
    } else if (state === 'FOLDED') {
      this.handlePlateAction();
    } else {
      SoundFX.getInstance().playClick();
      this.spawnStationTip('Wait for golden roast before folding!');
    }
  }

  private handlePlateAction(): void {
    if (this.isDosaPlated) {
      this.servePlatedDosaToTarget();
      return;
    }

    const state = this.dosaSurface.getState();
    if (state === 'FOLDED' || state === 'PERFECT_ROAST' || state === 'COOKING') {
      const targetX = 640;
      const targetY = 645;

      this.dosaSurface.plateDosa(targetX, targetY, () => {
        this.isDosaPlated = true;
        this.highlightPlatedDosa();
        this.updateServeButton();
        this.orderCards.forEach(c => c?.setReadyToServe(true));
        this.updateInstructionHUD();
      });

      if (this.spatulaImg) {
        this.tweens.add({ targets: this.spatulaImg, x: 165, y: 80, duration: 250 });
      }
    } else {
      SoundFX.getInstance().playClick();
      this.spawnStationTip('Fold dosa before plating!');
    }
  }

  private servePlatedDosaToTarget(): void {
    if (!this.isDosaPlated) return;

    let targetSlot = this.activeOrderIndex;
    let card = this.orderCards[targetSlot];
    let order = this.slotOrders[targetSlot];

    if (!card || !order) {
      const availableSlot = this.orderCards.findIndex((c, idx) => c !== null && this.slotOrders[idx] !== null);
      if (availableSlot !== -1) {
        targetSlot = availableSlot;
        card = this.orderCards[availableSlot];
        order = this.slotOrders[availableSlot];
      }
    }

    if (card && order) {
      this.handleServeToCustomer(card, order, targetSlot);
    } else {
      SoundFX.getInstance().playClick();
      this.spawnStationTip('No waiting customer to serve!');
    }
  }

  private updateServeButton(): void {
    if (!this.serveBarBtnTxt || !this.serveBarBtnBg) return;

    if (this.isDosaPlated) {
      this.serveBarBtnTxt.setText('🚀 SERVE DINER');
      this.serveBarBtnTxt.setColor('#FFFDF5');
      this.serveBarBtnBg.clear();
      this.serveBarBtnBg.fillStyle(THEME.colors.bananaLeafGreen, 0.98);
      this.serveBarBtnBg.fillRoundedRect(-43, -14, 86, 28, 6);
      this.serveBarBtnBg.lineStyle(1.6, THEME.colors.turmericGold, 1.0);
      this.serveBarBtnBg.strokeRoundedRect(-43, -14, 86, 28, 6);

      if (this.serveBarBtnContainer && !this.tweens.isTweening(this.serveBarBtnContainer)) {
        this.tweens.add({
          targets: this.serveBarBtnContainer,
          scaleX: 1.06,
          scaleY: 1.06,
          duration: 450,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    } else {
      if (this.serveBarBtnContainer) {
        this.tweens.killTweensOf(this.serveBarBtnContainer);
        this.serveBarBtnContainer.setScale(1.0);
      }
      this.serveBarBtnTxt.setText('🍽️ SERVE');
      this.serveBarBtnTxt.setColor(THEME.colors.creamHex);
      this.serveBarBtnBg.clear();
      this.serveBarBtnBg.fillStyle(THEME.colors.curryGreen, 0.95);
      this.serveBarBtnBg.fillRoundedRect(-43, -14, 86, 28, 6);
      this.serveBarBtnBg.lineStyle(1.4, THEME.colors.brassBright, 0.9);
      this.serveBarBtnBg.strokeRoundedRect(-43, -14, 86, 28, 6);
    }
  }

  private highlightPlatedDosa(): void {
    if (!this.plateGlow) return;
    this.plateGlow.clear();
    this.plateGlow.lineStyle(3, THEME.colors.turmericGold, 0.9);
    this.plateGlow.strokeRoundedRect(-215, -44, 430, 88, 12);
  }

  private clearPlatedDosaHighlight(): void {
    if (this.plateGlow) {
      this.plateGlow.clear();
    }
    this.isDosaPlated = false;
    this.updateServeButton();
    this.orderCards.forEach(c => c?.setReadyToServe(false));
  }

  /**
   * Serve Plated Dosa to a Customer (Drag or Click)
   */
  private handleServeToCustomer(card: CustomerOrderCard, order: CustomerOrder, slotIdx: number): void {
    if (!this.isDosaPlated) {
      this.spawnStationTip('Prepare and plate a dosa first!');
      return;
    }

    // Immediately clear plated flags so repeated clicks don't double trigger
    this.clearPlatedDosaHighlight();
    this.updateInstructionHUD();

    const upgradeService = UpgradeService.getInstance();
    const targetRecipe = RECIPES.find(r => r.id === order.recipeId) || RECIPES[0];
    const quality: DosaCookingQuality = this.dosaSurface.calculateQuality(targetRecipe);

    // Check accuracy & match
    const appliedToppings = this.dosaSurface.getAppliedToppings();
    let isSevereMismatch = false;

    if (order.recipeId === 'plain_roast' && appliedToppings.size > 0) {
      isSevereMismatch = true;
    } else if (order.recipeId === 'masala_dosa' && !appliedToppings.has('potato_masala')) {
      isSevereMismatch = true;
    } else if (order.recipeId === 'ghee_podi_dosa' && !appliedToppings.has('idli_podi')) {
      isSevereMismatch = true;
    } else if (order.recipeId === 'onion_uthappam' && !appliedToppings.has('shallots')) {
      isSevereMismatch = true;
    }

    const isCorrect = quality.overallScore >= 60 && !isSevereMismatch;

    // Combo streak calculation
    let comboBonus = 0;
    if (isCorrect) {
      const now = Date.now();
      if (now - this.lastServeTime <= this.comboWindowMs) {
        this.comboCount++;
      } else {
        this.comboCount = 1;
      }
      this.lastServeTime = now;

      if (this.comboCount >= 2) {
        comboBonus = Math.min(80, this.comboCount * 15);
        SoundFX.getInstance().playCombo(this.comboCount);
        this.showComboCelebration(this.comboCount, comboBonus);
      }
    } else {
      this.comboCount = 0;
    }

    // Calculate speed tip based on remaining patience
    const patienceRatio = order.patienceRemainingSec / order.timeLimitSec;
    let speedTip = 0;
    if (patienceRatio >= 0.5) {
      speedTip = Math.round(15 + patienceRatio * 35);
    } else if (patienceRatio >= 0.25) {
      speedTip = 10;
    }

    // Apply Desi Ghee Jar tip multiplier upgrade
    const tipMult = upgradeService.getTipBonusMultiplier();
    speedTip = Math.round(speedTip * tipMult);

    let totalEarned = isCorrect ? quality.earnedCoins + speedTip + comboBonus : Math.round(quality.earnedCoins * 0.4);
    totalEarned = Math.max(10, totalEarned);

    // Award coins to Register
    upgradeService.addCoins(totalEarned);
    if (this.cashText) {
      this.cashText.setText(`💰 CASH: ₹ ${upgradeService.getCoins()}`);
      this.tweens.add({ targets: this.cashText, scaleX: 1.15, scaleY: 1.15, duration: 120, yoyo: true });
    }

    // Update Level Progression Statistics
    this.levelCustomersServed++;
    this.levelScoreTotal += quality.overallScore;
    this.levelEarningsTotal += totalEarned;
    if (quality.overallScore >= 85) {
      this.perfectDosasCount++;
    }

    // Update HUD Goals
    if (this.dinersGoalText) {
      this.dinersGoalText.setText(`👥 DINERS: ${this.levelCustomersServed}/${this.levelDef.requiredCustomers}`);
      if (this.levelCustomersServed >= this.levelDef.requiredCustomers) {
        this.dinersGoalText.setColor(THEME.colors.curryGreenHex);
      }
    }
    if (this.scoreGoalText) {
      this.scoreGoalText.setText(`🎯 SCORE: ${this.levelScoreTotal}/${this.levelDef.targetScore}`);
      if (this.levelScoreTotal >= this.levelDef.targetScore) {
        this.scoreGoalText.setColor(THEME.colors.curryGreenHex);
      }
    }

    const isShiftComplete = this.levelCustomersServed >= this.levelDef.requiredCustomers;

    // FLY THE DOSA VISUALLY OFF THE BANANA LEAF TO THE CUSTOMER TICKET!
    const dosaCont = this.dosaSurface.getContainer();
    SoundFX.getInstance().playSpatulaScrape();

    this.tweens.add({
      targets: dosaCont,
      x: card.x,
      y: card.y,
      scaleX: 0.32,
      scaleY: 0.32,
      rotation: 0.15,
      alpha: 0,
      duration: 380,
      ease: 'Back.easeIn',
      onComplete: () => {
        // Clear the cooking surface and plate completely!
        this.dosaSurface.reset();

        // Customer Reaction Speech & Audio
        if (isCorrect) {
          SoundFX.getInstance().playCustomerDelight();
          SoundFX.getInstance().playCoinShower();
          card.showSpeechBubble(this.getDelightQuote(order), true);
          this.spawnConfettiBurst(card.x, card.y + 40, quality.stars === 3 || this.comboCount >= 3 ? 32 : 18);
        } else {
          SoundFX.getInstance().playCustomerDisappoint();
          card.showSpeechBubble(this.getDisappointQuote(order, quality), false);
        }

        // Brief delay for dramatic delivery before modal review pops up
        this.time.delayedCall(300, () => {
          new QualityReviewModal(this, {
            recipe: targetRecipe,
            customerOrder: order,
            quality: {
              ...quality,
              earnedCoins: totalEarned
            },
            onCookNext: () => {
              // Customer exits happily
              card.exitAnimation(isCorrect ? 'served' : 'timeout', () => {
                this.orderCards[slotIdx] = null;
                this.slotOrders[slotIdx] = null;

                if (!isShiftComplete) {
                  // Spawn next customer into this vacant slot
                  this.spawnCustomerAtSlot(slotIdx, 2000);
                }
              });

              // Reset cooking surface
              this.handleResetAction();

              if (isShiftComplete) {
                // Trigger Level Complete Screen!
                this.time.delayedCall(600, () => {
                  this.showLevelCompletion();
                });
              } else {
                // Auto-select another active customer
                const nextIdx = this.slotOrders.findIndex((o, i) => o !== null && i !== slotIdx);
                if (nextIdx !== -1) {
                  this.activeOrderIndex = nextIdx;
                  this.refreshOrderSelection();
                }
              }
            },
            onViewRecipeBook: () => {
              this.openRecipeBook();
            }
          });
        });
      }
    });
  }

  private getDelightQuote(order: CustomerOrder): string {
    switch (order.customerName) {
      case 'Uncle Venkatesh':
      case 'VIP Uncle Venkatesh':
        return 'Wah! Authentic crispy masala dosa! Just like Mylapore! ⭐';
      case 'Priya':
      case 'VIP Priya':
        return 'So light, paper-thin and aromatic! Pure desi cow ghee! ✨';
      case 'Karthik':
      case 'VIP Karthik':
        return 'Explosive gunpowder podi! Exactly the fiery kick I needed! 🔥';
      case 'Auntie Meenakshi':
      case 'VIP Auntie Meenakshi':
        return 'Perfect caramelized shallots! Reminds me of home cooking! 👵';
      default:
        return 'Mouthwatering! Perfectly golden and piping hot! 🌟';
    }
  }

  private getDisappointQuote(order: CustomerOrder, quality: DosaCookingQuality): string {
    if (quality.crispinessScore < 50) {
      return 'This dosa is not roasted enough! 😕';
    }
    if (order.recipeId === 'masala_dosa') {
      return 'Wait! Where is my spiced potato curry?! 😟';
    }
    if (order.recipeId === 'plain_roast') {
      return 'I ordered a Plain Roast, why are there toppings on this?! 😣';
    }
    if (order.recipeId === 'ghee_podi_dosa') {
      return 'There is barely any gunpowder podi on this! 🌶️';
    }
    return "This doesn't match what I ordered! 😞";
  }

  private handleResetAction(): void {
    SoundFX.getInstance().playSizzle(0.8);
    this.dosaSurface.reset();
    this.returnLadleToBowl();
    this.clearPlatedDosaHighlight();
    if (this.promptArrow) this.promptArrow.setVisible(true);
    this.updateInstructionHUD();
  }

  private handleSpatulaClick(): void {
    const state = this.dosaSurface.getState();
    if (state === 'FOLDED') {
      this.handlePlateAction();
    } else if (state === 'PERFECT_ROAST' || (state === 'COOKING' && this.dosaSurface.getCookingProgress() >= 0.70)) {
      this.handleFoldAction();
    } else if (state === 'COOKING') {
      this.handleFlipAction();
    } else {
      SoundFX.getInstance().playClick();
      if (this.spatulaImg) {
        this.tweens.add({ targets: this.spatulaImg, rotation: 0.15, yoyo: true, duration: 120 });
      }
    }
  }

  private spawnStationTip(msg: string): void {
    const tip = this.add.text(640, 290, msg, {
      fontFamily: THEME.fonts.body,
      fontSize: '11.5px',
      fontStyle: 'bold',
      color: THEME.colors.turmericBrightHex,
      backgroundColor: '#1a0e07dd',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5);
    tip.setDepth(80);

    this.tweens.add({
      targets: tip,
      y: 265,
      alpha: 0,
      duration: 1500,
      ease: 'Cubic.easeOut',
      onComplete: () => tip.destroy()
    });
  }

  /**
   * Floating combo streak badge with flame animation
   */
  private showComboCelebration(comboCount: number, bonusCoins: number): void {
    const { width } = THEME.dimensions;
    const bannerContainer = this.add.container(width / 2, 220);
    bannerContainer.setDepth(90);

    const title = comboCount >= 4 ? `💥 TASTE SENSATION x${comboCount}!` : `🔥 COMBO x${comboCount}!`;
    const msg = `${title} +₹${bonusCoins} TIP BONUS`;

    const bg = this.add.graphics();
    bg.fillStyle(THEME.colors.teakWood, 0.95);
    bg.fillRoundedRect(-180, -18, 360, 36, 18);
    bg.lineStyle(2.5, THEME.colors.turmericBright, 1);
    bg.strokeRoundedRect(-180, -18, 360, 36, 18);
    bannerContainer.add(bg);

    const txt = this.add.text(0, 0, msg, {
      fontFamily: THEME.fonts.title,
      fontSize: '14px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    bannerContainer.add(txt);

    bannerContainer.setScale(0.5);
    bannerContainer.setAlpha(0);

    this.tweens.add({
      targets: bannerContainer,
      scaleX: 1.1,
      scaleY: 1.1,
      alpha: 1,
      duration: 180,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: bannerContainer,
          scaleX: 1.0,
          scaleY: 1.0,
          duration: 100,
          onComplete: () => {
            this.time.delayedCall(1200, () => {
              this.tweens.add({
                targets: bannerContainer,
                y: 190,
                alpha: 0,
                duration: 250,
                ease: 'Quad.easeIn',
                onComplete: () => bannerContainer.destroy()
              });
            });
          }
        });
      }
    });
  }

  /**
   * Celebratory confetti particle explosion
   */
  private spawnConfettiBurst(centerX: number, centerY: number, count: number = 32): void {
    const colors = [
      THEME.colors.turmericBright,
      THEME.colors.turmeric,
      THEME.colors.bananaLeafGreen,
      THEME.colors.curryGreen,
      THEME.colors.terracotta,
      0xFFFDF5,
      0xE67E22
    ];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = 120 + Math.random() * 220;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 60;
      const col = colors[i % colors.length];

      const isCircle = i % 2 === 0;
      let particle: Phaser.GameObjects.Shape;
      if (isCircle) {
        particle = this.add.circle(centerX, centerY, 3 + Math.random() * 3, col);
      } else {
        particle = this.add.rectangle(centerX, centerY, 6 + Math.random() * 4, 4 + Math.random() * 3, col);
      }
      particle.setDepth(95);

      const targetX = centerX + vx * 0.7;
      const targetY = centerY + vy * 0.7 + 50;

      this.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        rotation: (Math.random() - 0.5) * 8,
        alpha: 0,
        scaleX: 0.3,
        scaleY: 0.3,
        duration: 650 + Math.random() * 300,
        ease: 'Cubic.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  private openRecipeBook(): void {
    if (this.isModalOpen) return;
    this.isModalOpen = true;
    new RecipeBookModal(
      this,
      () => {
        this.isModalOpen = false;
      },
      (recipeToCook: Recipe) => {
        this.isModalOpen = false;
        this.setCookingTargetRecipe(recipeToCook);
      }
    );
  }

  private setCookingTargetRecipe(recipe: Recipe): void {
    this.recipeOverride = recipe;
    SoundFX.getInstance().playSuccessChime();
    this.spawnStationTip(`👨‍🍳 PRACTICE RECIPE: ${recipe.name.toUpperCase()}`);
    this.updateInstructionHUD();
  }

  private openUpgrades(): void {
    if (this.isModalOpen) return;
    this.isModalOpen = true;
    new UpgradesModal(this, () => {
      this.isModalOpen = false;
      if (this.cashText) {
        this.cashText.setText(`💰 CASH: ₹ ${UpgradeService.getInstance().getCoins()}`);
      }
    });
  }

  private openLevelSelect(): void {
    if (this.isModalOpen) return;
    this.isModalOpen = true;
    new LevelSelectModal(
      this,
      (selectedDay: number) => {
        this.isModalOpen = false;
        UpgradeService.getInstance().setCurrentDay(selectedDay);
        this.scene.restart();
      },
      () => {
        this.isModalOpen = false;
      }
    );
  }

  private openSettings(): void {
    if (this.isModalOpen) return;
    this.isModalOpen = true;
    new SettingsModal(this, () => {
      this.isModalOpen = false;
    });
  }

  /**
   * Level completion celebration screen with stars, coins, and next level unlocking
   */
  private showLevelCompletion(): void {
    if (this.isModalOpen) return;
    this.isModalOpen = true;

    const { width, height } = THEME.dimensions;
    this.spawnConfettiBurst(width / 2, height / 2 - 60, 50);
    this.spawnConfettiBurst(width / 3, height / 2, 35);
    this.spawnConfettiBurst((2 * width) / 3, height / 2, 35);

    const upgradeService = UpgradeService.getInstance();
    const servedCount = Math.max(1, this.levelCustomersServed);
    const avgScore = servedCount > 0 ? Math.round(this.levelScoreTotal / servedCount) : 75;

    // Calculate earned stars based on performance against level targets
    let starsEarned = 1;
    if (
      this.levelScoreTotal >= this.levelDef.targetScore &&
      this.perfectDosasCount >= Math.floor(this.levelDef.requiredCustomers * 0.7)
    ) {
      starsEarned = 3;
    } else if (this.levelScoreTotal >= Math.round(this.levelDef.targetScore * 0.75)) {
      starsEarned = 2;
    }

    // Complete Level in UpgradeService (persists progress & unlocks next Day)
    const newlyUnlockedRecipes = upgradeService.completeLevel(
      this.currentDay,
      starsEarned,
      this.levelScoreTotal,
      this.levelEarningsTotal
    );

    const result: LevelResult = {
      day: this.currentDay,
      serviceTitle: this.levelDef.serviceTitle,
      starsEarned,
      customersServed: this.levelCustomersServed,
      totalCustomers: this.levelDef.requiredCustomers,
      perfectDosas: this.perfectDosasCount,
      crispinessScorePercent: Math.min(100, avgScore),
      baseEarnings: Math.round(this.levelEarningsTotal * 0.75),
      tipsEarned: Math.round(this.levelEarningsTotal * 0.25),
      totalCoins: upgradeService.getCoins(),
      overallScore: this.levelScoreTotal,
      newlyUnlockedRecipes
    };

    new LevelCompleteModal(this, {
      result,
      onNextLevel: () => {
        this.isModalOpen = false;
        const allLevels = upgradeService.getAllLevels();
        if (this.currentDay < allLevels.length) {
          upgradeService.setCurrentDay(this.currentDay + 1);
        }
        this.scene.restart();
      },
      onUpgrades: () => {
        this.isModalOpen = false;
        this.openUpgrades();
      },
      onMenu: () => {
        this.isModalOpen = false;
        this.cameras.main.fadeOut(300, 26, 14, 7);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('MainMenuScene');
        });
      }
    });
  }

  /**
   * Update instructional guidance text and tawa gauge in real time
   */
  private updateInstructionHUD(): void {
    if (!this.guidanceText || !this.dosaSurface) return;

    const state = this.dosaSurface.getState();
    const progress = this.dosaSurface.getSpreadProgress();
    const cookPct = Math.round(this.dosaSurface.getCookingProgress() * 100);
    const order = this.getActiveOrder();
    const recipe = this.getActiveRecipe();
    const targetFold = recipe.foldType.replace('_', ' ').toUpperCase();
    const customerTag = order ? `${order.customerName.toUpperCase()} (T-${order.tableNumber})` : 'WALK-IN';

    if (this.isDosaPlated) {
      this.guidanceText.setText(`👉 CLICK "SERVE DINER" OR TICKET TO DELIVER TO ${customerTag}!`);
      this.guidanceText.setColor(THEME.colors.bananaLeafGreenHex);
      if (this.tawaTempText) {
        this.tawaTempText.setText(`SEASONED KAL TAWA: ${this.currentTemp}°C • DOSA READY ON BANANA LEAF`);
        this.tawaTempText.setColor(THEME.colors.bananaLeafGreenHex);
      }
      return;
    }

    switch (state) {
      case 'EMPTY':
        this.guidanceText.setText(`👉 STEP 1: DRAG LADLE ONTO TAWA (FOR: ${customerTag} • ${recipe.name.toUpperCase()})`);
        this.guidanceText.setColor(THEME.colors.creamHex);
        if (this.tawaTempText) {
          this.tawaTempText.setText(`TAWA: ${this.currentTemp}°C • OPTIMAL HEAT • TARGET: ${recipe.name.toUpperCase()}`);
          this.tawaTempText.setColor(THEME.colors.creamHex);
        }
        break;

      case 'POURED':
        this.guidanceText.setText('🌀 STEP 2: SWIRL IN EXPANDING CIRCLES TO SPREAD DOSA');
        this.guidanceText.setColor(THEME.colors.turmericBrightHex);
        if (this.tawaTempText) {
          this.tawaTempText.setText(`TAWA: ${this.currentTemp}°C • WET BATTER POURED (SWIRL SPIRAL OUTWARD)`);
          this.tawaTempText.setColor(THEME.colors.turmericBrightHex);
        }
        break;

      case 'SPREADING':
        this.guidanceText.setText(`🌀 SPREADING: ${Math.round(progress * 100)}% • SWIRL OUTWARD TO EDGES!`);
        this.guidanceText.setColor(THEME.colors.turmericGoldHex);
        if (this.tawaTempText) {
          this.tawaTempText.setText(`TAWA: ${this.currentTemp}°C • SPREADING IN PROGRESS (${Math.round(progress * 100)}%)`);
          this.tawaTempText.setColor(THEME.colors.turmericGoldHex);
        }
        break;

      case 'COOKING': {
        const hasGhee = this.dosaSurface.getHasGhee();
        const toppings = this.dosaSurface.getAppliedToppings();
        const gheeStatus = hasGhee ? '🧈 GHEE ✓' : '🧈 ADD GHEE';
        const toppingStatus = toppings.size > 0 ? `• FILLINGS: ${toppings.size} ADDED` : '• ADD FILLINGS FROM RIGHT RACK';

        if (cookPct < 40) {
          this.guidanceText.setText(`🔥 ROASTING: ${cookPct}% • ${gheeStatus} ${toppingStatus}`);
          this.guidanceText.setColor(THEME.colors.creamHex);
        } else if (cookPct < 75) {
          this.guidanceText.setText(`🔥 CRISPING: ${cookPct}% • ${gheeStatus} ${toppingStatus} • [🔄 FLIP] OR SPATULA`);
          this.guidanceText.setColor(THEME.colors.turmericBrightHex);
        } else {
          this.guidanceText.setText(`✨ GOLDEN CRISP (${cookPct}%) • READY TO FOLD INTO ${targetFold}!`);
          this.guidanceText.setColor(THEME.colors.turmericGoldHex);
        }
        if (this.tawaTempText) {
          this.tawaTempText.setText(`TAWA: ${this.currentTemp}°C • ${this.dosaSurface.getStageDescription()} • FOLD: ${targetFold}`);
          this.tawaTempText.setColor(THEME.colors.turmericBrightHex);
        }
        break;
      }

      case 'PERFECT_ROAST':
        this.guidanceText.setText(`🌟 PERFECT GOLDEN ROAST! CLICK [🌯 FOLD] OR SPATULA TO FOLD (${targetFold})`);
        this.guidanceText.setColor('#FFEAA7');
        if (this.tawaTempText) {
          this.tawaTempText.setText(`SEASONED KAL TAWA: ${this.currentTemp}°C • ★ PERFECT GOLDEN ROAST ★`);
          this.tawaTempText.setColor('#FFEAA7');
        }
        break;

      case 'FOLDED':
        this.guidanceText.setText(`🍽️ STEP 5: CLICK [🍽️ SERVE] OR BANANA LEAF PLATTER TO PLATE!`);
        this.guidanceText.setColor(THEME.colors.bananaLeafGreenHex);
        if (this.tawaTempText) {
          this.tawaTempText.setText(`SEASONED KAL TAWA: ${this.currentTemp}°C • DOSA FOLDED (${targetFold}) • READY TO PLATE`);
          this.tawaTempText.setColor(THEME.colors.bananaLeafGreenHex);
        }
        break;

      case 'BURNT':
        this.guidanceText.setText('⚠️ OVERDONE! PRESS [🧹 RESET] TO TRY NEXT DOSA');
        this.guidanceText.setColor('#FF7675');
        if (this.tawaTempText) {
          this.tawaTempText.setText(`SEASONED KAL TAWA: ${this.currentTemp}°C • OVER-ROASTED / CRISPY BROWN`);
          this.tawaTempText.setColor('#FF7675');
        }
        break;
    }
  }

  override update(time: number, delta: number): void {
    if (this.dosaSurface) {
      this.dosaSurface.update(time, delta);
    }
    this.updateInstructionHUD();
  }
}
