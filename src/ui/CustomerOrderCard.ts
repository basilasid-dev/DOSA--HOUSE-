import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { CustomerOrder, CustomerMood } from '../types/recipe';

export class CustomerOrderCard extends Phaser.GameObjects.Container {
  private order: CustomerOrder;
  private isSelected: boolean = false;
  private highlightG: Phaser.GameObjects.Graphics;
  private patienceBar: Phaser.GameObjects.Graphics;
  private moodText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private patienceTimer?: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    order: CustomerOrder,
    isSelected: boolean,
    onSelect: () => void
  ) {
    super(scene, x, y);
    this.order = order;
    this.isSelected = isSelected;

    const cardW = 275;
    const cardH = 135;

    // 1. Aged Ivory Paper Card Base
    const cardBg = scene.add.image(0, 0, 'ui_order_ticket_card');
    cardBg.setDisplaySize(cardW, cardH);
    this.add(cardBg);

    // 2. Selection Glow Border
    this.highlightG = scene.add.graphics();
    this.drawHighlight();
    this.add(this.highlightG);

    // 3. Brass Hanging Clip on Top
    const clip = scene.add.graphics();
    clip.fillStyle(THEME.colors.brass, 1);
    clip.fillRect(-12, -cardH / 2 - 4, 24, 14);
    clip.fillStyle(THEME.colors.brassBright, 1);
    clip.fillCircle(0, -cardH / 2 + 1, 4.5);
    this.add(clip);

    // 4. Expressive Customer Avatar (Top-Left)
    const avatarX = -cardW / 2 + 42;
    const avatarY = -22;
    const avatarImg = scene.add.image(avatarX, avatarY, order.avatarKey);
    avatarImg.setDisplaySize(56, 56);
    this.add(avatarImg);

    // Mood Emote indicator over avatar
    this.moodText = scene.add.text(avatarX + 20, avatarY - 20, '😊', {
      fontSize: '14px'
    }).setOrigin(0.5);
    this.add(this.moodText);

    // 5. Dish Photo Thumbnail (Next to Avatar)
    const dishX = -cardW / 2 + 104;
    const dishY = -22;
    const dishW = 54;
    const dishH = 50;

    const dishImg = scene.add.image(dishX, dishY, order.dishImageKey);
    dishImg.setDisplaySize(dishW, dishH);
    this.add(dishImg);

    const dishBorder = scene.add.graphics();
    dishBorder.lineStyle(1.5, THEME.colors.brass, 0.85);
    dishBorder.strokeRect(dishX - dishW / 2, dishY - dishH / 2, dishW, dishH);
    this.add(dishBorder);

    // 6. Header: Table number & Customer Name
    const header = scene.add.text(-cardW / 2 + 140, -cardH / 2 + 16, `T-${order.tableNumber} • ${order.customerName}`, {
      fontFamily: THEME.fonts.body,
      fontSize: '11px',
      fontStyle: 'bold',
      color: THEME.colors.terracottaHex
    });
    this.add(header);

    // 7. Dish Title
    const title = scene.add.text(-cardW / 2 + 140, -cardH / 2 + 32, order.recipeName.toUpperCase(), {
      fontFamily: THEME.fonts.title,
      fontSize: '13.5px',
      color: THEME.colors.teakWoodHex
    });
    this.add(title);

    // 8. Custom Note / Dietary preference
    const note = scene.add.text(-cardW / 2 + 140, -cardH / 2 + 50, order.specialNote, {
      fontFamily: THEME.fonts.body,
      fontSize: '9.5px',
      color: '#4B3525',
      wordWrap: { width: 120 },
      lineSpacing: 1
    });
    this.add(note);

    // 9. Patience Progress Bar (Horizontal with smooth color transition)
    const barX = -cardW / 2 + 16;
    const barY = cardH / 2 - 28;
    const barW = cardW - 32;
    const barH = 7;

    // Patience track background
    const barTrack = scene.add.graphics();
    barTrack.fillStyle(0xDDD3C0, 1);
    barTrack.fillRoundedRect(barX, barY, barW, barH, 3.5);
    this.add(barTrack);

    this.patienceBar = scene.add.graphics();
    this.drawPatience(barX, barY, barW, barH);
    this.add(this.patienceBar);

    // 10. Timer Text & Coin Reward
    this.timeText = scene.add.text(barX, barY + 10, `⏱ Patience: ${order.patienceRemainingSec}s`, {
      fontFamily: THEME.fonts.body,
      fontSize: '9.5px',
      fontStyle: 'bold',
      color: THEME.colors.curryGreenHex
    });
    this.add(this.timeText);

    const reward = scene.add.text(cardW / 2 - 16, barY + 10, `💰 +₹${order.rewardCoins}`, {
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
      onSelect();
    });

    this.on('pointerover', () => {
      scene.tweens.add({
        targets: this,
        y: y + 4,
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
        }
      }
    });

    scene.add.existing(this);
  }

  private drawHighlight(): void {
    this.highlightG.clear();
    if (this.isSelected) {
      this.highlightG.lineStyle(3, THEME.colors.turmericGold, 1);
      this.highlightG.strokeRoundedRect(-132, -62, 264, 124, 8);
      this.highlightG.fillStyle(THEME.colors.turmeric, 0.08);
      this.highlightG.fillRoundedRect(-132, -62, 264, 124, 8);
    }
  }

  private drawPatience(x: number, y: number, w: number, h: number): void {
    this.patienceBar.clear();
    const ratio = Math.max(0, this.order.patienceRemainingSec / this.order.timeLimitSec);

    let col: number = THEME.colors.curryGreen;
    if (ratio < 0.3) {
      col = THEME.colors.terracotta;
    } else if (ratio < 0.6) {
      col = THEME.colors.turmeric;
    }

    this.patienceBar.fillStyle(col, 1);
    this.patienceBar.fillRoundedRect(x, y, w * ratio, h, 3.5);
  }

  private updateMoodAndPatience(x: number, y: number, w: number, h: number): void {
    this.drawPatience(x, y, w, h);
    const ratio = this.order.patienceRemainingSec / this.order.timeLimitSec;

    let mood: CustomerMood = 'happy';
    let emote = '😊';
    let col: string = THEME.colors.curryGreenHex;

    if (ratio < 0.3) {
      mood = 'impatient';
      emote = '😟';
      col = THEME.colors.terracottaHex;
    } else if (ratio < 0.6) {
      mood = 'neutral';
      emote = '😐';
      col = THEME.colors.turmericGoldHex;
    }

    this.order.mood = mood;
    this.moodText.setText(emote);
    this.timeText.setText(`⏱ Patience: ${this.order.patienceRemainingSec}s`);
    this.timeText.setColor(col);
  }

  public setSelected(selected: boolean): void {
    this.isSelected = selected;
    this.drawHighlight();
  }

  public getOrder(): CustomerOrder {
    return this.order;
  }

  public destroy(fromScene?: boolean): void {
    if (this.patienceTimer) {
      this.patienceTimer.destroy();
    }
    super.destroy(fromScene);
  }
}
