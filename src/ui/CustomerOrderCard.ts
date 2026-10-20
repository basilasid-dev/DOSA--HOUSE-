import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { CustomerOrder, CustomerMood } from '../types/recipe';

export class CustomerOrderCard extends Phaser.GameObjects.Container {
  private order: CustomerOrder;
  private isSelected: boolean = false;
  private isDropTarget: boolean = false;
  private highlightG: Phaser.GameObjects.Graphics;
  private dropGlowG: Phaser.GameObjects.Graphics;
  private patienceBar: Phaser.GameObjects.Graphics;
  private moodText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private statusBadgeText?: Phaser.GameObjects.Text;
  private statusBadgeG?: Phaser.GameObjects.Graphics;
  private patienceTimer?: Phaser.Time.TimerEvent;
  private cardWidth: number = 275;
  private cardHeight: number = 128;
  private onSelectCb: () => void;
  private onAcceptCb?: () => void;
  private onTimeoutCb?: (order: CustomerOrder) => void;
  private onServeCb?: (order: CustomerOrder) => void;
  private speechContainer?: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    order: CustomerOrder,
    isSelected: boolean,
    onSelect: () => void,
    onAccept?: () => void,
    onTimeout?: (order: CustomerOrder) => void,
    onServe?: (order: CustomerOrder) => void
  ) {
    super(scene, x, y);
    this.order = order;
    this.isSelected = isSelected;
    this.onSelectCb = onSelect;
    this.onAcceptCb = onAccept;
    this.onTimeoutCb = onTimeout;
    this.onServeCb = onServe;

    const cardW = this.cardWidth;
    const cardH = this.cardHeight;

    // 1. Aged Ivory Paper Card Base
    const cardBg = scene.add.image(0, 0, 'ui_order_ticket_card');
    cardBg.setDisplaySize(cardW, cardH);
    this.add(cardBg);

    // 2. Selection & Drop Target Glow Borders
    this.highlightG = scene.add.graphics();
    this.add(this.highlightG);

    this.dropGlowG = scene.add.graphics();
    this.add(this.dropGlowG);
    this.drawHighlight();

    // 3. Brass Hanging Clip on Top
    const clip = scene.add.graphics();
    clip.fillStyle(THEME.colors.brass, 1);
    clip.fillRect(-12, -cardH / 2 - 4, 24, 12);
    clip.fillStyle(THEME.colors.brassBright, 1);
    clip.fillCircle(0, -cardH / 2 + 1, 4);
    this.add(clip);

    // 4. Expressive Customer Avatar (Top-Left)
    const avatarX = -cardW / 2 + 38;
    const avatarY = -24;
    const avatarImg = scene.add.image(avatarX, avatarY, order.avatarKey);
    avatarImg.setDisplaySize(50, 50);
    this.add(avatarImg);

    // Mood Emote indicator over avatar
    const moodIcon = order.mood === 'happy' ? '😊' : order.mood === 'neutral' ? '😐' : '😟';
    this.moodText = scene.add.text(avatarX + 18, avatarY - 18, moodIcon, {
      fontSize: '13px'
    }).setOrigin(0.5);
    this.add(this.moodText);

    // 5. Dish Photo Thumbnail (Next to Avatar)
    const dishX = -cardW / 2 + 96;
    const dishY = -24;
    const dishW = 50;
    const dishH = 46;

    const dishImg = scene.add.image(dishX, dishY, order.dishImageKey);
    dishImg.setDisplaySize(dishW, dishH);
    this.add(dishImg);

    const dishBorder = scene.add.graphics();
    dishBorder.lineStyle(1.5, THEME.colors.brass, 0.85);
    dishBorder.strokeRect(dishX - dishW / 2, dishY - dishH / 2, dishW, dishH);
    this.add(dishBorder);

    // 6. Header: Table number & Customer Name
    const header = scene.add.text(-cardW / 2 + 130, -cardH / 2 + 14, `T-${order.tableNumber} • ${order.customerName}`, {
      fontFamily: THEME.fonts.body,
      fontSize: '10.5px',
      fontStyle: 'bold',
      color: THEME.colors.terracottaHex
    });
    this.add(header);

    // 7. Dish Title
    const title = scene.add.text(-cardW / 2 + 130, -cardH / 2 + 28, order.recipeName.toUpperCase(), {
      fontFamily: THEME.fonts.title,
      fontSize: '12.5px',
      color: THEME.colors.teakWoodHex
    });
    this.add(title);

    // 8. Recipe Requirement Chips Row
    this.createIngredientChips(scene, -cardW / 2 + 130, -cardH / 2 + 45);

    // 9. Status Badge (Accept / Preparing / Serve)
    this.createStatusBadge(scene, cardW / 2 - 14, -cardH / 2 + 20);

    // 10. Patience Progress Bar
    const barX = -cardW / 2 + 14;
    const barY = cardH / 2 - 25;
    const barW = cardW - 28;
    const barH = 6;

    const barTrack = scene.add.graphics();
    barTrack.fillStyle(0xDDD3C0, 1);
    barTrack.fillRoundedRect(barX, barY, barW, barH, 3);
    this.add(barTrack);

    this.patienceBar = scene.add.graphics();
    this.drawPatience(barX, barY, barW, barH);
    this.add(this.patienceBar);

    // 11. Timer Text & Coin Reward
    this.timeText = scene.add.text(barX, barY + 9, `⏱ Patience: ${order.patienceRemainingSec}s`, {
      fontFamily: THEME.fonts.body,
      fontSize: '9.5px',
      fontStyle: 'bold',
      color: THEME.colors.curryGreenHex
    });
    this.add(this.timeText);

    const reward = scene.add.text(cardW / 2 - 14, barY + 9, `💰 +₹${order.rewardCoins}`, {
      fontFamily: THEME.fonts.title,
      fontSize: '11px',
      color: THEME.colors.terracottaHex
    }).setOrigin(1, 0);
    this.add(reward);

    // Interactive Click
    this.setSize(cardW, cardH);
    this.setInteractive({ useHandCursor: true });

    this.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      if (!this.order.isAccepted) {
        this.acceptOrder();
      }
      this.onSelectCb();
      // If a dosa is plated and player clicks this card, trigger serve callback
      this.onServeCb?.(this.order);
    });

    this.on('pointerover', () => {
      scene.tweens.add({
        targets: this,
        y: y + 3,
        duration: 100,
        ease: 'Quad.easeOut'
      });
    });

    this.on('pointerout', () => {
      scene.tweens.add({
        targets: this,
        y: y,
        duration: 100,
        ease: 'Quad.easeOut'
      });
    });

    // Start Live Patience countdown ticking
    this.patienceTimer = scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.order.patienceRemainingSec > 0) {
          this.order.patienceRemainingSec--;
          this.updateMoodAndPatience(barX, barY, barW, barH);
        } else {
          // Patience timed out!
          this.handleTimeout();
        }
      }
    });

    scene.add.existing(this);
  }

  /**
   * Compact ingredient and preparation requirement chips
   */
  private createIngredientChips(scene: Phaser.Scene, startX: number, startY: number): void {
    const chipsContainer = scene.add.container(startX, startY);

    const chips: string[] = [];
    if (this.order.recipeId === 'masala_dosa') {
      chips.push('🥔 Masala', '🧈 Ghee', '📐 Triangle');
    } else if (this.order.recipeId === 'ghee_podi_dosa') {
      chips.push('🌶️ Podi', '🧈 Ghee', '🌙 Half-Moon');
    } else if (this.order.recipeId === 'onion_uthappam') {
      chips.push('🧅 Onions', '🌶️ Chillies', '🥞 Open');
    } else {
      chips.push('🧈 Pure Ghee', '🌯 Cylinder');
    }

    if (this.order.crispinessPreference === 'extra_crispy') {
      chips.push('🔥 Extra Crisp');
    } else if (this.order.crispinessPreference === 'medium') {
      chips.push('🔥 Med Crisp');
    }

    let curX = 0;
    chips.slice(0, 3).forEach(chip => {
      const chipTxt = scene.add.text(curX, 0, chip, {
        fontFamily: THEME.fonts.body,
        fontSize: '8.5px',
        color: '#4B3525',
        backgroundColor: '#F5E8D3',
        padding: { x: 3, y: 1 }
      });
      chipsContainer.add(chipTxt);
      curX += chipTxt.width + 4;
    });

    // Special preference line
    const prefTxt = scene.add.text(0, 15, `Note: "${this.order.specialNote.substring(0, 30)}..."`, {
      fontFamily: THEME.fonts.body,
      fontSize: '8px',
      fontStyle: 'italic',
      color: '#6E482C'
    });
    chipsContainer.add(prefTxt);

    this.add(chipsContainer);
  }

  /**
   * Dynamic status badge (Accept / Preparing / Ready to Serve)
   */
  private createStatusBadge(scene: Phaser.Scene, x: number, y: number): void {
    const badgeContainer = scene.add.container(x, y);

    this.statusBadgeG = scene.add.graphics();
    badgeContainer.add(this.statusBadgeG);

    const isAcc = this.order.isAccepted ?? false;
    const label = isAcc ? 'COOKING' : 'ACCEPT 🛎️';

    this.statusBadgeText = scene.add.text(0, 0, label, {
      fontFamily: THEME.fonts.title,
      fontSize: '9px',
      color: isAcc ? THEME.colors.turmericBrightHex : THEME.colors.creamHex
    }).setOrigin(1, 0.5);
    badgeContainer.add(this.statusBadgeText);

    this.drawStatusBadge(isAcc);
    this.add(badgeContainer);
  }

  private drawStatusBadge(isAccepted: boolean): void {
    if (!this.statusBadgeG || !this.statusBadgeText) return;
    this.statusBadgeG.clear();

    const w = this.statusBadgeText.width + 12;
    const h = 18;

    if (isAccepted) {
      this.statusBadgeG.fillStyle(THEME.colors.teakWood, 0.9);
      this.statusBadgeG.fillRoundedRect(-w, -h / 2, w, h, 4);
      this.statusBadgeG.lineStyle(1.2, THEME.colors.turmericBright, 0.85);
      this.statusBadgeG.strokeRoundedRect(-w, -h / 2, w, h, 4);
    } else {
      this.statusBadgeG.fillStyle(THEME.colors.terracotta, 0.95);
      this.statusBadgeG.fillRoundedRect(-w, -h / 2, w, h, 4);
      this.statusBadgeG.lineStyle(1.2, THEME.colors.brassBright, 1);
      this.statusBadgeG.strokeRoundedRect(-w, -h / 2, w, h, 4);
    }
  }

  public acceptOrder(): void {
    if (this.order.isAccepted) return;
    this.order.isAccepted = true;
    this.order.status = 'accepted';

    SoundFX.getInstance().playOrderBell();
    if (this.statusBadgeText) {
      this.statusBadgeText.setText('COOKING 👨‍🍳');
      this.statusBadgeText.setColor(THEME.colors.turmericBrightHex);
    }
    this.drawStatusBadge(true);
    this.onAcceptCb?.();
    this.onSelectCb();
  }

  public setReadyToServe(ready: boolean): void {
    if (!this.statusBadgeText) return;
    if (ready) {
      this.statusBadgeText.setText('SERVE HERE 🍽️');
      this.statusBadgeText.setColor('#FFEAA7');
      this.drawStatusBadge(true);
    } else if (this.order.isAccepted) {
      this.statusBadgeText.setText('COOKING 👨‍🍳');
      this.statusBadgeText.setColor(THEME.colors.turmericBrightHex);
      this.drawStatusBadge(true);
    }
  }

  private drawHighlight(): void {
    this.highlightG.clear();
    const halfW = this.cardWidth / 2;
    const halfH = this.cardHeight / 2;

    if (this.isSelected) {
      this.highlightG.lineStyle(2.8, THEME.colors.turmericGold, 1);
      this.highlightG.strokeRoundedRect(-halfW + 3, -halfH + 3, this.cardWidth - 6, this.cardHeight - 6, 8);
      this.highlightG.fillStyle(THEME.colors.turmeric, 0.08);
      this.highlightG.fillRoundedRect(-halfW + 3, -halfH + 3, this.cardWidth - 6, this.cardHeight - 6, 8);
    }
  }

  /**
   * Pulsing beacon border when a plated dosa is being dragged or ready to serve
   */
  public setDropTargetHighlight(active: boolean): void {
    this.isDropTarget = active;
    this.dropGlowG.clear();
    if (active) {
      const halfW = this.cardWidth / 2;
      const halfH = this.cardHeight / 2;
      this.dropGlowG.lineStyle(3.5, THEME.colors.bananaLeafGreen, 1);
      this.dropGlowG.strokeRoundedRect(-halfW + 2, -halfH + 2, this.cardWidth - 4, this.cardHeight - 4, 8);
      this.dropGlowG.fillStyle(THEME.colors.bananaLeafGreen, 0.12);
      this.dropGlowG.fillRoundedRect(-halfW + 2, -halfH + 2, this.cardWidth - 4, this.cardHeight - 4, 8);
    }
  }

  public containsPoint(worldX: number, worldY: number): boolean {
    const halfW = this.cardWidth / 2;
    const halfH = this.cardHeight / 2;
    return (
      worldX >= this.x - halfW &&
      worldX <= this.x + halfW &&
      worldY >= this.y - halfH &&
      worldY <= this.y + halfH
    );
  }

  private isPulsingWarning: boolean = false;
  private warningTween?: Phaser.Tweens.Tween;

  private drawPatience(x: number, y: number, w: number, h: number): void {
    this.patienceBar.clear();
    const ratio = Math.max(0, this.order.patienceRemainingSec / this.order.timeLimitSec);

    let col: number = THEME.colors.curryGreen;
    if (ratio < 0.20) {
      col = 0xE74C3C; // Urgent crimson
    } else if (ratio < 0.35) {
      col = THEME.colors.terracotta;
    } else if (ratio < 0.65) {
      col = THEME.colors.turmeric;
    }

    this.patienceBar.fillStyle(col, 1);
    this.patienceBar.fillRoundedRect(x, y, w * ratio, h, 3);

    // Glowing border when critical
    if (ratio < 0.20) {
      this.patienceBar.lineStyle(1.5, 0xFF3333, 0.9);
      this.patienceBar.strokeRoundedRect(x - 1, y - 1, w * ratio + 2, h + 2, 4);
    }
  }

  private updateMoodAndPatience(x: number, y: number, w: number, h: number): void {
    this.drawPatience(x, y, w, h);
    const ratio = this.order.patienceRemainingSec / this.order.timeLimitSec;

    let mood: CustomerMood = 'happy';
    let emote = '😊';
    let col: string = THEME.colors.curryGreenHex;

    if (ratio < 0.20) {
      mood = 'impatient';
      emote = '😰';
      col = '#E74C3C';

      if (!this.isPulsingWarning) {
        this.isPulsingWarning = true;
        this.warningTween = this.scene.tweens.add({
          targets: this,
          scaleX: 1.025,
          scaleY: 1.025,
          duration: 350,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }

      if (this.order.patienceRemainingSec === 8) {
        this.showSpeechBubble('Please hurry with my hot dosa! ⏳', false, 1800);
      }
    } else if (ratio < 0.35) {
      mood = 'impatient';
      emote = '😟';
      col = THEME.colors.terracottaHex;
    } else if (ratio < 0.65) {
      mood = 'neutral';
      emote = '😐';
      col = THEME.colors.turmericGoldHex;
    }

    this.order.mood = mood;
    this.moodText.setText(emote);
    this.timeText.setText(`⏱ Patience: ${this.order.patienceRemainingSec}s`);
    this.timeText.setColor(col);
  }

  private handleTimeout(): void {
    if (this.patienceTimer) {
      this.patienceTimer.destroy();
    }
    this.order.mood = 'impatient';
    this.order.status = 'timeout';
    this.moodText.setText('😤');

    SoundFX.getInstance().playCustomerDisappoint();
    this.showSpeechBubble("I've waited too long, goodbye! 💢", false);

    // Shake card in frustration
    this.scene.tweens.add({
      targets: this,
      x: this.x + 8,
      duration: 60,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.scene.time.delayedCall(1200, () => {
          this.onTimeoutCb?.(this.order);
        });
      }
    });
  }

  /**
   * Floating speech balloon with customer reaction
   */
  public showSpeechBubble(message: string, isHappy: boolean, duration: number = 2200): void {
    if (this.speechContainer) {
      this.speechContainer.destroy();
    }

    const bubble = this.scene.add.container(0, this.cardHeight / 2 + 18);
    this.speechContainer = bubble;

    const msgTxt = this.scene.add.text(0, 0, message, {
      fontFamily: THEME.fonts.body,
      fontSize: '11px',
      fontStyle: 'bold',
      color: isHappy ? '#1E8449' : '#C0392B',
      backgroundColor: '#FFFDF5',
      padding: { x: 10, y: 5 },
      stroke: isHappy ? '#52BE80' : '#E74C3C',
      strokeThickness: 1
    }).setOrigin(0.5);

    bubble.add(msgTxt);
    bubble.setDepth(60);
    this.add(bubble);

    this.scene.tweens.add({
      targets: bubble,
      y: this.cardHeight / 2 + 12,
      duration: 160,
      ease: 'Back.easeOut'
    });

    this.scene.time.delayedCall(duration, () => {
      if (this.speechContainer && this.scene && this.scene.tweens) {
        this.scene.tweens.add({
          targets: this.speechContainer,
          alpha: 0,
          duration: 250,
          onComplete: () => {
            this.speechContainer?.destroy();
            this.speechContainer = undefined;
          }
        });
      } else {
        this.speechContainer?.destroy();
        this.speechContainer = undefined;
      }
    });
  }

  /**
   * Animated exit when order is served or times out
   */
  public exitAnimation(reason: 'served' | 'timeout', onComplete?: () => void): void {
    if (this.patienceTimer) {
      this.patienceTimer.destroy();
    }
    if (this.warningTween) {
      this.warningTween.stop();
      this.warningTween = undefined;
    }
    this.setScale(1.0);

    if (reason === 'served') {
      this.moodText.setText('😍');
      SoundFX.getInstance().playCustomerDelight();
    }

    this.scene.tweens.add({
      targets: this,
      y: -120,
      alpha: 0,
      duration: 480,
      ease: 'Back.easeIn',
      onComplete: () => {
        onComplete?.();
        this.destroy();
      }
    });
  }

  public setSelected(selected: boolean): void {
    this.isSelected = selected;
    this.drawHighlight();
  }

  public getOrder(): CustomerOrder {
    return this.order;
  }

  public override destroy(fromScene?: boolean): void {
    if (this.patienceTimer) {
      this.patienceTimer.destroy();
    }
    if (this.warningTween) {
      this.warningTween.stop();
      this.warningTween = undefined;
    }
    if (this.speechContainer) {
      this.speechContainer.destroy();
      this.speechContainer = undefined;
    }
    super.destroy(fromScene);
  }
}
