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
    const modalH = 500;

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
    const title = scene.add.text(0, -modalH / 2 + 36, 'RESTAURANT SETTINGS', {
      fontFamily: THEME.fonts.title,
      fontSize: '28px',
      color: THEME.colors.teakWoodHex
    }).setOrigin(0.5, 0);
    this.panel.add(title);

    const sub = scene.add.text(0, -modalH / 2 + 74, 'Customize your kitchen ambience & controls', {
      fontFamily: THEME.fonts.body,
      fontSize: '13px',
      color: THEME.colors.terracottaHex
    }).setOrigin(0.5, 0);
    this.panel.add(sub);

    // Close Button
    const closeBtn = scene.add.image(modalW / 2 - 36, -modalH / 2 + 36, 'icon_close');
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setScale(1.15));
    closeBtn.on('pointerout', () => closeBtn.setScale(1.0));
    closeBtn.on('pointerdown', () => {
      sound.playClick();
      this.closeModal(onClose);
    });
    this.panel.add(closeBtn);

    // Settings Controls List
    let startY = -modalH / 2 + 120;
    const rowH = 60;

    // 1. Sound FX Toggle
    this.createToggleRow(
      scene,
      0,
      startY,
      'Sizzling Sound FX',
      'Realistic tawa sizzle, clicks & kitchen clatter',
      !sound.isMuted(),
      (enabled) => {
        sound.setMuted(!enabled);
        if (enabled) sound.playSizzle(0.5);
      }
    );

    // 2. Music / Cozy Ambience Toggle
    startY += rowH;
    let musicOn = true;
    this.createToggleRow(
      scene,
      0,
      startY,
      'Cozy Cafe Ambience',
      'Warm acoustic background atmosphere',
      musicOn,
      (enabled) => {
        musicOn = enabled;
        sound.setMusicVolume(enabled ? 0.5 : 0);
      }
    );

    // 3. Screen Shake / Juicy FX Toggle
    startY += rowH;
    let juicyFX = true;
    this.createToggleRow(
      scene,
      0,
      startY,
      'Juicy Visual Effects',
      'Steam puffs, golden glows & springy button animations',
      juicyFX,
      (enabled) => {
        juicyFX = enabled;
      }
    );

    // 4. Fullscreen Button
    startY += rowH;
    const fsContainer = scene.add.container(0, startY);
    const fsBtnBg = scene.add.graphics();
    fsBtnBg.fillStyle(THEME.colors.teakWood, 0.9);
    fsBtnBg.fillRoundedRect(-260, -20, 520, 42, 8);
    fsBtnBg.lineStyle(1.5, THEME.colors.brass, 0.8);
    fsBtnBg.strokeRoundedRect(-260, -20, 520, 42, 8);
    fsContainer.add(fsBtnBg);

    const fsText = scene.add.text(0, 0, '⛶  TOGGLE FULLSCREEN DISPLAY', {
      fontFamily: THEME.fonts.title,
      fontSize: '15px',
      color: THEME.colors.turmericBrightHex
    }).setOrigin(0.5);
    fsContainer.add(fsText);

    fsContainer.setSize(520, 42);
    fsContainer.setInteractive(new Phaser.Geom.Rectangle(-260, -20, 520, 42), Phaser.Geom.Rectangle.Contains);
    fsContainer.on('pointerover', () => {
      fsBtnBg.clear();
      fsBtnBg.fillStyle(THEME.colors.terracotta, 1);
      fsBtnBg.fillRoundedRect(-260, -20, 520, 42, 8);
      fsBtnBg.lineStyle(2, THEME.colors.brassBright, 1);
      fsBtnBg.strokeRoundedRect(-260, -20, 520, 42, 8);
    });
    fsContainer.on('pointerout', () => {
      fsBtnBg.clear();
      fsBtnBg.fillStyle(THEME.colors.teakWood, 0.9);
      fsBtnBg.fillRoundedRect(-260, -20, 520, 42, 8);
      fsBtnBg.lineStyle(1.5, THEME.colors.brass, 0.8);
      fsBtnBg.strokeRoundedRect(-260, -20, 520, 42, 8);
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

    // About & Cultural Tribute Card
    const aboutY = modalH / 2 - 80;
    const aboutBox = scene.add.graphics();
    aboutBox.fillStyle(THEME.colors.curryGreen, 0.08);
    aboutBox.fillRoundedRect(-modalW / 2 + 40, aboutY - 24, modalW - 80, 70, 8);
    aboutBox.lineStyle(1, THEME.colors.curryGreen, 0.3);
    aboutBox.strokeRoundedRect(-modalW / 2 + 40, aboutY - 24, modalW - 80, 70, 8);
    this.panel.add(aboutBox);

    const tributeTitle = scene.add.text(0, aboutY - 14, 'DOSA HOUSE • CRAFTED WITH LOVE & GHEE', {
      fontFamily: THEME.fonts.title,
      fontSize: '13px',
      color: THEME.colors.curryGreenHex
    }).setOrigin(0.5, 0);
    this.panel.add(tributeTitle);

    const tributeText = scene.add.text(
      0,
      aboutY + 8,
      'A cozy ode to South Indian tiffin culture — crispy paper roasts, frothy filter coffee,\nand fragrant sambar bubbling over generations of artisanal tawa mastery.',
      {
        fontFamily: THEME.fonts.body,
        fontSize: '11.5px',
        color: '#344535',
        align: 'center',
        lineSpacing: 3
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

    const titleText = scene.add.text(-250, -14, title, {
      fontFamily: THEME.fonts.title,
      fontSize: '17px',
      color: THEME.colors.teakWoodHex
    });
    row.add(titleText);

    const descText = scene.add.text(-250, 8, desc, {
      fontFamily: THEME.fonts.body,
      fontSize: '11.5px',
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
      toggleG.fillRoundedRect(200, -12, 54, 26, 13);
      toggleG.lineStyle(2, THEME.colors.brass, 0.7);
      toggleG.strokeRoundedRect(200, -12, 54, 26, 13);
      // Thumb
      toggleG.fillStyle(THEME.colors.cream, 1);
      toggleG.fillCircle(isOn ? 240 : 214, 1, 10);
      toggleG.lineStyle(1.5, THEME.colors.teakWood, 0.4);
      toggleG.strokeCircle(isOn ? 240 : 214, 1, 10);
    };

    drawSwitch();
    row.add(toggleG);

    // Interactive hitbox for switch
    const hitArea = scene.add.rectangle(227, 1, 60, 32, 0x000000, 0);
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
