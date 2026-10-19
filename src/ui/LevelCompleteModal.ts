import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { LevelResult } from '../types/recipe';

export interface LevelCompleteConfig {
  result: LevelResult;
  onNextLevel: () => void;
  onUpgrades: () => void;
  onMenu: () => void;
}

export class LevelCompleteModal extends Phaser.GameObjects.Container {
  private backdrop: Phaser.GameObjects.Rectangle;
  private panel: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, config: LevelCompleteConfig) {
    super(scene, 0, 0);

    const { width, height } = THEME.dimensions;
    const sound = SoundFX.getInstance();
    const r = config.result;

    // Dark backdrop overlay
    this.backdrop = scene.add.rectangle(width / 2, height / 2, width, height, 0x0a0502, 0.82);
    this.backdrop.setInteractive();
    this.add(this.backdrop);

    // Modal Panel Container
    this.panel = scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const modalW = 760;
    const modalH = 550;

    // Board Graphics
    const board = scene.add.graphics();
    // Drop shadow
    board.fillStyle(0x000000, 0.6);
    board.fillRoundedRect(-modalW / 2 + 10, -modalH / 2 + 14, modalW, modalH, 22);

    // Teak Wood Frame
    board.fillStyle(THEME.colors.teakWood, 1);
    board.fillRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 22);

    // Warm Parchment Inner Board
    board.fillStyle(THEME.colors.creamWarm, 1);
    board.fillRoundedRect(-modalW / 2 + 16, -modalH / 2 + 16, modalW - 32, modalH - 32, 16);

    // Outer Brass Border
    board.lineStyle(4, THEME.colors.brass, 0.95);
    board.strokeRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 22);

    // Inner gold line
    board.lineStyle(1.5, THEME.colors.turmericGold, 0.6);
    board.strokeRoundedRect(-modalW / 2 + 8, -modalH / 2 + 8, modalW - 16, modalH - 16, 18);

    this.panel.add(board);

    // Header Toran Garland Decoration
    const garlandText = scene.add.text(0, -modalH / 2 + 30, '🌼 🌿 DAY COMPLETED! 🌿 🌼', {
      fontFamily: THEME.fonts.title,
      fontSize: '22px',
      color: THEME.colors.terracottaHex
    }).setOrigin(0.5);
    this.panel.add(garlandText);

    const subTitle = scene.add.text(0, -modalH / 2 + 62, `${r.serviceTitle.toUpperCase()} • CUSTOMERS THRILLED!`, {
      fontFamily: THEME.fonts.body,
      fontSize: '13px',
      fontStyle: 'bold',
      color: THEME.colors.teakWoodHex,
      letterSpacing: 1.5
    }).setOrigin(0.5);
    this.panel.add(subTitle);

    // 3 Golden Stars Celebration with Staggered Bounce Animation
    const starSpacing = 72;
    const starY = -modalH / 2 + 120;
    const starKeys = ['icon_star_gold', 'icon_star_gold', 'icon_star_gold'];

    for (let s = 0; s < 3; s++) {
      const starX = (s - 1) * starSpacing;
      const isEarned = s < r.starsEarned;

      const star = scene.add.image(starX, starY, isEarned ? starKeys[s] : 'icon_star_empty');
      star.setScale(0);
      this.panel.add(star);

      scene.tweens.add({
        targets: star,
        scaleX: isEarned ? 1.15 : 0.85,
        scaleY: isEarned ? 1.15 : 0.85,
        delay: 200 + s * 180,
        duration: 350,
        ease: 'Back.easeOut',
        onStart: () => {
          if (isEarned) sound.playHover();
        }
      });
    }

    // Expressive Happy Customer Portrait on Left
    const avatarX = -modalW / 2 + 130;
    const avatarY = 30;
    const avatar = scene.add.image(avatarX, avatarY, 'avatar_venkatesh');
    avatar.setScale(1.25);
    this.panel.add(avatar);

    const customerQuote = scene.add.text(
      avatarX,
      avatarY + 74,
      '"Besh! Extraordinary dosa!\nThe ghee aroma was divine!"\n— Uncle Venkatesh 🙏',
      {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
        fontStyle: 'italic',
        color: '#3E2413',
        align: 'center',
        lineSpacing: 3
      }
    ).setOrigin(0.5, 0);
    this.panel.add(customerQuote);

    // Service Breakdown Statistics Box (Right side)
    const statBoxX = 140;
    const statBoxY = 20;
    const statW = 390;
    const statH = 190;

    const statBg = scene.add.graphics();
    statBg.fillStyle(0xF3E8D4, 0.95);
    statBg.fillRoundedRect(statBoxX - statW / 2, statBoxY - statH / 2, statW, statH, 12);
    statBg.lineStyle(1.5, THEME.colors.brass, 0.6);
    statBg.strokeRoundedRect(statBoxX - statW / 2, statBoxY - statH / 2, statW, statH, 12);
    this.panel.add(statBg);

    // Stats Rows
    const rows = [
      { label: 'Customers Served:', val: `${r.customersServed} / ${r.totalCustomers} Diners`, col: THEME.colors.teakWoodHex },
      { label: 'Perfect Crispy Dosas:', val: `${r.perfectDosas} Made`, col: THEME.colors.curryGreenHex },
      { label: 'Tawa Crispiness Score:', val: `${r.crispinessScorePercent}% Golden`, col: THEME.colors.turmericGoldHex },
      { label: 'Base Tiffin Earnings:', val: `₹ ${r.baseEarnings}`, col: THEME.colors.teakWoodHex },
      { label: 'Desi Ghee Bonus Tips:', val: `+ ₹ ${r.tipsEarned}`, col: THEME.colors.curryGreenHex },
      { label: 'TOTAL TREASURY CASH:', val: `₹ ${r.totalCoins}`, col: THEME.colors.terracottaHex, bold: true }
    ];

    let rowY = statBoxY - statH / 2 + 16;
    rows.forEach(rw => {
      const lbl = scene.add.text(statBoxX - statW / 2 + 16, rowY, rw.label, {
        fontFamily: THEME.fonts.body,
        fontSize: rw.bold ? '12.5px' : '11.5px',
        fontStyle: rw.bold ? 'bold' : 'normal',
        color: rw.bold ? THEME.colors.teakWoodHex : '#5A3D28'
      });
      this.panel.add(lbl);

      const val = scene.add.text(statBoxX + statW / 2 - 16, rowY, rw.val, {
        fontFamily: THEME.fonts.title,
        fontSize: rw.bold ? '14px' : '12px',
        color: rw.col
      }).setOrigin(1, 0);
      this.panel.add(val);

      rowY += 27;
    });

    // Overall Cooking Score Badge
    const scoreBadge = scene.add.container(0, modalH / 2 - 110);
    const scoreG = scene.add.graphics();
    scoreG.fillStyle(THEME.colors.teakWood, 0.95);
    scoreG.fillRoundedRect(-150, -18, 300, 36, 10);
    scoreG.lineStyle(2, THEME.colors.turmericBright, 0.9);
    scoreG.strokeRoundedRect(-150, -18, 300, 36, 10);
    scoreBadge.add(scoreG);

    const scoreTxt = scene.add.text(0, 0, `MASTER CHEF SCORE: ${r.overallScore} PTS`, {
      fontFamily: THEME.fonts.title,
      fontSize: '14px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    scoreBadge.add(scoreTxt);
    this.panel.add(scoreBadge);

    // Action Buttons
    const btnY = modalH / 2 - 46;

    // 1. Next Day Rush Button (Primary)
    this.createActionButton(scene, 180, btnY, 'NEXT DAY RUSH ➔', true, () => {
      sound.playClick();
      this.closeModal(config.onNextLevel);
    });

    // 2. Upgrades Button
    this.createActionButton(scene, 0, btnY, '🏛️ UPGRADES', false, () => {
      sound.playClick();
      this.closeModal(config.onUpgrades);
    });

    // 3. Main Menu Button
    this.createActionButton(scene, -180, btnY, 'RECEPTION', false, () => {
      sound.playClick();
      this.closeModal(config.onMenu);
    });

    // Play Bell Chime
    sound.playBell();

    // Spawn Animation
    this.panel.setScale(0.8);
    this.panel.setAlpha(0);
    scene.tweens.add({
      targets: this.panel,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 250,
      ease: 'Back.easeOut'
    });

    scene.add.existing(this);
  }

  private createActionButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    isPrimary: boolean,
    onClick: () => void
  ): void {
    const btn = scene.add.container(x, y);
    const bg = scene.add.graphics();

    const w = 155;
    const h = 40;

    if (isPrimary) {
      bg.fillStyle(THEME.colors.terracotta, 1);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(2, THEME.colors.brassBright, 1);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    } else {
      bg.fillStyle(THEME.colors.teakWood, 0.95);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(1.5, THEME.colors.brass, 0.8);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    }
    btn.add(bg);

    const txt = scene.add.text(0, 0, text, {
      fontFamily: THEME.fonts.title,
      fontSize: '12px',
      color: isPrimary ? THEME.colors.creamHex : THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    btn.add(txt);

    btn.setSize(w, h);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => {
      btn.setScale(1.06);
    });
    btn.on('pointerout', () => {
      btn.setScale(1.0);
    });
    btn.on('pointerdown', onClick);

    this.panel.add(btn);
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
