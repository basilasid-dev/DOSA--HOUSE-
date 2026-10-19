import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { CozyButton } from '../ui/CozyButton';
import { SteamEmitter } from '../ui/SteamParticles';

export class GameScene extends Phaser.Scene {
  private tawaTempText?: Phaser.GameObjects.Text;
  private sizzleCount: number = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    const { width, height } = THEME.dimensions;
    const sound = SoundFX.getInstance();

    this.cameras.main.fadeIn(350, 26, 14, 7);

    // 1. Kitchen Station Backdrop
    const bg = this.add.image(width / 2, height / 2, 'kitchen_station');
    bg.setDisplaySize(width, height);
    bg.setAlpha(0.85);

    // Vignette for focus
    const vignette = this.add.image(width / 2, height / 2, 'fx_vignette');
    vignette.setDisplaySize(width, height);
    vignette.setAlpha(0.65);

    // 2. Rising Steam over the hot Tawa
    new SteamEmitter(this, width / 2 + 30, height / 2 - 20, 140);

    // 3. Top Kitchen Service HUD
    this.createKitchenHUD(width);

    // 4. Central Tawa Interactive Indicator
    this.createTawaStation(width / 2 + 25, height / 2 - 25);

    // 5. Customer Order Ticket (Sample Order)
    this.createOrderTicket(140, 150);

    // 6. Navigation: Return to Menu Button
    new CozyButton(this, {
      x: 130,
      y: height - 55,
      text: 'Main Menu',
      subText: 'Return to Reception',
      width: 200,
      onClick: () => {
        sound.playClick();
        this.cameras.main.fadeOut(300, 26, 14, 7);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('MainMenuScene');
        });
      }
    });

    // 7. Kitchen Architecture Notice
    this.createNoticeBanner(width, height);
  }

  private createKitchenHUD(width: number): void {
    const hudContainer = this.add.container(0, 0);

    // Wood Banner Bar
    const hudBg = this.add.graphics();
    hudBg.fillStyle(THEME.colors.teakWood, 0.95);
    hudBg.fillRect(0, 0, width, 55);
    hudBg.lineStyle(2, THEME.colors.brass, 0.9);
    hudBg.lineBetween(0, 55, width, 55);
    hudContainer.add(hudBg);

    // Day & Service Period
    const dayText = this.add.text(30, 16, 'DAY 1 • MORNING TIFFIN RUSH', {
      fontFamily: THEME.fonts.title,
      fontSize: '18px',
      color: THEME.colors.turmericBrightHex
    });
    hudContainer.add(dayText);

    // Earnings
    const moneyText = this.add.text(width / 2, 16, 'RESTAURANT CASH: ₹ 350', {
      fontFamily: THEME.fonts.title,
      fontSize: '18px',
      color: THEME.colors.creamHex
    }).setOrigin(0.5, 0);
    hudContainer.add(moneyText);

    // Customer Rating
    const starsText = this.add.text(width - 30, 16, 'RATING: ★★★★★ (5.0)', {
      fontFamily: THEME.fonts.title,
      fontSize: '17px',
      color: THEME.colors.turmericGoldHex
    }).setOrigin(1, 0);
    hudContainer.add(starsText);
  }

  private createOrderTicket(x: number, y: number): void {
    const ticket = this.add.container(x, y);

    const tg = this.add.graphics();
    // Shadow
    tg.fillStyle(0x000000, 0.4);
    tg.fillRoundedRect(-95, -75, 190, 150, 8);
    // Ticket paper
    tg.fillStyle(0xFFF9E6, 1);
    tg.fillRoundedRect(-100, -80, 190, 150, 8);
    tg.lineStyle(2, THEME.colors.terracotta, 0.5);
    tg.strokeRoundedRect(-100, -80, 190, 150, 8);
    ticket.add(tg);

    // Ticket Header
    const orderNum = this.add.text(-90, -70, '#01 • TABLE 3', {
      fontFamily: THEME.fonts.body,
      fontSize: '11px',
      fontStyle: 'bold',
      color: THEME.colors.terracottaHex
    });
    ticket.add(orderNum);

    const recipeName = this.add.text(-90, -50, 'MASALA DOSA', {
      fontFamily: THEME.fonts.title,
      fontSize: '16px',
      color: THEME.colors.teakWoodHex
    });
    ticket.add(recipeName);

    const req1 = this.add.text(-90, -26, '• Extra Golden Crisp', {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      color: '#443322'
    });
    ticket.add(req1);

    const req2 = this.add.text(-90, -8, '• Pure Desi Ghee', {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      color: '#443322'
    });
    ticket.add(req2);

    const req3 = this.add.text(-90, 10, '• 3 Chutneys + Sambar', {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      color: '#443322'
    });
    ticket.add(req3);

    // Timer bar
    const timerBar = this.add.graphics();
    timerBar.fillStyle(THEME.colors.curryGreen, 1);
    timerBar.fillRoundedRect(-90, 36, 170, 8, 4);
    ticket.add(timerBar);

    const timerText = this.add.text(-90, 48, 'TIME REMAINING: 45s', {
      fontFamily: THEME.fonts.body,
      fontSize: '10px',
      fontStyle: 'bold',
      color: THEME.colors.curryGreenHex
    });
    ticket.add(timerText);
  }

  private createTawaStation(x: number, y: number): void {
    const tawaHitbox = this.add.circle(x, y, 160, 0x000000, 0);
    tawaHitbox.setInteractive({ useHandCursor: true });

    // Interactive sizzle on click
    tawaHitbox.on('pointerdown', () => {
      this.sizzleCount++;
      SoundFX.getInstance().playSizzle(1.2);

      // Flash pulse on tawa
      const flash = this.add.circle(x, y, 155, THEME.colors.turmeric, 0.25);
      this.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 250,
        onComplete: () => flash.destroy()
      });

      if (this.tawaTempText) {
        this.tawaTempText.setText(`TAWA SIZZLE ACTIVE! (${this.sizzleCount} sips of ghee)`);
        this.tawaTempText.setColor(THEME.colors.turmericBrightHex);
      }
    });

    // Tawa Temperature HUD Badge
    const gaugeContainer = this.add.container(x, y + 175);
    const gaugeG = this.add.graphics();
    gaugeG.fillStyle(THEME.colors.teakWood, 0.9);
    gaugeG.fillRoundedRect(-170, -18, 340, 36, 10);
    gaugeG.lineStyle(1.5, THEME.colors.brass, 0.85);
    gaugeG.strokeRoundedRect(-170, -18, 340, 36, 10);
    gaugeContainer.add(gaugeG);

    this.tawaTempText = this.add.text(0, 0, 'CAST IRON TAWA: 185°C • READY (CLICK TO SIZZLE)', {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      fontStyle: 'bold',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    gaugeContainer.add(this.tawaTempText);
  }

  private createNoticeBanner(width: number, height: number): void {
    const banner = this.add.container(width / 2 + 80, height - 45);

    const bgG = this.add.graphics();
    bgG.fillStyle(THEME.colors.teakWood, 0.88);
    bgG.fillRoundedRect(-310, -18, 620, 36, 8);
    bgG.lineStyle(1, THEME.colors.turmericGold, 0.6);
    bgG.strokeRoundedRect(-310, -18, 620, 36, 8);
    banner.add(bgG);

    const txt = this.add.text(
      0,
      0,
      '⚙ Architecture Ready for: Batter Ladle Drag ➔ Spiral Swirling ➔ Topping Sprinkling ➔ Spatula Fold',
      {
        fontFamily: THEME.fonts.body,
        fontSize: '11.5px',
        color: THEME.colors.creamWarmHex
      }
    ).setOrigin(0.5);
    banner.add(txt);
  }
}
