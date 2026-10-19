import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { CozyButton } from '../ui/CozyButton';
import { SteamEmitter } from '../ui/SteamParticles';
import { RecipeBookModal } from '../ui/RecipeBookModal';
import { UpgradesModal } from '../ui/UpgradesModal';
import { LevelCompleteModal } from '../ui/LevelCompleteModal';
import { CustomerOrderCard } from '../ui/CustomerOrderCard';
import { UpgradeService } from '../services/UpgradeService';
import { CustomerOrder, LevelResult } from '../types/recipe';

export class GameScene extends Phaser.Scene {
  private tawaTempText?: Phaser.GameObjects.Text;
  private tawaGlow?: Phaser.GameObjects.Graphics;
  private cashText?: Phaser.GameObjects.Text;
  private sizzleCount: number = 0;
  private currentTemp: number = 185;
  private activeOrderIndex: number = 0;
  private orderCards: CustomerOrderCard[] = [];
  private isModalOpen: boolean = false;
  private currentDay: number = 1;

  private orders: CustomerOrder[] = [
    {
      id: 'ord_1',
      customerName: 'Uncle Venkatesh',
      customerTitle: 'Regular Foodie',
      avatarKey: 'avatar_venkatesh',
      tableNumber: 3,
      recipeId: 'masala_dosa',
      recipeName: 'Masala Dosa',
      dishImageKey: 'photo_masala_dosa',
      crispinessPreference: 'extra_crispy',
      extraGhee: true,
      specialNote: 'Extra golden crisp, double potato curry filling!',
      timeLimitSec: 65,
      patienceRemainingSec: 60,
      rewardCoins: 120,
      mood: 'happy'
    },
    {
      id: 'ord_2',
      customerName: 'Priya',
      customerTitle: 'Morning Regular',
      avatarKey: 'avatar_priya',
      tableNumber: 1,
      recipeId: 'plain_roast',
      recipeName: 'Plain Ghee Roast',
      dishImageKey: 'photo_plain_roast',
      crispinessPreference: 'extra_crispy',
      extraGhee: true,
      specialNote: 'Paper-thin cylindrical flute, extra coconut chutney',
      timeLimitSec: 50,
      patienceRemainingSec: 46,
      rewardCoins: 95,
      mood: 'happy'
    },
    {
      id: 'ord_3',
      customerName: 'Karthik',
      customerTitle: 'Spice Connoisseur',
      avatarKey: 'avatar_karthik',
      tableNumber: 5,
      recipeId: 'ghee_podi_dosa',
      recipeName: 'Ghee Podi Roast',
      dishImageKey: 'photo_ghee_podi',
      crispinessPreference: 'medium',
      extraGhee: true,
      specialNote: 'Heavy gunpowder dust seared in bubbling desi ghee',
      timeLimitSec: 55,
      patienceRemainingSec: 52,
      rewardCoins: 140,
      mood: 'happy'
    }
  ];

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    const { width, height } = THEME.dimensions;
    const sound = SoundFX.getInstance();

    this.cameras.main.fadeIn(350, 26, 14, 7);

    // 1. Kitchen Station Illustrated Backdrop
    const bg = this.add.image(width / 2, height / 2, 'kitchen_station');
    bg.setDisplaySize(width, height);
    bg.setAlpha(0.72);

    // Warm Vignette Overlay
    const vignette = this.add.image(width / 2, height / 2, 'fx_vignette');
    vignette.setDisplaySize(width, height);
    vignette.setAlpha(0.7);

    // 2. Top Kitchen Status HUD
    this.createKitchenHUD(width);

    // 3. Customer Order Ticket Rail (Top)
    this.createOrderTicketRail(width);

    // 4. Central Cooking Station: Realistic Cast-Iron Tawa
    const tawaX = 640;
    const tawaY = 410;
    this.createCentralTawaStation(tawaX, tawaY);

    // 5. Left Station: Fermented Batter & Sizzle Water Cup
    this.createLeftPrepStation(150, 420);

    // 6. Right Station: Ghee Cup & Toppings Rack (Potato Masala, Podi, Shallots)
    this.createRightToppingsStation(1130, 410);

    // 7. Bottom Station: Banana Leaf Platter & Steel Chutney/Sambar Bowls
    this.createPlatingStation(640, height - 70);

    // 8. Bottom Navigation Controls (Main Menu & Finish Service)
    this.createBottomControls(width, height);

    // Initial sizzle sound on entering kitchen
    sound.playSizzle(0.6);
  }

  /**
   * Top HUD with restaurant day, live treasury coins, upgrades shortcut, recipe guide, and sound toggle
   */
  private createKitchenHUD(width: number): void {
    const hudContainer = this.add.container(0, 0);
    const upgradeService = UpgradeService.getInstance();

    const hudBg = this.add.graphics();
    hudBg.fillStyle(THEME.colors.teakWood, 0.96);
    hudBg.fillRect(0, 0, width, 48);
    hudBg.lineStyle(2, THEME.colors.brass, 0.9);
    hudBg.lineBetween(0, 48, width, 48);
    hudContainer.add(hudBg);

    // Day & Service period
    const dayText = this.add.text(25, 14, `DAY ${this.currentDay} • MORNING TIFFIN RUSH ☀️`, {
      fontFamily: THEME.fonts.title,
      fontSize: '15px',
      color: THEME.colors.turmericBrightHex
    });
    hudContainer.add(dayText);

    // Live Treasury Cash
    this.cashText = this.add.text(310, 14, `💰 REGISTER: ₹ ${upgradeService.getCoins()}`, {
      fontFamily: THEME.fonts.title,
      fontSize: '15px',
      color: THEME.colors.creamHex
    });
    hudContainer.add(this.cashText);

    // Rating
    const ratingText = this.add.text(520, 14, '★ ★ ★ ★ ★  5.0 RATING', {
      fontFamily: THEME.fonts.title,
      fontSize: '14px',
      color: THEME.colors.turmericGoldHex
    });
    hudContainer.add(ratingText);

    // Upgrades Button in HUD
    const upBtn = this.add.container(width - 340, 24);
    const upBg = this.add.graphics();
    upBg.fillStyle(THEME.colors.lightWood, 0.9);
    upBg.fillRoundedRect(-60, -15, 120, 30, 6);
    upBg.lineStyle(1.5, THEME.colors.brass, 0.8);
    upBg.strokeRoundedRect(-60, -15, 120, 30, 6);
    upBtn.add(upBg);

    const upTxt = this.add.text(0, 0, '🏛️ UPGRADES', {
      fontFamily: THEME.fonts.body,
      fontSize: '11px',
      fontStyle: 'bold',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    upBtn.add(upTxt);

    upBtn.setSize(120, 30);
    upBtn.setInteractive({ useHandCursor: true });
    upBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.openUpgrades();
    });
    hudContainer.add(upBtn);

    // Recipe Guide button in HUD
    const bookBtn = this.add.container(width - 200, 24);
    const bookBg = this.add.graphics();
    bookBg.fillStyle(THEME.colors.lightWood, 0.9);
    bookBg.fillRoundedRect(-65, -15, 130, 30, 6);
    bookBg.lineStyle(1.5, THEME.colors.brass, 0.8);
    bookBg.strokeRoundedRect(-65, -15, 130, 30, 6);
    bookBtn.add(bookBg);

    const bookTxt = this.add.text(0, 0, '📖 RECIPES (10)', {
      fontFamily: THEME.fonts.body,
      fontSize: '11px',
      fontStyle: 'bold',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    bookBtn.add(bookTxt);

    bookBtn.setSize(130, 30);
    bookBtn.setInteractive({ useHandCursor: true });
    bookBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.openRecipeBook();
    });
    hudContainer.add(bookBtn);

    // Audio quick toggle
    const sound = SoundFX.getInstance();
    const soundBtn = this.add.container(width - 45, 24);
    const soundIcon = this.add.image(0, 0, sound.isMuted() ? 'icon_sound_off' : 'icon_sound_on').setScale(0.7);
    soundBtn.add(soundIcon);
    soundBtn.setSize(36, 36);
    soundBtn.setInteractive({ useHandCursor: true });
    soundBtn.on('pointerdown', () => {
      const isMuted = sound.toggleMute();
      soundIcon.setTexture(isMuted ? 'icon_sound_off' : 'icon_sound_on');
    });
    hudContainer.add(soundBtn);
  }

  /**
   * Top Customer Order Ticket Rail with CustomerOrderCard components
   */
  private createOrderTicketRail(width: number): void {
    const railY = 125;
    const startX = width / 2 - 300;
    const cardSpacing = 300;

    // Wooden Hanging Ticket Rail
    const rail = this.add.graphics();
    rail.fillStyle(THEME.colors.teakWood, 0.9);
    rail.fillRect(width / 2 - 470, 48, 940, 16);
    rail.lineStyle(1.5, THEME.colors.brass, 0.8);
    rail.strokeRect(width / 2 - 470, 48, 940, 16);

    this.orderCards = [];
    this.orders.forEach((order, idx) => {
      const cardX = startX + idx * cardSpacing;
      const isSelected = idx === this.activeOrderIndex;

      const card = new CustomerOrderCard(this, cardX, railY, order, isSelected, () => {
        this.activeOrderIndex = idx;
        this.refreshOrderSelection();
      });

      this.orderCards.push(card);
    });
  }

  private refreshOrderSelection(): void {
    this.orderCards.forEach((card, idx) => {
      card.setSelected(idx === this.activeOrderIndex);
    });
  }

  /**
   * Central Cooking Station with the Realistic Cast-Iron Tawa
   */
  private createCentralTawaStation(x: number, y: number): void {
    const stationContainer = this.add.container(x, y);

    // Heat glow beneath tawa
    this.tawaGlow = this.add.graphics();
    this.tawaGlow.fillStyle(THEME.colors.turmeric, 0.16);
    this.tawaGlow.fillCircle(0, 0, 185);
    stationContainer.add(this.tawaGlow);

    this.tweens.add({
      targets: this.tawaGlow,
      alpha: 0.35,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Realistic Cast-Iron Tawa Sprite
    const tawaImg = this.add.image(0, 0, 'realistic_cast_iron_tawa');
    tawaImg.setDisplaySize(380, 380);
    stationContainer.add(tawaImg);

    // Real-time Steam Particles rising from the hot iron surface
    new SteamEmitter(this, x - 15, y - 20, 160);

    // Dosa Spatula (Thiruppi)
    const spatula = this.add.image(165, 80, 'realistic_spatula');
    spatula.setScale(0.85);
    spatula.setRotation(0.35);
    spatula.setInteractive({ useHandCursor: true });
    spatula.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.tweens.add({
        targets: spatula,
        rotation: 0.15,
        yoyo: true,
        duration: 120
      });
    });
    stationContainer.add(spatula);

    // Interactive Hitbox
    const hitbox = this.add.circle(0, 0, 155, 0x000000, 0);
    hitbox.setInteractive({ useHandCursor: true });

    hitbox.on('pointerdown', () => {
      this.sizzleCount++;
      SoundFX.getInstance().playSizzle(1.2);

      const flash = this.add.circle(x, y, 145, THEME.colors.turmericBright, 0.3);
      this.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 250,
        onComplete: () => flash.destroy()
      });

      if (this.tawaTempText) {
        this.currentTemp = 185 + (this.sizzleCount % 5) * 4;
        this.tawaTempText.setText(`SEASONED KAL TAWA: ${this.currentTemp}°C • OPTIMAL HEAT (CLICKED ${this.sizzleCount}x)`);
        this.tawaTempText.setColor(THEME.colors.turmericBrightHex);
      }
    });
    stationContainer.add(hitbox);

    // Temperature Badge
    const gaugeContainer = this.add.container(0, 168);
    const gaugeG = this.add.graphics();
    gaugeG.fillStyle(THEME.colors.teakWood, 0.94);
    gaugeG.fillRoundedRect(-190, -18, 380, 36, 8);
    gaugeG.lineStyle(1.5, THEME.colors.brass, 0.9);
    gaugeG.strokeRoundedRect(-190, -18, 380, 36, 8);
    gaugeContainer.add(gaugeG);

    this.tawaTempText = this.add.text(0, 0, `SEASONED KAL TAWA: ${this.currentTemp}°C • OPTIMAL HEAT (CLICK TO SIZZLE)`, {
      fontFamily: THEME.fonts.body,
      fontSize: '11px',
      fontStyle: 'bold',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    gaugeContainer.add(this.tawaTempText);

    stationContainer.add(gaugeContainer);
  }

  /**
   * Left Station: Fermented Batter Vessel with Ladle & Sizzle Water Cup
   */
  private createLeftPrepStation(x: number, y: number): void {
    const prepContainer = this.add.container(x, y);

    const board = this.add.graphics();
    board.fillStyle(THEME.colors.teakWood, 0.9);
    board.fillRoundedRect(-100, -130, 200, 260, 14);
    board.lineStyle(2, THEME.colors.brass, 0.7);
    board.strokeRoundedRect(-100, -130, 200, 260, 14);
    prepContainer.add(board);

    const title = this.add.text(0, -112, 'BATTER STATION', {
      fontFamily: THEME.fonts.title,
      fontSize: '13px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    prepContainer.add(title);

    const batterBowl = this.add.image(0, -15, 'realistic_batter_bowl');
    batterBowl.setScale(0.85);
    batterBowl.setInteractive({ useHandCursor: true });
    batterBowl.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.tweens.add({ targets: batterBowl, scaleX: 0.92, scaleY: 0.92, duration: 80, yoyo: true });
    });
    prepContainer.add(batterBowl);

    const batterLabel = this.add.text(0, 48, 'AGED 12H BATTER\n(Rice & Urad Dal)', {
      fontFamily: THEME.fonts.body,
      fontSize: '10px',
      align: 'center',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    prepContainer.add(batterLabel);

    const waterCup = this.add.image(-45, 95, 'realistic_water_cup');
    waterCup.setScale(0.75);
    waterCup.setInteractive({ useHandCursor: true });
    waterCup.on('pointerdown', () => {
      SoundFX.getInstance().playSizzle(0.5);
      this.tweens.add({ targets: waterCup, scaleX: 0.82, scaleY: 0.82, duration: 80, yoyo: true });
    });
    prepContainer.add(waterCup);

    const waterLabel = this.add.text(15, 95, 'WATER CUP\n(Splash to test heat)', {
      fontFamily: THEME.fonts.body,
      fontSize: '9.5px',
      color: THEME.colors.creamDarkHex
    }).setOrigin(0, 0.5);
    prepContainer.add(waterLabel);
  }

  /**
   * Right Station: Brass Ghee Pot & Toppings Rack (Potato Masala, Podi, Shallots)
   */
  private createRightToppingsStation(x: number, y: number): void {
    const rackContainer = this.add.container(x, y);

    const board = this.add.graphics();
    board.fillStyle(THEME.colors.teakWood, 0.9);
    board.fillRoundedRect(-110, -145, 220, 290, 14);
    board.lineStyle(2, THEME.colors.brass, 0.7);
    board.strokeRoundedRect(-110, -145, 220, 290, 14);
    rackContainer.add(board);

    const title = this.add.text(0, -128, 'GHEE & TOPPINGS', {
      fontFamily: THEME.fonts.title,
      fontSize: '13px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    rackContainer.add(title);

    // Ghee Pot
    const gheePot = this.add.image(-45, -70, 'realistic_ghee_cup');
    gheePot.setScale(0.72);
    gheePot.setInteractive({ useHandCursor: true });
    gheePot.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.tweens.add({ targets: gheePot, scaleX: 0.78, scaleY: 0.78, duration: 80, yoyo: true });
    });
    rackContainer.add(gheePot);

    const gheeLabel = this.add.text(12, -70, 'DESI GHEE\n& Basting Brush', {
      fontFamily: THEME.fonts.body,
      fontSize: '10px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0, 0.5);
    rackContainer.add(gheeLabel);

    // Potato Masala
    const potBowl = this.add.image(-45, -5, 'realistic_potato_masala_bowl');
    potBowl.setScale(0.68);
    potBowl.setInteractive({ useHandCursor: true });
    potBowl.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.tweens.add({ targets: potBowl, scaleX: 0.74, scaleY: 0.74, duration: 80, yoyo: true });
    });
    rackContainer.add(potBowl);

    const potLabel = this.add.text(12, -5, 'POTATO MASALA\n(Turmeric Spiced)', {
      fontFamily: THEME.fonts.body,
      fontSize: '10px',
      color: THEME.colors.creamHex
    }).setOrigin(0, 0.5);
    rackContainer.add(potLabel);

    // Gunpowder Podi
    const podiBowl = this.add.image(-45, 58, 'realistic_podi_bowl');
    podiBowl.setScale(0.68);
    podiBowl.setInteractive({ useHandCursor: true });
    podiBowl.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.tweens.add({ targets: podiBowl, scaleX: 0.74, scaleY: 0.74, duration: 80, yoyo: true });
    });
    rackContainer.add(podiBowl);

    const podiLabel = this.add.text(12, 58, 'IDLI PODI\n(Gunpowder)', {
      fontFamily: THEME.fonts.body,
      fontSize: '10px',
      color: THEME.colors.terracottaBrightHex
    }).setOrigin(0, 0.5);
    rackContainer.add(podiLabel);

    // Shallots & Chillies
    const shallotBowl = this.add.image(-45, 115, 'realistic_shallots_bowl');
    shallotBowl.setScale(0.62);
    shallotBowl.setInteractive({ useHandCursor: true });
    shallotBowl.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.tweens.add({ targets: shallotBowl, scaleX: 0.68, scaleY: 0.68, duration: 80, yoyo: true });
    });
    rackContainer.add(shallotBowl);

    const shallotLabel = this.add.text(12, 115, 'SHALLOTS\n& Chillies', {
      fontFamily: THEME.fonts.body,
      fontSize: '10px',
      color: THEME.colors.creamHex
    }).setOrigin(0, 0.5);
    rackContainer.add(shallotLabel);
  }

  /**
   * Bottom Station: Banana Leaf Platter & Condiment Bowls
   */
  private createPlatingStation(x: number, y: number): void {
    const plateContainer = this.add.container(x, y);

    const leaf = this.add.image(0, 0, 'realistic_banana_leaf_platter');
    leaf.setDisplaySize(440, 95);
    plateContainer.add(leaf);

    const cocoChut = this.add.image(-135, -2, 'realistic_coconut_chutney_bowl');
    cocoChut.setScale(0.55);
    cocoChut.setInteractive({ useHandCursor: true });
    cocoChut.on('pointerdown', () => SoundFX.getInstance().playClick());
    plateContainer.add(cocoChut);

    const tomChut = this.add.image(-50, -2, 'realistic_tomato_chutney_bowl');
    tomChut.setScale(0.55);
    tomChut.setInteractive({ useHandCursor: true });
    tomChut.on('pointerdown', () => SoundFX.getInstance().playClick());
    plateContainer.add(tomChut);

    const samBowl = this.add.image(38, -2, 'realistic_sambar_bowl');
    samBowl.setScale(0.58);
    samBowl.setInteractive({ useHandCursor: true });
    samBowl.on('pointerdown', () => SoundFX.getInstance().playClick());
    plateContainer.add(samBowl);

    new SteamEmitter(this, x + 38, y - 25, 30);

    const plateText = this.add.text(140, 0, 'PLATING STATION\nFolded Dosa Landing Spot', {
      fontFamily: THEME.fonts.body,
      fontSize: '10px',
      fontStyle: 'bold',
      color: THEME.colors.creamWarmHex
    }).setOrigin(0, 0.5);
    plateContainer.add(plateText);
  }

  /**
   * Bottom navigation buttons: Main Menu return & Finish Service / Test Level Completion!
   */
  private createBottomControls(width: number, height: number): void {
    // 1. Main Menu return button
    new CozyButton(this, {
      x: 120,
      y: height - 28,
      text: 'Main Menu',
      subText: 'Return to Reception',
      width: 180,
      onClick: () => {
        SoundFX.getInstance().playClick();
        this.cameras.main.fadeOut(300, 26, 14, 7);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('MainMenuScene');
        });
      }
    });

    // 2. Finish Service / Level Completion Trigger Button
    new CozyButton(this, {
      x: width - 130,
      y: height - 28,
      text: 'Finish Service',
      subText: 'Complete Day 1 Rush ★',
      width: 200,
      onClick: () => {
        this.showLevelCompletion();
      }
    });

    // Center Workflow Hint Banner
    const hintText = this.add.text(
      width / 2,
      height - 12,
      '👨‍🍳 Kitchen Flow: Select active order above ➔ Test heat on tawa ➔ Finish service to review stars & rewards',
      {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
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
  }

  private openRecipeBook(): void {
    if (this.isModalOpen) return;
    this.isModalOpen = true;
    new RecipeBookModal(this, () => {
      this.isModalOpen = false;
    });
  }

  private openUpgrades(): void {
    if (this.isModalOpen) return;
    this.isModalOpen = true;
    new UpgradesModal(this, () => {
      this.isModalOpen = false;
      if (this.cashText) {
        this.cashText.setText(`💰 REGISTER: ₹ ${UpgradeService.getInstance().getCoins()}`);
      }
    });
  }

  /**
   * Level completion celebration screen with stars, coins and cooking score
   */
  private showLevelCompletion(): void {
    if (this.isModalOpen) return;
    this.isModalOpen = true;

    const upgradeService = UpgradeService.getInstance();
    const earnedCoins = 340;
    upgradeService.addCoins(earnedCoins);
    if (this.cashText) {
      this.cashText.setText(`💰 REGISTER: ₹ ${upgradeService.getCoins()}`);
    }

    const mockResult: LevelResult = {
      day: this.currentDay,
      serviceTitle: 'Morning Tiffin Rush',
      starsEarned: 3,
      customersServed: 3,
      totalCustomers: 3,
      perfectDosas: 3,
      crispinessScorePercent: 98,
      baseEarnings: 260,
      tipsEarned: 80,
      totalCoins: upgradeService.getCoins(),
      overallScore: 980
    };

    new LevelCompleteModal(this, {
      result: mockResult,
      onNextLevel: () => {
        this.isModalOpen = false;
        this.currentDay++;
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
}
