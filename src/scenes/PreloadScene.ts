import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { AssetGenerator } from '../services/AssetGenerator';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    const { width, height } = THEME.dimensions;

    // Background for loading screen
    this.add.rectangle(width / 2, height / 2, width, height, THEME.colors.darkWood);

    // Warm radial glow in center
    const glow = this.add.graphics();
    glow.fillStyle(THEME.colors.turmeric, 0.12);
    glow.fillCircle(width / 2, height / 2, 240);

    // Title Text
    this.add.text(width / 2, height / 2 - 80, 'DOSA HOUSE', {
      fontFamily: THEME.fonts.title,
      fontSize: '44px',
      color: THEME.colors.turmericBrightHex,
      stroke: THEME.colors.teakWoodHex,
      strokeThickness: 5
    }).setOrigin(0.5);

    // Tamil Subtitle
    this.add.text(width / 2, height / 2 - 32, 'தோசை ஹவுஸ் • Preparing The Tiffin Room', {
      fontFamily: THEME.fonts.body,
      fontSize: '15px',
      color: THEME.colors.creamHex,
      letterSpacing: 2
    }).setOrigin(0.5);

    // Progress Bar Background
    const barW = 380;
    const barH = 18;
    const barX = width / 2 - barW / 2;
    const barY = height / 2 + 30;

    const barBg = this.add.graphics();
    barBg.fillStyle(THEME.colors.teakWood, 0.9);
    barBg.fillRoundedRect(barX, barY, barW, barH, 9);
    barBg.lineStyle(2, THEME.colors.brass, 0.8);
    barBg.strokeRoundedRect(barX, barY, barW, barH, 9);

    const progressBar = this.add.graphics();

    const statusText = this.add.text(width / 2, barY + 36, 'Grinding fresh batter...', {
      fontFamily: THEME.fonts.body,
      fontSize: '13px',
      color: THEME.colors.creamDarkHex
    }).setOrigin(0.5);

    // Loading Event Listeners
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(THEME.colors.turmeric, 1);
      progressBar.fillRoundedRect(barX + 2, barY + 2, (barW - 4) * value, barH - 4, 7);

      if (value < 0.4) {
        statusText.setText('Soaking rice and urad dal...');
      } else if (value < 0.7) {
        statusText.setText('Seasoning the cast iron tawa with gingelly oil...');
      } else {
        statusText.setText('Tempering mustard seeds and curry leaves...');
      }
    });

    // Load static image assets
    this.load.image('restaurant_bg', '/assets/restaurant_bg.jpg');
    this.load.image('dosa_platter', '/assets/dosa_platter.jpg');
    this.load.image('kitchen_station', '/assets/kitchen_station.jpg');
  }

  create(): void {
    // Generate procedural vector & canvas UI textures
    AssetGenerator.generateAll(this);

    // Smooth transition to MainMenuScene
    this.cameras.main.fadeOut(300, 26, 14, 7);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MainMenuScene');
    });
  }
}
