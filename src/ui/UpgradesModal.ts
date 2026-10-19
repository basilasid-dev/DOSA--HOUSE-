import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { UpgradeService } from '../services/UpgradeService';
import { RestaurantUpgrade } from '../types/recipe';

export class UpgradesModal extends Phaser.GameObjects.Container {
  private backdrop: Phaser.GameObjects.Rectangle;
  private panel: Phaser.GameObjects.Container;
  private currentCategory: 'kitchen' | 'ambiance' = 'kitchen';
  private cardsContainer: Phaser.GameObjects.Container;
  private coinText: Phaser.GameObjects.Text;
  private kitchenTabBtn: Phaser.GameObjects.Container;
  private decorTabBtn: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onClose: () => void) {
    super(scene, 0, 0);

    const { width, height } = THEME.dimensions;
    const upgradeService = UpgradeService.getInstance();

    // Dark backdrop overlay
    this.backdrop = scene.add.rectangle(width / 2, height / 2, width, height, 0x0a0502, 0.78);
    this.backdrop.setInteractive();
    this.add(this.backdrop);

    // Modal Panel
    this.panel = scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const modalW = 1040;
    const modalH = 590;

    // Panel Board Graphics
    const board = scene.add.graphics();
    // Shadow
    board.fillStyle(0x000000, 0.55);
    board.fillRoundedRect(-modalW / 2 + 10, -modalH / 2 + 14, modalW, modalH, 20);

    // Teak Wood Base
    board.fillStyle(THEME.colors.teakWood, 1);
    board.fillRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Parchment Inner Board
    board.fillStyle(THEME.colors.creamWarm, 1);
    board.fillRoundedRect(-modalW / 2 + 16, -modalH / 2 + 16, modalW - 32, modalH - 32, 14);

    // Outer Brass Border
    board.lineStyle(4, THEME.colors.brass, 0.95);
    board.strokeRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Inner gold trim
    board.lineStyle(1.5, THEME.colors.turmericGold, 0.6);
    board.strokeRoundedRect(-modalW / 2 + 8, -modalH / 2 + 8, modalW - 16, modalH - 16, 16);

    this.panel.add(board);

    // Header Title
    const title = scene.add.text(-modalW / 2 + 32, -modalH / 2 + 30, 'RESTAURANT UPGRADES & HERITAGE DECOR', {
      fontFamily: THEME.fonts.title,
      fontSize: '26px',
      color: THEME.colors.teakWoodHex
    });
    this.panel.add(title);

    const sub = scene.add.text(-modalW / 2 + 32, -modalH / 2 + 62, 'Invest in artisanal equipment and traditional Chettinad dining charm', {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      color: THEME.colors.terracottaHex
    });
    this.panel.add(sub);

    // Player Treasury Coin Badge
    const coinBadge = scene.add.container(modalW / 2 - 190, -modalH / 2 + 42);
    const coinBg = scene.add.graphics();
    coinBg.fillStyle(THEME.colors.teakWood, 0.95);
    coinBg.fillRoundedRect(-95, -18, 190, 36, 10);
    coinBg.lineStyle(2, THEME.colors.turmericGold, 0.9);
    coinBg.strokeRoundedRect(-95, -18, 190, 36, 10);
    coinBadge.add(coinBg);

    this.coinText = scene.add.text(0, 0, `💰 CASH: ₹ ${upgradeService.getCoins()}`, {
      fontFamily: THEME.fonts.title,
      fontSize: '15px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    coinBadge.add(this.coinText);
    this.panel.add(coinBadge);

    // Close Button
    const closeBtn = scene.add.image(modalW / 2 - 32, -modalH / 2 + 32, 'icon_close');
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setScale(1.15));
    closeBtn.on('pointerout', () => closeBtn.setScale(1.0));
    closeBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.closeModal(onClose);
    });
    this.panel.add(closeBtn);

    // Category Tabs: Kitchen vs Ambiance
    this.kitchenTabBtn = this.createTabButton(scene, -180, -modalH / 2 + 105, '🍳 KITCHEN EQUIPMENT', true, () => {
      this.switchTab('kitchen');
    });
    this.panel.add(this.kitchenTabBtn);

    this.decorTabBtn = this.createTabButton(scene, 180, -modalH / 2 + 105, '🪔 RESTAURANT AMBIANCE & DECOR', false, () => {
      this.switchTab('ambiance');
    });
    this.panel.add(this.decorTabBtn);

    // Cards Grid Container
    this.cardsContainer = scene.add.container(-modalW / 2 + 32, -modalH / 2 + 135);
    this.panel.add(this.cardsContainer);

    this.renderUpgradeCards(scene);

    // Spawn Animation
    this.panel.setScale(0.85);
    this.panel.setAlpha(0);
    scene.tweens.add({
      targets: this.panel,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 220,
      ease: 'Back.easeOut'
    });

    scene.add.existing(this);
  }

  private createTabButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    isActive: boolean,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const tab = scene.add.container(x, y);
    const bg = scene.add.graphics();
    this.drawTabBg(bg, isActive);
    tab.add(bg);

    const txt = scene.add.text(0, 0, label, {
      fontFamily: THEME.fonts.title,
      fontSize: '13px',
      color: isActive ? THEME.colors.turmericBrightHex : THEME.colors.creamHex
    }).setOrigin(0.5);
    tab.add(txt);

    tab.setSize(330, 34);
    tab.setInteractive({ useHandCursor: true });
    tab.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      onClick();
    });

    return tab;
  }

  private drawTabBg(g: Phaser.GameObjects.Graphics, isActive: boolean): void {
    g.clear();
    if (isActive) {
      g.fillStyle(THEME.colors.teakWood, 1);
      g.fillRoundedRect(-165, -17, 330, 34, 8);
      g.lineStyle(2, THEME.colors.turmericGold, 1);
      g.strokeRoundedRect(-165, -17, 330, 34, 8);
    } else {
      g.fillStyle(0x73482C, 0.85);
      g.fillRoundedRect(-165, -17, 330, 34, 8);
      g.lineStyle(1.5, THEME.colors.brass, 0.5);
      g.strokeRoundedRect(-165, -17, 330, 34, 8);
    }
  }

  private switchTab(category: 'kitchen' | 'ambiance'): void {
    if (this.currentCategory === category) return;
    this.currentCategory = category;

    const kBg = this.kitchenTabBtn.getAt(0) as Phaser.GameObjects.Graphics;
    const kTxt = this.kitchenTabBtn.getAt(1) as Phaser.GameObjects.Text;
    const dBg = this.decorTabBtn.getAt(0) as Phaser.GameObjects.Graphics;
    const dTxt = this.decorTabBtn.getAt(1) as Phaser.GameObjects.Text;

    const isKitchen = category === 'kitchen';
    this.drawTabBg(kBg, isKitchen);
    kTxt.setColor(isKitchen ? THEME.colors.turmericBrightHex : THEME.colors.creamHex);

    this.drawTabBg(dBg, !isKitchen);
    dTxt.setColor(!isKitchen ? THEME.colors.turmericBrightHex : THEME.colors.creamHex);

    this.renderUpgradeCards(this.scene);
  }

  private renderUpgradeCards(scene: Phaser.Scene): void {
    this.cardsContainer.removeAll(true);
    const upgradeService = UpgradeService.getInstance();
    const upgrades = upgradeService.getAllUpgrades().filter(u => u.category === this.currentCategory);

    const cardW = 475;
    const cardH = 195;
    const gapX = 25;
    const gapY = 16;

    upgrades.forEach((up, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const cx = col * (cardW + gapX);
      const cy = row * (cardH + gapY);

      const card = scene.add.container(cx, cy);

      // Card Background
      const bg = scene.add.graphics();
      bg.fillStyle(0xF3E8D4, 0.95);
      bg.fillRoundedRect(0, 0, cardW, cardH, 12);
      bg.lineStyle(1.5, THEME.colors.brass, 0.6);
      bg.strokeRoundedRect(0, 0, cardW, cardH, 12);
      card.add(bg);

      // Icon Box
      const iconBox = scene.add.graphics();
      iconBox.fillStyle(THEME.colors.teakWood, 1);
      iconBox.fillRoundedRect(16, 16, 52, 52, 10);
      iconBox.lineStyle(1.5, THEME.colors.brassBright, 0.9);
      iconBox.strokeRoundedRect(16, 16, 52, 52, 10);
      card.add(iconBox);

      const iconTxt = scene.add.text(42, 42, up.icon, {
        fontSize: '26px'
      }).setOrigin(0.5);
      card.add(iconTxt);

      // Title & Tamil Name
      const title = scene.add.text(80, 16, up.name, {
        fontFamily: THEME.fonts.title,
        fontSize: '16px',
        color: THEME.colors.teakWoodHex
      });
      card.add(title);

      const subTitle = scene.add.text(80, 38, up.tamilName, {
        fontFamily: THEME.fonts.body,
        fontSize: '11.5px',
        fontStyle: 'bold',
        color: THEME.colors.terracottaHex
      });
      card.add(subTitle);

      // Description
      const desc = scene.add.text(16, 76, up.description, {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
        color: '#4A3423',
        wordWrap: { width: cardW - 32 },
        lineSpacing: 2
      });
      card.add(desc);

      // Benefit / Effect Banner
      const effectBg = scene.add.graphics();
      effectBg.fillStyle(THEME.colors.curryGreen, 0.1);
      effectBg.fillRoundedRect(16, 116, cardW - 32, 28, 6);
      effectBg.lineStyle(1, THEME.colors.curryGreen, 0.35);
      effectBg.strokeRoundedRect(16, 116, cardW - 32, 28, 6);
      card.add(effectBg);

      const effectTxt = scene.add.text(26, 122, `✨ ${up.effectDescription}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '10.5px',
        fontStyle: 'bold',
        color: THEME.colors.curryGreenHex
      });
      card.add(effectTxt);

      // Level Progress Dots
      const dotsY = 164;
      const dotsText = scene.add.text(18, dotsY, `TIER: ${up.currentLevel} / ${up.maxLevel}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
        fontStyle: 'bold',
        color: THEME.colors.teakWoodHex
      });
      card.add(dotsText);

      // Level indicator pips
      for (let p = 0; p < up.maxLevel; p++) {
        const isFilled = p < up.currentLevel;
        const pip = scene.add.graphics();
        pip.fillStyle(isFilled ? THEME.colors.turmericGold : 0xCCCCCC, 1);
        pip.fillCircle(110 + p * 14, dotsY + 7, 5);
        if (isFilled) {
          pip.lineStyle(1, THEME.colors.brassBright, 1);
          pip.strokeCircle(110 + p * 14, dotsY + 7, 5);
        }
        card.add(pip);
      }

      // Upgrade / Buy Button
      const btnX = cardW - 130;
      const btnY = 164;
      const isMaxed = up.currentLevel >= up.maxLevel;
      const nextCost = isMaxed ? 0 : up.costs[up.currentLevel];
      const canAfford = !isMaxed && upgradeService.getCoins() >= nextCost;

      const btnContainer = scene.add.container(btnX, btnY);
      const btnBg = scene.add.graphics();

      let btnLabel = '';
      if (isMaxed) {
        btnBg.fillStyle(THEME.colors.curryGreen, 1);
        btnBg.fillRoundedRect(-60, -14, 120, 28, 6);
        btnLabel = 'MAX TIER ★';
      } else if (canAfford) {
        btnBg.fillStyle(THEME.colors.terracotta, 1);
        btnBg.fillRoundedRect(-60, -14, 120, 28, 6);
        btnBg.lineStyle(1.5, THEME.colors.brassBright, 1);
        btnBg.strokeRoundedRect(-60, -14, 120, 28, 6);
        btnLabel = `BUY • ₹ ${nextCost}`;
      } else {
        btnBg.fillStyle(0x9E9E9E, 0.85);
        btnBg.fillRoundedRect(-60, -14, 120, 28, 6);
        btnLabel = `NEED ₹ ${nextCost}`;
      }
      btnContainer.add(btnBg);

      const btnTxt = scene.add.text(0, 0, btnLabel, {
        fontFamily: THEME.fonts.title,
        fontSize: '11px',
        color: THEME.colors.creamHex
      }).setOrigin(0.5);
      btnContainer.add(btnTxt);

      if (canAfford) {
        btnContainer.setSize(120, 28);
        btnContainer.setInteractive({ useHandCursor: true });
        btnContainer.on('pointerdown', () => {
          SoundFX.getInstance().playBell();
          if (upgradeService.purchaseUpgrade(up.id)) {
            this.coinText.setText(`💰 CASH: ₹ ${upgradeService.getCoins()}`);
            this.renderUpgradeCards(scene);
          }
        });
        btnContainer.on('pointerover', () => btnContainer.setScale(1.05));
        btnContainer.on('pointerout', () => btnContainer.setScale(1.0));
      }

      card.add(btnContainer);
      this.cardsContainer.add(card);
    });
  }

  private closeModal(onClose: () => void): void {
    this.scene.tweens.add({
      targets: this.panel,
      scaleX: 0.85,
      scaleY: 0.85,
      alpha: 0,
      duration: 180,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.destroy();
        onClose();
      }
    });
  }
}
