import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { UpgradeService } from '../services/UpgradeService';
import { LevelDefinition } from '../types/recipe';

export class LevelSelectModal extends Phaser.GameObjects.Container {
  private backdrop: Phaser.GameObjects.Rectangle;
  private panel: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onSelectLevel: (day: number) => void, onClose: () => void) {
    super(scene, 0, 0);

    const { width, height } = THEME.dimensions;
    const upgradeService = UpgradeService.getInstance();
    const levels = upgradeService.getAllLevels();
    const sound = SoundFX.getInstance();

    this.setDepth(150);

    // Dark backdrop overlay
    this.backdrop = scene.add.rectangle(width / 2, height / 2, width, height, 0x0a0502, 0.82);
    this.backdrop.setInteractive();
    this.add(this.backdrop);

    // Modal Panel
    this.panel = scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const modalW = 980;
    const modalH = 580;

    // Drop Shadow
    const shadow = scene.add.graphics();
    shadow.fillStyle(0x000000, 0.6);
    shadow.fillRoundedRect(-modalW / 2 + 10, -modalH / 2 + 14, modalW, modalH, 20);
    this.panel.add(shadow);

    // Teak Wood Frame
    const board = scene.add.graphics();
    board.fillStyle(THEME.colors.teakWood, 1);
    board.fillRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Parchment Inner Board
    board.fillStyle(THEME.colors.creamWarm, 1);
    board.fillRoundedRect(-modalW / 2 + 16, -modalH / 2 + 16, modalW - 32, modalH - 32, 14);

    // Brass Outer Border
    board.lineStyle(4, THEME.colors.brass, 0.95);
    board.strokeRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Gold Trim
    board.lineStyle(1.5, THEME.colors.turmericGold, 0.6);
    board.strokeRoundedRect(-modalW / 2 + 8, -modalH / 2 + 8, modalW - 16, modalH - 16, 16);

    this.panel.add(board);

    // Header Title
    const title = scene.add.text(0, -modalH / 2 + 35, 'SELECT SERVICE DAY • RESTAURANT PROGRESSION', {
      fontFamily: THEME.fonts.title,
      fontSize: '24px',
      color: THEME.colors.teakWoodHex
    }).setOrigin(0.5);
    this.panel.add(title);

    const sub = scene.add.text(0, -modalH / 2 + 64, 'Serve diners, achieve master chef scores, and unlock new heritage recipes', {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      color: THEME.colors.terracottaHex
    }).setOrigin(0.5);
    this.panel.add(sub);

    // Close Button
    const closeBtn = scene.add.image(modalW / 2 - 32, -modalH / 2 + 32, 'icon_close');
    closeBtn.setDisplaySize(38, 38);
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setScale(1.15));
    closeBtn.on('pointerout', () => closeBtn.setScale(1.0));
    closeBtn.on('pointerdown', () => {
      sound.playClick();
      this.closeModal(onClose);
    });
    this.panel.add(closeBtn);

    // Level Cards Layout (5 Days in grid: 3 on top row, 2 on bottom row)
    const cardW = 280;
    const cardH = 195;
    const startY = -modalH / 2 + 100;

    levels.forEach((lvl, idx) => {
      const isUnlocked = upgradeService.isLevelUnlocked(lvl.day);
      const starsEarned = upgradeService.getStarsForDay(lvl.day);
      const highScore = upgradeService.getHighScoreForDay(lvl.day);

      // Row & Column positioning
      let cx = 0;
      let cy = 0;
      if (idx < 3) {
        cx = -300 + idx * 300;
        cy = startY + cardH / 2;
      } else {
        cx = -150 + (idx - 3) * 300;
        cy = startY + cardH + 20 + cardH / 2;
      }

      const card = scene.add.container(cx, cy);

      // Card Background
      const cardBg = scene.add.graphics();
      if (isUnlocked) {
        cardBg.fillStyle(0xF7EFE0, 1);
        cardBg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 12);
        cardBg.lineStyle(2, THEME.colors.brass, 0.85);
        cardBg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 12);
      } else {
        cardBg.fillStyle(0xE0D6C4, 0.8);
        cardBg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 12);
        cardBg.lineStyle(1.5, 0x998877, 0.6);
        cardBg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 12);
      }
      card.add(cardBg);

      // Day Header & Badge
      const dayHeader = scene.add.text(-cardW / 2 + 16, -cardH / 2 + 14, `DAY ${lvl.day}`, {
        fontFamily: THEME.fonts.title,
        fontSize: '15px',
        color: isUnlocked ? THEME.colors.terracottaHex : '#887766'
      });
      card.add(dayHeader);

      // Stars Display
      const starSpacing = 18;
      for (let s = 0; s < 3; s++) {
        const starX = cardW / 2 - 48 + s * starSpacing;
        const starY = -cardH / 2 + 20;
        const isStarEarned = s < starsEarned;
        const star = scene.add.image(starX, starY, isStarEarned ? 'icon_star_gold' : 'icon_star_empty');
        star.setScale(0.35);
        card.add(star);
      }

      // Title & Tagline
      const titleTxt = scene.add.text(-cardW / 2 + 16, -cardH / 2 + 35, lvl.serviceTitle.toUpperCase(), {
        fontFamily: THEME.fonts.title,
        fontSize: '11.5px',
        color: isUnlocked ? THEME.colors.teakWoodHex : '#665544'
      });
      card.add(titleTxt);

      const tagTxt = scene.add.text(-cardW / 2 + 16, -cardH / 2 + 54, lvl.tagline, {
        fontFamily: THEME.fonts.body,
        fontSize: '9.5px',
        color: '#4B3525',
        wordWrap: { width: cardW - 32 },
        lineSpacing: 1.5
      });
      card.add(tagTxt);

      // Goals Box
      const goalsBg = scene.add.graphics();
      goalsBg.fillStyle(isUnlocked ? THEME.colors.teakWood : 0x776655, 0.08);
      goalsBg.fillRoundedRect(-cardW / 2 + 12, -cardH / 2 + 96, cardW - 24, 48, 6);
      card.add(goalsBg);

      const dinersGoal = scene.add.text(-cardW / 2 + 18, -cardH / 2 + 101, `👥 Diners: ${lvl.requiredCustomers} Required`, {
        fontFamily: THEME.fonts.body,
        fontSize: '9.5px',
        fontStyle: 'bold',
        color: THEME.colors.teakWoodHex
      });
      card.add(dinersGoal);

      const scoreGoal = scene.add.text(-cardW / 2 + 18, -cardH / 2 + 116, `🎯 Target Score: ${lvl.targetScore} Pts`, {
        fontFamily: THEME.fonts.body,
        fontSize: '9.5px',
        color: THEME.colors.terracottaHex
      });
      card.add(scoreGoal);

      const bestTxt = scene.add.text(-cardW / 2 + 18, -cardH / 2 + 130, `🏆 Best Score: ${highScore > 0 ? highScore : '—'}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '9px',
        color: THEME.colors.curryGreenHex
      });
      card.add(bestTxt);

      // Action Button: Start Service or Locked
      const btnY = cardH / 2 - 22;
      const btnContainer = scene.add.container(0, btnY);

      if (isUnlocked) {
        card.setSize(cardW, cardH);
        card.setInteractive({ useHandCursor: true });
        card.on('pointerdown', () => {
          sound.playClick();
          this.closeModal(() => {
            onSelectLevel(lvl.day);
          });
        });

        const btnBg = scene.add.graphics();
        btnBg.fillStyle(THEME.colors.terracotta, 1);
        btnBg.fillRoundedRect(-70, -15, 140, 30, 7);
        btnBg.lineStyle(1.4, THEME.colors.brassBright, 1);
        btnBg.strokeRoundedRect(-70, -15, 140, 30, 7);
        btnContainer.add(btnBg);

        const btnTxt = scene.add.text(0, 0, 'START SERVICE ➔', {
          fontFamily: THEME.fonts.title,
          fontSize: '11px',
          color: THEME.colors.creamHex
        }).setOrigin(0.5);
        btnContainer.add(btnTxt);

        btnContainer.setSize(140, 30);
        btnContainer.setInteractive({ useHandCursor: true });
        btnContainer.on('pointerdown', () => {
          sound.playClick();
          this.closeModal(() => {
            onSelectLevel(lvl.day);
          });
        });
        btnContainer.on('pointerover', () => btnContainer.setScale(1.06));
        btnContainer.on('pointerout', () => btnContainer.setScale(1.0));
      } else {
        const lockBg = scene.add.graphics();
        lockBg.fillStyle(0x887766, 0.7);
        lockBg.fillRoundedRect(-70, -13, 140, 26, 6);
        btnContainer.add(lockBg);

        const lockTxt = scene.add.text(0, 0, `🔒 COMPLETE DAY ${lvl.day - 1}`, {
          fontFamily: THEME.fonts.body,
          fontSize: '9px',
          fontStyle: 'bold',
          color: '#EFEFEF'
        }).setOrigin(0.5);
        btnContainer.add(lockTxt);
      }

      card.add(btnContainer);
      this.panel.add(card);
    });

    // Panel Entrance
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

  private closeModal(onDone?: () => void): void {
    this.scene.tweens.add({
      targets: this.panel,
      scaleX: 0.85,
      scaleY: 0.85,
      alpha: 0,
      duration: 180,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.destroy();
        onDone?.();
      }
    });
  }
}
