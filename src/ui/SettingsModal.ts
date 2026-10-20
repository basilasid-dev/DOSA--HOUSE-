import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';

export class SettingsModal extends Phaser.GameObjects.Container {
  private backdrop: Phaser.GameObjects.Rectangle;
  private panel: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onClose: () => void) {
    super(scene, 0, 0);

    const { width, height } = THEME.dimensions;
    const sound = SoundFX.getInstance();

    // Dark backdrop overlay
    this.backdrop = scene.add.rectangle(width / 2, height / 2, width, height, 0x0a0502, 0.75);
    this.backdrop.setInteractive();
    this.add(this.backdrop);

    // Modal Panel Container
    this.panel = scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const modalW = 680;
    const modalH = 540;

    // Panel Board Graphics
    const board = scene.add.graphics();
    // Drop shadow
    board.fillStyle(0x000000, 0.5);
    board.fillRoundedRect(-modalW / 2 + 10, -modalH / 2 + 14, modalW, modalH, 20);

    // Wood Base
    board.fillStyle(THEME.colors.teakWood, 1);
    board.fillRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Parchment Inner
    board.fillStyle(THEME.colors.creamWarm, 1);
    board.fillRoundedRect(-modalW / 2 + 16, -modalH / 2 + 16, modalW - 32, modalH - 32, 14);

    // Brass Border
    board.lineStyle(4, THEME.colors.brass, 0.95);
    board.strokeRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Inner gold line
    board.lineStyle(1.5, THEME.colors.turmericGold, 0.6);
    board.strokeRoundedRect(-modalW / 2 + 8, -modalH / 2 + 8, modalW - 16, modalH - 16, 16);

    this.panel.add(board);

    // Header Title
    const title = scene.add.text(0, -modalH / 2 + 34, 'RESTAURANT SETTINGS', {
      fontFamily: THEME.fonts.title,
      fontSize: '27px',
      color: THEME.colors.teakWoodHex
    }).setOrigin(0.5, 0);
    this.panel.add(title);

    const sub = scene.add.text(0, -modalH / 2 + 70, 'Customize your kitchen ambience, volume & controls', {
      fontFamily: THEME.fonts.body,
      fontSize: '13px',
      color: THEME.colors.terracottaHex
    }).setOrigin(0.5, 0);
    this.panel.add(sub);

    // Close Button
    const closeBtn = scene.add.image(modalW / 2 - 36, -modalH / 2 + 34, 'icon_close');
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setScale(1.15));
    closeBtn.on('pointerout', () => closeBtn.setScale(1.0));
    closeBtn.on('pointerdown', () => {
      sound.playClick();
      this.closeModal(onClose);
    });
    this.panel.add(closeBtn);

    // Settings Controls List
    let currentY = -modalH / 2 + 115;
    const rowGap = 56;

    // 1. Master Audio Mute Toggle
    this.createToggleRow(
      scene,
      0,
      currentY,
      'Master Audio Mute',
      'Quickly mute or enable all audio & background music',
      sound.isMuted(),
      (isMuted) => {
        sound.setMuted(isMuted);
      }
    );

    // 2. Sizzling Sound FX Volume Slider
    currentY += rowGap;
    this.createSliderRow(
      scene,
      0,
      currentY,
      '🔊 Sizzling Sound FX',
      'Tawa sizzle, wooden clicks, bells & spatula scrapes',
      sound.getSFXVolume(),
      (vol) => {
        sound.setSFXVolume(vol);
      },
      () => {
        sound.playClick();
      }
    );

    // 3. Cozy Cafe Ambience Music Volume Slider
    currentY += rowGap;
    this.createSliderRow(
      scene,
      0,
      currentY,
      '🎵 Carnatic Ambience Music',
      'Warm tanpura drone & relaxing Mohanam flute melody',
      sound.getMusicVolume(),
      (vol) => {
        sound.setMusicVolume(vol);
      }
    );

    // 4. Screen Shake / Juicy FX Toggle
    currentY += rowGap;
    let juicyFX = true;
    this.createToggleRow(
      scene,
      0,
      currentY,
      '✨ Juicy Visual Effects',
      'Steam puffs, golden glows & springy button animations',
      juicyFX,
      (enabled) => {
        juicyFX = enabled;
      }
    );

    // 5. Fullscreen Button
    currentY += 52;
    const fsContainer = scene.add.container(0, currentY);
    const fsBtnBg = scene.add.graphics();
    fsBtnBg.fillStyle(THEME.colors.teakWood, 0.92);
    fsBtnBg.fillRoundedRect(-260, -18, 520, 38, 8);
    fsBtnBg.lineStyle(1.5, THEME.colors.brass, 0.85);
    fsBtnBg.strokeRoundedRect(-260, -18, 520, 38, 8);
    fsContainer.add(fsBtnBg);

    const fsText = scene.add.text(0, 1, '⛶  TOGGLE FULLSCREEN DISPLAY', {
      fontFamily: THEME.fonts.title,
      fontSize: '14px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    fsContainer.add(fsText);

    fsContainer.setSize(520, 38);
    fsContainer.setInteractive(new Phaser.Geom.Rectangle(-260, -18, 520, 38), Phaser.Geom.Rectangle.Contains);
    fsContainer.on('pointerover', () => {
      fsBtnBg.clear();
      fsBtnBg.fillStyle(THEME.colors.terracotta, 1);
      fsBtnBg.fillRoundedRect(-260, -18, 520, 38, 8);
      fsBtnBg.lineStyle(2, THEME.colors.brassBright, 1);
      fsBtnBg.strokeRoundedRect(-260, -18, 520, 38, 8);
    });
    fsContainer.on('pointerout', () => {
      fsBtnBg.clear();
      fsBtnBg.fillStyle(THEME.colors.teakWood, 0.92);
      fsBtnBg.fillRoundedRect(-260, -18, 520, 38, 8);
      fsBtnBg.lineStyle(1.5, THEME.colors.brass, 0.85);
      fsBtnBg.strokeRoundedRect(-260, -18, 520, 38, 8);
    });
    fsContainer.on('pointerdown', () => {
      sound.playClick();
      if (scene.scale.isFullscreen) {
        scene.scale.stopFullscreen();
      } else {
        scene.scale.startFullscreen();
      }
    });
    this.panel.add(fsContainer);

    // 6. Cultural Tribute Card
    const aboutY = modalH / 2 - 58;
    const aboutBox = scene.add.graphics();
    aboutBox.fillStyle(THEME.colors.curryGreen, 0.08);
    aboutBox.fillRoundedRect(-modalW / 2 + 40, aboutY - 20, modalW - 80, 54, 8);
    aboutBox.lineStyle(1, THEME.colors.curryGreen, 0.3);
    aboutBox.strokeRoundedRect(-modalW / 2 + 40, aboutY - 20, modalW - 80, 54, 8);
    this.panel.add(aboutBox);

    const tributeTitle = scene.add.text(0, aboutY - 12, 'DOSA HOUSE • CRAFTED WITH LOVE & GHEE', {
      fontFamily: THEME.fonts.title,
      fontSize: '12px',
      color: THEME.colors.curryGreenHex
    }).setOrigin(0.5, 0);
    this.panel.add(tributeTitle);

    const tributeText = scene.add.text(
      0,
      aboutY + 6,
      'Crispy paper roasts, frothy filter coffee, and fragrant sambar bubbling over generations of artisanal tawa mastery.',
      {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
        color: '#344535',
        align: 'center'
      }
    ).setOrigin(0.5, 0);
    this.panel.add(tributeText);

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

  /**
   * Reusable interactive slider for volume controls
   */
  private createSliderRow(
    scene: Phaser.Scene,
    x: number,
    y: number,
    title: string,
    desc: string,
    initialVal: number,
    onChange: (val: number) => void,
    onPreview?: () => void
  ): void {
    const row = scene.add.container(x, y);

    const titleText = scene.add.text(-250, -13, title, {
      fontFamily: THEME.fonts.title,
      fontSize: '16px',
      color: THEME.colors.teakWoodHex
    });
    row.add(titleText);

    const descText = scene.add.text(-250, 7, desc, {
      fontFamily: THEME.fonts.body,
      fontSize: '11px',
      color: '#554433'
    });
    row.add(descText);

    // Slider bar geometry
    const trackX = 110;
    const trackY = 0;
    const trackW = 120;
    const trackH = 10;

    let currentVal = initialVal;

    const sliderG = scene.add.graphics();
    row.add(sliderG);

    const pctText = scene.add.text(trackX + trackW + 18, 0, `${Math.round(currentVal * 100)}%`, {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      fontStyle: 'bold',
      color: THEME.colors.teakWoodHex
    }).setOrigin(0, 0.5);
    row.add(pctText);

    const drawSlider = () => {
      sliderG.clear();
      // Background track
      sliderG.fillStyle(0xDDD3C0, 1);
      sliderG.fillRoundedRect(trackX, trackY - trackH / 2, trackW, trackH, 5);
      sliderG.lineStyle(1.5, THEME.colors.brass, 0.6);
      sliderG.strokeRoundedRect(trackX, trackY - trackH / 2, trackW, trackH, 5);

      // Filled portion
      const fillW = Math.max(0, Math.min(trackW, trackW * currentVal));
      if (fillW > 0) {
        sliderG.fillStyle(THEME.colors.turmeric, 1);
        sliderG.fillRoundedRect(trackX, trackY - trackH / 2, fillW, trackH, 5);
      }

      // Thumb knob
      const knobX = trackX + fillW;
      sliderG.fillStyle(THEME.colors.brassBright, 1);
      sliderG.fillCircle(knobX, trackY, 9);
      sliderG.lineStyle(1.5, THEME.colors.teakWood, 0.9);
      sliderG.strokeCircle(knobX, trackY, 9);
    };

    drawSlider();

    // Hitbox for slider interaction
    const hitZone = scene.add.rectangle(trackX + trackW / 2, trackY, trackW + 24, 30, 0x000000, 0);
    hitZone.setInteractive({ useHandCursor: true });
    row.add(hitZone);

    let isDragging = false;
    const updateFromPointer = (pointerX: number) => {
      // Calculate local x relative to row container
      const localX = pointerX - (this.panel.x + x);
      const ratio = Phaser.Math.Clamp((localX - trackX) / trackW, 0, 1);
      currentVal = ratio;
      pctText.setText(`${Math.round(currentVal * 100)}%`);
      drawSlider();
      onChange(currentVal);
    };

    hitZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      isDragging = true;
      updateFromPointer(pointer.x);
      onPreview?.();
    });

    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (isDragging) {
        updateFromPointer(pointer.x);
      }
    });

    scene.input.on('pointerup', () => {
      if (isDragging) {
        isDragging = false;
        onPreview?.();
      }
    });

    this.panel.add(row);
  }

  private createToggleRow(
    scene: Phaser.Scene,
    x: number,
    y: number,
    title: string,
    desc: string,
    initialVal: boolean,
    onChange: (val: boolean) => void
  ): void {
    const row = scene.add.container(x, y);

    const titleText = scene.add.text(-250, -13, title, {
      fontFamily: THEME.fonts.title,
      fontSize: '16px',
      color: THEME.colors.teakWoodHex
    });
    row.add(titleText);

    const descText = scene.add.text(-250, 7, desc, {
      fontFamily: THEME.fonts.body,
      fontSize: '11px',
      color: '#554433'
    });
    row.add(descText);

    // Toggle switch button
    let isOn = initialVal;
    const toggleG = scene.add.graphics();
    const drawSwitch = () => {
      toggleG.clear();
      // Track
      toggleG.fillStyle(isOn ? THEME.colors.curryGreen : 0xAAAAAA, 1);
      toggleG.fillRoundedRect(190, -11, 52, 24, 12);
      toggleG.lineStyle(1.8, THEME.colors.brass, 0.7);
      toggleG.strokeRoundedRect(190, -11, 52, 24, 12);
      // Thumb
      toggleG.fillStyle(THEME.colors.cream, 1);
      toggleG.fillCircle(isOn ? 228 : 203, 1, 9);
      toggleG.lineStyle(1.5, THEME.colors.teakWood, 0.4);
      toggleG.strokeCircle(isOn ? 228 : 203, 1, 9);
    };

    drawSwitch();
    row.add(toggleG);

    // Interactive hitbox for switch
    const hitArea = scene.add.rectangle(216, 1, 58, 28, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    hitArea.on('pointerdown', () => {
      isOn = !isOn;
      SoundFX.getInstance().playClick();
      drawSwitch();
      onChange(isOn);
    });
    row.add(hitArea);

    this.panel.add(row);
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
