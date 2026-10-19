import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { CozyButton } from '../ui/CozyButton';
import { SteamEmitter } from '../ui/SteamParticles';
import { RecipeBookModal } from '../ui/RecipeBookModal';
import { CustomerOrder } from '../types/recipe';

export class GameScene extends Phaser.Scene {
  private tawaTempText?: Phaser.GameObjects.Text;
  private tawaGlow?: Phaser.GameObjects.Graphics;
  private sizzleCount: number = 0;
  private currentTemp: number = 185;
  private activeOrderIndex: number = 0;
  private orderCards: Phaser.GameObjects.Container[] = [];
  private isModalOpen: boolean = false;
  private orders: CustomerOrder[] = [
    {
      id: 'ord_1',
      customerName: 'Uncle Venkatesh',
      tableNumber: 3,
      recipeId: 'masala_dosa',
      recipeName: 'Masala Dosa',
      dishImageKey: 'photo_masala_dosa',
      crispinessPreference: 'extra_crispy',
      extraGhee: true,
      specialNote: 'Extra crispy with plenty of potato curry!',
      timeLimitSec: 60,
      rewardCoins: 120
    },
    {
      id: 'ord_2',
      customerName: 'Priya',
      tableNumber: 1,
      recipeId: 'plain_roast',
      recipeName: 'Plain Ghee Roast',
      dishImageKey: 'photo_plain_roast',
      crispinessPreference: 'extra_crispy',
      extraGhee: true,
      specialNote: 'Paper-thin cylindrical flute, extra coconut chutney',
      timeLimitSec: 45,
      rewardCoins: 95
    },
    {
      id: 'ord_3',
      customerName: 'Karthik',
      tableNumber: 5,
      recipeId: 'ghee_podi_dosa',
      recipeName: 'Ghee Podi Roast',
      dishImageKey: 'photo_ghee_podi',
      crispinessPreference: 'medium',
      extraGhee: true,
      specialNote: 'Heavy gunpowder dust seared in bubbling ghee',
      timeLimitSec: 50,
      rewardCoins: 140
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

    // 8. Bottom Navigation Controls
    this.createBottomControls(width, height);

    // Sizzle sound on entering kitchen
    sound.playSizzle(0.6);
  }

  /**
   * Top HUD with restaurant day, cash, customer rating, recipe book shortcut, and menu return
   */
  private createKitchenHUD(width: number): void {
    const hudContainer = this.add.container(0, 0);

    const hudBg = this.add.graphics();
    hudBg.fillStyle(THEME.colors.teakWood, 0.96);
    hudBg.fillRect(0, 0, width, 48);
    hudBg.lineStyle(2, THEME.colors.brass, 0.9);
    hudBg.lineBetween(0, 48, width, 48);
    hudContainer.add(hudBg);

    // Day & Service period
    const dayText = this.add.text(25, 14, 'DAY 1 • MORNING TIFFIN RUSH ☀️', {
      fontFamily: THEME.fonts.title,
      fontSize: '16px',
      color: THEME.colors.turmericBrightHex
    });
    hudContainer.add(dayText);

    // Cash
    const cashText = this.add.text(320, 14, '💰 REGISTER: ₹ 480', {
      fontFamily: THEME.fonts.title,
      fontSize: '16px',
      color: THEME.colors.creamHex
    });
    hudContainer.add(cashText);

    // Rating
    const ratingText = this.add.text(540, 14, '★ ★ ★ ★ ★  5.0 RATING', {
      fontFamily: THEME.fonts.title,
      fontSize: '15px',
      color: THEME.colors.turmericGoldHex
    });
    hudContainer.add(ratingText);

    // Quick Recipe Book button in top HUD
    const bookBtn = this.add.container(width - 240, 24);
    const bookBg = this.add.graphics();
    bookBg.fillStyle(THEME.colors.lightWood, 0.9);
    bookBg.fillRoundedRect(-75, -16, 150, 32, 6);
    bookBg.lineStyle(1.5, THEME.colors.brass, 0.8);
    bookBg.strokeRoundedRect(-75, -16, 150, 32, 6);
    bookBtn.add(bookBg);

    const bookTxt = this.add.text(0, 0, '📖 RECIPE GUIDE', {
      fontFamily: THEME.fonts.body,
      fontSize: '11px',
      fontStyle: 'bold',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    bookBtn.add(bookTxt);

    bookBtn.setSize(150, 32);
    bookBtn.setInteractive({ useHandCursor: true });
    bookBtn.on('pointerover', () => {
      bookBg.clear();
      bookBg.fillStyle(THEME.colors.terracotta, 1);
      bookBg.fillRoundedRect(-75, -16, 150, 32, 6);
      bookBg.lineStyle(1.5, THEME.colors.brassBright, 1);
      bookBg.strokeRoundedRect(-75, -16, 150, 32, 6);
    });
    bookBtn.on('pointerout', () => {
      bookBg.clear();
      bookBg.fillStyle(THEME.colors.lightWood, 0.9);
      bookBg.fillRoundedRect(-75, -16, 150, 32, 6);
      bookBg.lineStyle(1.5, THEME.colors.brass, 0.8);
      bookBg.strokeRoundedRect(-75, -16, 150, 32, 6);
    });
    bookBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.openRecipeBook();
    });
    hudContainer.add(bookBtn);

    // Audio quick toggle
    const sound = SoundFX.getInstance();
    const soundBtn = this.add.container(width - 50, 24);
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
   * Top Customer Order Ticket Rail with actual dish photographs!
   */
  private createOrderTicketRail(width: number): void {
    const railY = 120;
    const startX = width / 2 - 280;
    const cardSpacing = 280;

    // Wooden Hanging Ticket Rail
    const rail = this.add.graphics();
    rail.fillStyle(THEME.colors.teakWood, 0.9);
    rail.fillRect(width / 2 - 460, 48, 920, 16);
    rail.lineStyle(1.5, THEME.colors.brass, 0.8);
    rail.strokeRect(width / 2 - 460, 48, 920, 16);

    this.orders.forEach((order, idx) => {
      const cardX = startX + idx * cardSpacing;
      const cardContainer = this.add.container(cardX, railY);

      // Card Background (from RealisticKitchenAssets)
      const cardBg = this.add.image(0, 0, 'ui_order_ticket_card');
      cardBg.setDisplaySize(255, 125);
      cardContainer.add(cardBg);

      // Selection Highlight Border
      const isSelected = idx === this.activeOrderIndex;
      const highlight = this.add.graphics();
      this.drawOrderHighlight(highlight, isSelected);
      cardContainer.add(highlight);

      // Brass Hanging Clip
      const clip = this.add.graphics();
      clip.fillStyle(THEME.colors.brass, 1);
      clip.fillRect(-10, -68, 20, 14);
      clip.fillStyle(THEME.colors.brassBright, 1);
      clip.fillCircle(0, -64, 4);
      cardContainer.add(clip);

      // Dish Photo Thumbnail (Realistic Food Photograph!)
      const thumbX = -72;
      const thumbY = -2;
      const thumbW = 76;
      const thumbH = 68;

      const photoKey = this.textures.exists(order.dishImageKey) ? order.dishImageKey : 'photo_masala_dosa';
      const thumbImg = this.add.image(thumbX, thumbY, photoKey);
      thumbImg.setDisplaySize(thumbW, thumbH);
      cardContainer.add(thumbImg);

      // Thumbnail Brass Border
      const thumbBorder = this.add.graphics();
      thumbBorder.lineStyle(1.5, THEME.colors.brass, 0.9);
      thumbBorder.strokeRect(thumbX - thumbW / 2, thumbY - thumbH / 2, thumbW, thumbH);
      cardContainer.add(thumbBorder);

      // Customer Info & Table
      const headerText = this.add.text(-22, -45, `T-${order.tableNumber} • ${order.customerName}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
        fontStyle: 'bold',
        color: THEME.colors.terracottaHex
      });
      cardContainer.add(headerText);

      // Dish Name
      const dishTitle = this.add.text(-22, -28, order.recipeName.toUpperCase(), {
        fontFamily: THEME.fonts.title,
        fontSize: '13.5px',
        color: THEME.colors.teakWoodHex
      });
      cardContainer.add(dishTitle);

      // Special Note
      const noteText = this.add.text(-22, -8, order.specialNote, {
        fontFamily: THEME.fonts.body,
        fontSize: '9.5px',
        color: '#4A3324',
        wordWrap: { width: 135 }
      });
      cardContainer.add(noteText);

      // Reward & Timer
      const footerText = this.add.text(-22, 34, `⏱ ${order.timeLimitSec}s   •   💰 +₹${order.rewardCoins}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '10.5px',
        fontStyle: 'bold',
        color: THEME.colors.curryGreenHex
      });
      cardContainer.add(footerText);

      // Interactive: click to select active order
      cardContainer.setSize(255, 125);
      cardContainer.setInteractive({ useHandCursor: true });

      cardContainer.on('pointerdown', () => {
        SoundFX.getInstance().playClick();
        this.activeOrderIndex = idx;
        this.refreshOrderHighlights();
      });

      cardContainer.on('pointerover', () => {
        this.tweens.add({
          targets: cardContainer,
          y: railY + 4,
          duration: 100,
          ease: 'Quad.easeOut'
        });
      });

      cardContainer.on('pointerout', () => {
        this.tweens.add({
          targets: cardContainer,
          y: railY,
          duration: 100,
          ease: 'Quad.easeOut'
        });
      });

      this.orderCards.push(cardContainer);
    });
  }

  private drawOrderHighlight(g: Phaser.GameObjects.Graphics, isSelected: boolean): void {
    g.clear();
    if (isSelected) {
      g.lineStyle(3, THEME.colors.turmericGold, 1);
      g.strokeRoundedRect(-120, -56, 240, 112, 6);
      g.fillStyle(THEME.colors.turmeric, 0.08);
      g.fillRoundedRect(-120, -56, 240, 112, 6);
    }
  }

  private refreshOrderHighlights(): void {
    this.orderCards.forEach((card, idx) => {
      const highlight = card.getAt(1) as Phaser.GameObjects.Graphics;
      this.drawOrderHighlight(highlight, idx === this.activeOrderIndex);
    });
  }

  /**
   * Central Cooking Station with the Realistic Cast-Iron Tawa
   */
  private createCentralTawaStation(x: number, y: number): void {
    const stationContainer = this.add.container(x, y);

    // Warm ambient heat glow beneath tawa
    this.tawaGlow = this.add.graphics();
    this.tawaGlow.fillStyle(THEME.colors.turmeric, 0.16);
    this.tawaGlow.fillCircle(0, 0, 185);
    stationContainer.add(this.tawaGlow);

    // Pulsing heat glow animation
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

    // Real-time Steam Particles rising from the hot seasoned iron surface
    new SteamEmitter(this, x - 15, y - 20, 160);

    // Dosa Spatula (Thiruppi) resting near the handle
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

    // Interactive Cast-Iron Tawa Hitbox
    const hitbox = this.add.circle(0, 0, 155, 0x000000, 0);
    hitbox.setInteractive({ useHandCursor: true });

    hitbox.on('pointerdown', () => {
      this.sizzleCount++;
      SoundFX.getInstance().playSizzle(1.2);

      // Flash pulse on tawa
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

    // Temperature & Heat State Badge below Tawa
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

    // Wooden cutting board base
    const board = this.add.graphics();
    board.fillStyle(THEME.colors.teakWood, 0.9);
    board.fillRoundedRect(-100, -130, 200, 260, 14);
    board.lineStyle(2, THEME.colors.brass, 0.7);
    board.strokeRoundedRect(-100, -130, 200, 260, 14);
    prepContainer.add(board);

    // Station Title
    const title = this.add.text(0, -112, 'BATTER STATION', {
      fontFamily: THEME.fonts.title,
      fontSize: '13px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    prepContainer.add(title);

    // Fermented Batter Bowl Sprite with Ladle
    const batterBowl = this.add.image(0, -15, 'realistic_batter_bowl');
    batterBowl.setScale(0.85);
    batterBowl.setInteractive({ useHandCursor: true });
    batterBowl.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.tweens.add({
        targets: batterBowl,
        scaleX: 0.92,
        scaleY: 0.92,
        duration: 80,
        yoyo: true
      });
    });
    prepContainer.add(batterBowl);

    const batterLabel = this.add.text(0, 48, 'AGED 12H BATTER\n(Rice & Urad Dal)', {
      fontFamily: THEME.fonts.body,
      fontSize: '10px',
      align: 'center',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    prepContainer.add(batterLabel);

    // Water Cup for Sizzle Heat Testing
    const waterCup = this.add.image(-45, 95, 'realistic_water_cup');
    waterCup.setScale(0.75);
    waterCup.setInteractive({ useHandCursor: true });
    waterCup.on('pointerdown', () => {
      SoundFX.getInstance().playSizzle(0.5);
      this.tweens.add({
        targets: waterCup,
        scaleX: 0.82,
        scaleY: 0.82,
        duration: 80,
        yoyo: true
      });
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

    // Wooden base
    const board = this.add.graphics();
    board.fillStyle(THEME.colors.teakWood, 0.9);
    board.fillRoundedRect(-110, -145, 220, 290, 14);
    board.lineStyle(2, THEME.colors.brass, 0.7);
    board.strokeRoundedRect(-110, -145, 220, 290, 14);
    rackContainer.add(board);

    // Station Title
    const title = this.add.text(0, -128, 'GHEE & TOPPINGS', {
      fontFamily: THEME.fonts.title,
      fontSize: '13px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    rackContainer.add(title);

    // 1. Brass Ghee Pot with Brush
    const gheePot = this.add.image(-45, -70, 'realistic_ghee_cup');
    gheePot.setScale(0.72);
    gheePot.setInteractive({ useHandCursor: true });
    gheePot.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.tweens.add({ targets: gheePot, scaleX: 0.78, scaleY: 0.78, duration: 80, yoyo: true });
    });
    rackContainer.add(gheePot);

    const gheeLabel = this.add.text(12, -70, 'DESI GHEE\n& Brush', {
      fontFamily: THEME.fonts.body,
      fontSize: '10px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0, 0.5);
    rackContainer.add(gheeLabel);

    // 2. Potato Masala Bowl
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

    // 3. Gunpowder Podi Bowl
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

    // 4. Sliced Shallots & Green Chillies
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

    // Banana Leaf Platter
    const leaf = this.add.image(0, 0, 'realistic_banana_leaf_platter');
    leaf.setDisplaySize(440, 95);
    plateContainer.add(leaf);

    // Steel Condiment Bowls placed on the leaf
    // 1. Coconut Chutney
    const cocoChut = this.add.image(-135, -2, 'realistic_coconut_chutney_bowl');
    cocoChut.setScale(0.55);
    cocoChut.setInteractive({ useHandCursor: true });
    cocoChut.on('pointerdown', () => SoundFX.getInstance().playClick());
    plateContainer.add(cocoChut);

    // 2. Tomato Chutney
    const tomChut = this.add.image(-50, -2, 'realistic_tomato_chutney_bowl');
    tomChut.setScale(0.55);
    tomChut.setInteractive({ useHandCursor: true });
    tomChut.on('pointerdown', () => SoundFX.getInstance().playClick());
    plateContainer.add(tomChut);

    // 3. Vegetable Sambar
    const samBowl = this.add.image(38, -2, 'realistic_sambar_bowl');
    samBowl.setScale(0.58);
    samBowl.setInteractive({ useHandCursor: true });
    samBowl.on('pointerdown', () => SoundFX.getInstance().playClick());
    plateContainer.add(samBowl);

    // Sambar steam
    new SteamEmitter(this, x + 38, y - 25, 30);

    // Plating Target Note
    const plateText = this.add.text(140, 0, 'PLATING STATION\nFolded Dosa Landing Spot', {
      fontFamily: THEME.fonts.body,
      fontSize: '10px',
      fontStyle: 'bold',
      color: THEME.colors.creamWarmHex
    }).setOrigin(0, 0.5);
    plateContainer.add(plateText);
  }

  /**
   * Bottom navigation buttons (Main Menu return and hints)
   */
  private createBottomControls(width: number, height: number): void {
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

    // Kitchen Workflow Hint Banner
    const hintText = this.add.text(
      width / 2,
      height - 12,
      '👨‍🍳 Kitchen Flow: Check active order above ➔ Click water/tawa to test heat ➔ Batter swirl & toppings ready',
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
}
