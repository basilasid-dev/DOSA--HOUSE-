import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { Recipe, CustomerOrder } from '../types/recipe';
import { DosaCookingQuality } from '../mechanics/DosaSurface';

export interface QualityReviewConfig {
  recipe: Recipe;
  customerOrder?: CustomerOrder;
  quality: DosaCookingQuality;
  onCookNext: () => void;
  onViewRecipeBook?: () => void;
}

export class QualityReviewModal extends Phaser.GameObjects.Container {
  private backdrop: Phaser.GameObjects.Rectangle;
  private panel: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, config: QualityReviewConfig) {
    super(scene, 0, 0);

    const { width, height } = THEME.dimensions;
    const sound = SoundFX.getInstance();
    const q = config.quality;
    const rec = config.recipe;
    const ord = config.customerOrder;

    this.setDepth(150);

    // 1. Semi-transparent backdrop overlay
    this.backdrop = scene.add.rectangle(width / 2, height / 2, width, height, 0x0a0502, 0.84);
    this.backdrop.setInteractive();
    this.add(this.backdrop);

    // 2. Modal Panel Container
    this.panel = scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const modalW = 680;
    const modalH = 520;

    // Outer Drop Shadow
    const shadow = scene.add.graphics();
    shadow.fillStyle(0x000000, 0.65);
    shadow.fillRoundedRect(-modalW / 2 + 10, -modalH / 2 + 14, modalW, modalH, 20);
    this.panel.add(shadow);

    // Main Teak Wood Frame
    const board = scene.add.graphics();
    board.fillStyle(THEME.colors.teakWood, 1.0);
    board.fillRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Warm Parchment Inner Plate
    board.fillStyle(THEME.colors.creamWarm, 1.0);
    board.fillRoundedRect(-modalW / 2 + 14, -modalH / 2 + 14, modalW - 28, modalH - 28, 14);

    // Traditional Brass Border
    board.lineStyle(3.5, THEME.colors.brass, 0.95);
    board.strokeRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Delicate inner gold border
    board.lineStyle(1.2, THEME.colors.turmericGold, 0.6);
    board.strokeRoundedRect(-modalW / 2 + 8, -modalH / 2 + 8, modalW - 16, modalH - 16, 17);

    this.panel.add(board);

    // Header Toran Garland
    const garland = scene.add.text(0, -modalH / 2 + 28, '🌼 🌿 DOSA SERVED FRESH! 🌿 🌼', {
      fontFamily: THEME.fonts.title,
      fontSize: '20px',
      color: THEME.colors.terracottaHex
    }).setOrigin(0.5);
    this.panel.add(garland);

    // Dish Title & Tamil name
    const titleText = scene.add.text(0, -modalH / 2 + 58, `${rec.name.toUpperCase()}  •  ${rec.tamilName}`, {
      fontFamily: THEME.fonts.title,
      fontSize: '15px',
      color: THEME.colors.teakWoodHex
    }).setOrigin(0.5);
    this.panel.add(titleText);

    if (ord) {
      const orderSubtitle = scene.add.text(0, -modalH / 2 + 80, `ORDER FOR ${ord.customerName.toUpperCase()} (TABLE #${ord.tableNumber})`, {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
        fontStyle: 'bold',
        color: THEME.colors.brassDarkHex,
        letterSpacing: 1.2
      }).setOrigin(0.5);
      this.panel.add(orderSubtitle);
    }

    // Golden Stars Celebration with Staggered Scale Animation
    const starSpacing = 60;
    const starY = -modalH / 2 + 118;
    for (let s = 0; s < 3; s++) {
      const starX = (s - 1) * starSpacing;
      const isEarned = s < q.stars;
      const star = scene.add.image(starX, starY, isEarned ? 'icon_star_gold' : 'icon_star_empty');
      star.setScale(0);
      this.panel.add(star);

      scene.tweens.add({
        targets: star,
        scaleX: isEarned ? 1.05 : 0.8,
        scaleY: isEarned ? 1.05 : 0.8,
        delay: 200 + s * 160,
        duration: 320,
        ease: 'Back.easeOut',
        onStart: () => {
          if (isEarned) sound.playHover();
        }
      });
    }

    // Overall Grade & Score Badge
    const gradeBadge = scene.add.text(0, -modalH / 2 + 162, `★ ${q.overallScore}%  —  ${q.gradeTitle.toUpperCase()} ★`, {
      fontFamily: THEME.fonts.title,
      fontSize: '14px',
      fontStyle: 'bold',
      color: q.overallScore >= 80 ? THEME.colors.curryGreenHex : THEME.colors.terracottaHex
    }).setOrigin(0.5);
    this.panel.add(gradeBadge);

    // 4 Cooking Quality Dimension Bars
    const metrics = [
      { label: '🍳 Crispiness & Roast Heat', score: q.crispinessScore, color: THEME.colors.turmericGold },
      { label: '🧈 Pure Desi Ghee & Aroma', score: q.gheeScore, color: THEME.colors.turmeric },
      { label: '🥔 Toppings & Spiced Filling', score: q.toppingsScore, color: THEME.colors.curryGreen },
      { label: '📐 Traditional Fold & Plating', score: q.foldScore, color: THEME.colors.terracotta }
    ];

    const startBarY = -modalH / 2 + 200;
    const barSpacing = 42;
    const barWidth = 360;

    metrics.forEach((m, idx) => {
      const y = startBarY + idx * barSpacing;

      // Metric Label & Score Number
      const labelTxt = scene.add.text(-modalW / 2 + 50, y, m.label, {
        fontFamily: THEME.fonts.body,
        fontSize: '12px',
        fontStyle: 'bold',
        color: THEME.colors.teakWoodHex
      });
      this.panel.add(labelTxt);

      const scoreNum = scene.add.text(modalW / 2 - 50, y, `${m.score}%`, {
        fontFamily: THEME.fonts.body,
        fontSize: '12px',
        fontStyle: 'bold',
        color: m.score >= 80 ? THEME.colors.curryGreenHex : THEME.colors.terracottaHex
      }).setOrigin(1, 0);
      this.panel.add(scoreNum);

      // Track Bar Background
      const track = scene.add.graphics();
      track.fillStyle(THEME.colors.creamDark, 0.9);
      track.fillRoundedRect(-modalW / 2 + 50, y + 18, barWidth + 180, 10, 5);
      track.lineStyle(1, THEME.colors.brass, 0.4);
      track.strokeRoundedRect(-modalW / 2 + 50, y + 18, barWidth + 180, 10, 5);
      this.panel.add(track);

      // Filled Progress Bar (animated)
      const fillBar = scene.add.graphics();
      this.panel.add(fillBar);

      const fullWidth = barWidth + 180;
      const targetWidth = Math.max(8, (m.score / 100) * fullWidth);

      const dummy = { w: 0 };
      scene.tweens.add({
        targets: dummy,
        w: targetWidth,
        duration: 600 + idx * 100,
        ease: 'Cubic.easeOut',
        onUpdate: () => {
          fillBar.clear();
          fillBar.fillStyle(m.color, 0.95);
          fillBar.fillRoundedRect(-modalW / 2 + 50, y + 18, dummy.w, 10, 5);
        }
      });
    });

    // Feedback Badges / Summary
    const notesY = startBarY + metrics.length * barSpacing + 10;
    const notesBox = scene.add.graphics();
    notesBox.fillStyle(THEME.colors.creamDark, 0.45);
    notesBox.fillRoundedRect(-modalW / 2 + 45, notesY, modalW - 90, 42, 8);
    notesBox.lineStyle(1, THEME.colors.brass, 0.4);
    notesBox.strokeRoundedRect(-modalW / 2 + 45, notesY, modalW - 90, 42, 8);
    this.panel.add(notesBox);

    const feedbackStr = q.feedbackNotes.slice(0, 3).join('  •  ');
    const feedbackText = scene.add.text(0, notesY + 21, feedbackStr || '✓ Freshly baked on hot seasoned cast iron', {
      fontFamily: THEME.fonts.body,
      fontSize: '11px',
      color: THEME.colors.teakWoodHex
    }).setOrigin(0.5);
    this.panel.add(feedbackText);

    // Coins Award Banner
    const coinsY = notesY + 54;
    const coinsBanner = scene.add.text(0, coinsY, `💰 EARNED REWARD: ₹ ${q.earnedCoins} (ADDED TO REGISTER)`, {
      fontFamily: THEME.fonts.title,
      fontSize: '13.5px',
      color: THEME.colors.turmericGoldHex
    }).setOrigin(0.5);
    this.panel.add(coinsBanner);

    // Action Buttons: [🍳 COOK NEXT DOSA] & [📖 RECIPE BOOK]
    const btnY = modalH / 2 - 38;

    // 1. Cook Next Dosa Button (Primary)
    const nextBtn = scene.add.container(-85, btnY);
    const nextBg = scene.add.graphics();
    nextBg.fillStyle(THEME.colors.terracotta, 1.0);
    nextBg.fillRoundedRect(-110, -18, 220, 36, 8);
    nextBg.lineStyle(2, THEME.colors.brassBright, 0.9);
    nextBg.strokeRoundedRect(-110, -18, 220, 36, 8);
    nextBtn.add(nextBg);

    const nextTxt = scene.add.text(0, 0, '🍳 COOK NEXT DOSA', {
      fontFamily: THEME.fonts.title,
      fontSize: '12.5px',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    nextBtn.add(nextTxt);

    nextBtn.setSize(220, 36);
    nextBtn.setInteractive({ useHandCursor: true });
    nextBtn.on('pointerdown', () => {
      sound.playClick();
      this.closeModal(config.onCookNext);
    });
    this.panel.add(nextBtn);

    // 2. View Recipes Button
    const bookBtn = scene.add.container(145, btnY);
    const bookBg = scene.add.graphics();
    bookBg.fillStyle(THEME.colors.teakWood, 0.9);
    bookBg.fillRoundedRect(-85, -18, 170, 36, 8);
    bookBg.lineStyle(1.5, THEME.colors.brass, 0.8);
    bookBg.strokeRoundedRect(-85, -18, 170, 36, 8);
    bookBtn.add(bookBg);

    const bookTxt = scene.add.text(0, 0, '📖 RECIPES', {
      fontFamily: THEME.fonts.title,
      fontSize: '12px',
      color: THEME.colors.creamHex
    }).setOrigin(0.5);
    bookBtn.add(bookTxt);

    bookBtn.setSize(170, 36);
    bookBtn.setInteractive({ useHandCursor: true });
    bookBtn.on('pointerdown', () => {
      sound.playClick();
      this.closeModal(() => {
        config.onViewRecipeBook?.();
      });
    });
    this.panel.add(bookBtn);

    // Panel Entrance Tween
    this.panel.setScale(0.8);
    this.panel.setAlpha(0);
    scene.tweens.add({
      targets: this.panel,
      scaleX: 1.0,
      scaleY: 1.0,
      alpha: 1.0,
      duration: 280,
      ease: 'Back.easeOut'
    });

    // Sound Fanfare on Review Show
    sound.playBell();
    scene.add.existing(this);
  }

  private closeModal(onDone?: () => void): void {
    this.scene.tweens.add({
      targets: this.panel,
      scaleX: 0.85,
      scaleY: 0.85,
      alpha: 0,
      duration: 180,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.destroy();
        onDone?.();
      }
    });
  }
}
