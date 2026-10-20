import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { CozyButton } from '../ui/CozyButton';
import { SteamEmitter } from '../ui/SteamParticles';
import { RecipeBookModal } from '../ui/RecipeBookModal';
import { SettingsModal } from '../ui/SettingsModal';
import { UpgradesModal } from '../ui/UpgradesModal';
import { LevelSelectModal } from '../ui/LevelSelectModal';
import { UpgradeService } from '../services/UpgradeService';

export class MainMenuScene extends Phaser.Scene {
  private steamEmitter?: SteamEmitter;
  private soundButton?: Phaser.GameObjects.Container;
  private soundIcon?: Phaser.GameObjects.Image;
  private isModalOpen: boolean = false;

  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create(): void {
    const { width, height } = THEME.dimensions;
    const sound = SoundFX.getInstance();

    // Camera fade in from PreloadScene
    this.cameras.main.fadeIn(400, 26, 14, 7);

    // 1. Background Image (The Marigold Kitchen & cozy South Indian dining room)
    const bg = this.add.image(width / 2, height / 2, 'restaurant_bg');
    bg.setDisplaySize(width, height);
    bg.setAlpha(0.65);

    // 2. Warm Color Grading & Vignette
    const warmOverlay = this.add.graphics();
    warmOverlay.fillStyle(THEME.colors.teakWood, 0.4);
    warmOverlay.fillRect(0, 0, width, height);

    const vignette = this.add.image(width / 2, height / 2, 'fx_vignette');
    vignette.setDisplaySize(width, height);
    vignette.setAlpha(0.85);

    // 3. Subtle Animated Kolam (Rice Rangoli) Patterns in Background Corners
    const kolamLeft = this.add.image(90, height - 90, 'ui_kolam').setAlpha(0.25).setScale(1.1);
    const kolamRight = this.add.image(width - 90, height - 90, 'ui_kolam').setAlpha(0.25).setScale(1.1);

    this.tweens.add({
      targets: [kolamLeft, kolamRight],
      rotation: Math.PI * 2,
      duration: 80000,
      repeat: -1,
      ease: 'Linear'
    });

    // 4. Festive Top Garland (Toran) with Brass Bells
    this.createToranHeader(width);

    // 5. Main Title Signboard (DOSA HOUSE)
    this.createTitleSignboard(width / 2, 105);

    // 6. Food Centerpiece (Crispy Golden Dosa Platter with Sambar and Chutneys)
    const foodCenterX = 390;
    const foodCenterY = 440;
    this.createFoodCenterpiece(foodCenterX, foodCenterY);

    // 7. Right Navigation Panel with Cozy Wooden Buttons
    const menuCenterX = 960;
    const menuCenterY = 430;
    this.createNavigationMenu(menuCenterX, menuCenterY);

    // 8. Top Controls (Mute / Sound Toggle & Fullscreen)
    this.createTopControls(width);

    // 9. Bottom Footer Lore Tagline
    this.createFooter(width, height);
  }

  /**
   * Top festive marigold garland with hanging brass bells (interactive!)
   */
  private createToranHeader(width: number): void {
    const headerG = this.add.graphics();
    // Warm wooden pelmet arch bar
    headerG.fillStyle(THEME.colors.teakWood, 0.95);
    headerG.fillRect(0, 0, width, 18);
    headerG.fillStyle(THEME.colors.brass, 1);
    headerG.fillRect(0, 18, width, 3);

    // Interactive Brass Hanging Bells
    const bellPositions = [140, 310, width - 310, width - 140];
    bellPositions.forEach(bx => {
      const bellChain = this.add.graphics();
      bellChain.lineStyle(2, THEME.colors.brass, 0.85);
      bellChain.lineBetween(bx, 18, bx, 55);

      const bell = this.add.image(bx, 62, 'ui_brass_badge').setScale(0.38);
      bell.setInteractive({ useHandCursor: true });

      bell.on('pointerover', () => {
        this.tweens.add({
          targets: bell,
          scaleX: 0.44,
          scaleY: 0.44,
          duration: 120,
          ease: 'Back.easeOut'
        });
      });

      bell.on('pointerout', () => {
        this.tweens.add({
          targets: bell,
          scaleX: 0.38,
          scaleY: 0.38,
          duration: 120,
          ease: 'Quad.easeOut'
        });
      });

      bell.on('pointerdown', () => {
        SoundFX.getInstance().playBell();
        this.tweens.add({
          targets: bell,
          rotation: 0.3,
          yoyo: true,
          repeat: 3,
          duration: 100,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            bell.setRotation(0);
          }
        });
      });
    });
  }

  /**
   * Carved wooden signboard with brass trims and glowing logo
   */
  private createTitleSignboard(x: number, y: number): void {
    const signContainer = this.add.container(x, y);

    const signW = 680;
    const signH = 115;

    const g = this.add.graphics();
    // Shadow
    g.fillStyle(0x000000, 0.45);
    g.fillRoundedRect(-signW / 2 + 6, -signH / 2 + 8, signW, signH, 16);

    // Teak Wood Plate
    g.fillStyle(THEME.colors.teakWood, 0.95);
    g.fillRoundedRect(-signW / 2, -signH / 2, signW, signH, 16);

    // Brass Outer Border
    g.lineStyle(3.5, THEME.colors.brass, 0.95);
    g.strokeRoundedRect(-signW / 2, -signH / 2, signW, signH, 16);

    // Inner Terracotta Inset Border
    g.lineStyle(1.5, THEME.colors.turmericGold, 0.7);
    g.strokeRoundedRect(-signW / 2 + 6, -signH / 2 + 6, signW - 12, signH - 12, 12);

    signContainer.add(g);

    // Main Game Title: DOSA HOUSE
    const titleText = this.add.text(0, -18, 'DOSA HOUSE', {
      fontFamily: THEME.fonts.title,
      fontSize: '48px',
      color: THEME.colors.turmericBrightHex,
      stroke: THEME.colors.teakWoodHex,
      strokeThickness: 5
    }).setOrigin(0.5);
    titleText.setShadow(2, 3, 'rgba(0,0,0,0.7)', 4);
    signContainer.add(titleText);

    // Tamil Subtitle & Tagline
    const subText = this.add.text(0, 26, 'தோசை ஹவுஸ் • AUTHENTIC SOUTH INDIAN TIFFIN SIMULATOR', {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      fontStyle: 'bold',
      color: THEME.colors.creamWarmHex,
      letterSpacing: 2.5
    }).setOrigin(0.5);
    signContainer.add(subText);

    // Corner Brass Studs
    const studs = [
      { x: -signW / 2 + 16, y: -signH / 2 + 16 },
      { x: signW / 2 - 16, y: -signH / 2 + 16 },
      { x: -signW / 2 + 16, y: signH / 2 - 16 },
      { x: signW / 2 - 16, y: signH / 2 - 16 }
    ];
    studs.forEach(s => {
      const stud = this.add.graphics();
      stud.fillStyle(THEME.colors.brassBright, 1);
      stud.fillCircle(s.x, s.y, 4);
      stud.fillStyle(THEME.colors.teakWood, 0.6);
      stud.fillCircle(s.x + 1, s.y + 1, 1.5);
      signContainer.add(stud);
    });

    // Gentle floating breathing animation
    this.tweens.add({
      targets: signContainer,
      y: y + 4,
      duration: 3200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Centerpiece Food Artwork: Fresh Masala Dosa Platter with Banana Leaf & Sambar
   */
  private createFoodCenterpiece(x: number, y: number): void {
    const foodContainer = this.add.container(x, y);

    // Golden warm backlight aura
    const aura = this.add.graphics();
    aura.fillStyle(THEME.colors.turmeric, 0.18);
    aura.fillCircle(0, 10, 210);
    foodContainer.add(aura);

    // Dosa Platter Image
    const platterImg = this.add.image(0, 0, 'dosa_platter');
    platterImg.setDisplaySize(500, 375);
    foodContainer.add(platterImg);

    // Real-time Steam Particles rising from the hot Dosa and Sambar!
    // Positions relative to platter image center
    this.steamEmitter = new SteamEmitter(this, x + 40, y - 50, 70); // from dosa cone
    new SteamEmitter(this, x - 50, y + 60, 45); // from sambar bowl

    // Quality Badge / Ribbons
    const badge = this.add.container(180, -110);
    const badgeG = this.add.graphics();
    badgeG.fillStyle(THEME.colors.terracotta, 0.95);
    badgeG.fillRoundedRect(-85, -20, 170, 40, 10);
    badgeG.lineStyle(2, THEME.colors.brassBright, 0.9);
    badgeG.strokeRoundedRect(-85, -20, 170, 40, 10);
    badge.add(badgeG);

    const badgeText = this.add.text(0, -2, '★ 100% GHEE ROAST ★', {
      fontFamily: THEME.fonts.title,
      fontSize: '12px',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    badge.add(badgeText);

    foodContainer.add(badge);

    // Subtle gentle hover bobbing
    this.tweens.add({
      targets: foodContainer,
      y: y - 6,
      duration: 3600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Make platter interactive: clicking it produces a pleasant sizzle!
    platterImg.setInteractive({ useHandCursor: true });
    platterImg.on('pointerdown', () => {
      SoundFX.getInstance().playSizzle(0.7);
      this.tweens.add({
        targets: foodContainer,
        scaleX: 1.03,
        scaleY: 1.03,
        duration: 90,
        yoyo: true,
        ease: 'Quad.easeInOut'
      });
    });
  }

  /**
   * Interactive wooden navigation buttons column
   */
  private createNavigationMenu(x: number, y: number): void {
    const spacing = 65;
    const currentDay = UpgradeService.getInstance().getCurrentDay();

    // 1. Play Game Button (Launches kitchen immediately!)
    new CozyButton(this, {
      x,
      y: y - spacing * 2,
      text: 'Play Game',
      subText: `Enter Kitchen • Day ${currentDay} ★`,
      iconTexture: 'icon_play',
      width: 350,
      onClick: () => {
        if (this.isModalOpen) return;
        this.startGame(currentDay);
      }
    });

    // 2. Select Shift / Day Button
    new CozyButton(this, {
      x,
      y: y - spacing * 1,
      text: 'Select Day',
      subText: '5 Progressive Service Shifts',
      iconTexture: 'icon_upgrades',
      width: 350,
      onClick: () => {
        if (this.isModalOpen) return;
        this.openLevelSelect();
      }
    });

    // 3. Recipe Book Button
    new CozyButton(this, {
      x,
      y,
      text: 'Recipe Book',
      subText: '10 Master Recipes, Steps & Lore',
      iconTexture: 'icon_recipe_book',
      width: 350,
      onClick: () => {
        if (this.isModalOpen) return;
        this.openRecipeBook();
      }
    });

    // 4. Upgrades Button
    new CozyButton(this, {
      x,
      y: y + spacing * 1,
      text: 'Upgrades & Decor',
      subText: 'Kitchen Equipment & Heritage Charm',
      iconTexture: 'icon_upgrades',
      width: 350,
      onClick: () => {
        if (this.isModalOpen) return;
        this.openUpgrades();
      }
    });

    // 5. Settings Button
    new CozyButton(this, {
      x,
      y: y + spacing * 2,
      text: 'Settings',
      subText: 'Audio, Visuals & Credits',
      iconTexture: 'icon_settings',
      width: 350,
      onClick: () => {
        if (this.isModalOpen) return;
        this.openSettings();
      }
    });
  }

  /**
   * Top right controls: Audio Mute & Fullscreen
   */
  private createTopControls(width: number): void {
    const sound = SoundFX.getInstance();

    // Sound Toggle Container
    this.soundButton = this.add.container(width - 45, 45);

    const bgG = this.add.graphics();
    bgG.fillStyle(THEME.colors.teakWood, 0.85);
    bgG.fillCircle(0, 0, 22);
    bgG.lineStyle(2, THEME.colors.brass, 0.8);
    bgG.strokeCircle(0, 0, 22);
    this.soundButton.add(bgG);

    this.soundIcon = this.add.image(0, 0, sound.isMuted() ? 'icon_sound_off' : 'icon_sound_on');
    this.soundIcon.setScale(0.85);
    this.soundButton.add(this.soundIcon);

    this.soundButton.setSize(44, 44);
    this.soundButton.setInteractive({ useHandCursor: true });

    this.soundButton.on('pointerover', () => {
      this.soundButton?.setScale(1.1);
    });

    this.soundButton.on('pointerout', () => {
      this.soundButton?.setScale(1.0);
    });

    this.soundButton.on('pointerdown', () => {
      const isMuted = sound.toggleMute();
      this.soundIcon?.setTexture(isMuted ? 'icon_sound_off' : 'icon_sound_on');
      if (!isMuted) sound.playClick();
    });

    // Fullscreen Toggle Button (essential for smartphone immersion)
    const fsButton = this.add.container(width - 98, 45);
    const fsBg = this.add.graphics();
    fsBg.fillStyle(THEME.colors.teakWood, 0.85);
    fsBg.fillCircle(0, 0, 22);
    fsBg.lineStyle(2, THEME.colors.brass, 0.8);
    fsBg.strokeCircle(0, 0, 22);
    fsButton.add(fsBg);

    const fsIcon = this.add.text(0, 0, '⛶', {
      fontFamily: THEME.fonts.body,
      fontSize: '18px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    fsButton.add(fsIcon);

    fsButton.setSize(44, 44);
    fsButton.setInteractive({ useHandCursor: true });
    fsButton.on('pointerover', () => fsButton.setScale(1.1));
    fsButton.on('pointerout', () => fsButton.setScale(1.0));
    fsButton.on('pointerdown', () => {
      sound.playClick();
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });
  }

  /**
   * Bottom footer with cozy tiffin lore
   */
  private createFooter(width: number, height: number): void {
    const footerText = this.add.text(
      width / 2,
      height - 24,
      '🌾 Hand-fermented Batter • Pure Desi Ghee • Stone Ground Chutneys • Filter Kaapi ☕',
      {
        fontFamily: THEME.fonts.body,
        fontSize: '13px',
        color: THEME.colors.creamDarkHex,
        align: 'center'
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: footerText,
      alpha: 0.55,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private openLevelSelect(): void {
    this.isModalOpen = true;
    new LevelSelectModal(
      this,
      (selectedDay: number) => {
        this.isModalOpen = false;
        this.startGame(selectedDay);
      },
      () => {
        this.isModalOpen = false;
      }
    );
  }

  private startGame(day?: number): void {
    const targetDay = day !== undefined ? day : UpgradeService.getInstance().getCurrentDay();
    UpgradeService.getInstance().setCurrentDay(targetDay);
    SoundFX.getInstance().playSizzle(0.9);
    this.cameras.main.fadeOut(250, 26, 14, 7);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
    });
  }

  private openRecipeBook(): void {
    this.isModalOpen = true;
    new RecipeBookModal(
      this,
      () => {
        this.isModalOpen = false;
      },
      (recipe) => {
        this.isModalOpen = false;
        this.startGame();
      }
    );
  }

  private openUpgrades(): void {
    this.isModalOpen = true;
    new UpgradesModal(this, () => {
      this.isModalOpen = false;
    });
  }

  private openSettings(): void {
    this.isModalOpen = true;
    new SettingsModal(this, () => {
      this.isModalOpen = false;
    });
  }
}

