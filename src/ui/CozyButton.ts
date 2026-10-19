import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';

export interface CozyButtonConfig {
  x: number;
  y: number;
  text: string;
  subText?: string;
  iconTexture?: string;
  width?: number;
  onClick: () => void;
}

export class CozyButton extends Phaser.GameObjects.Container {
  private bgImage: Phaser.GameObjects.Image;
  private labelText: Phaser.GameObjects.Text;
  private subLabel?: Phaser.GameObjects.Text;
  private iconImage?: Phaser.GameObjects.Image;
  private isHovered: boolean = false;

  constructor(scene: Phaser.Scene, config: CozyButtonConfig) {
    super(scene, config.x, config.y);

    const buttonWidth = config.width || 340;
    const buttonHeight = 72;

    // Background Image
    this.bgImage = scene.add.image(0, 0, 'ui_wood_button');
    this.bgImage.setDisplaySize(buttonWidth, buttonHeight);
    this.add(this.bgImage);

    // Icon (if provided)
    let textOffsetX = 0;
    if (config.iconTexture && scene.textures.exists(config.iconTexture)) {
      this.iconImage = scene.add.image(-buttonWidth / 2 + 45, 0, config.iconTexture);
      this.iconImage.setScale(0.85);
      this.add(this.iconImage);
      textOffsetX = 18;
    }

    // Main Text
    const textY = config.subText ? -9 : 0;
    this.labelText = scene.add.text(textOffsetX, textY, config.text.toUpperCase(), {
      fontFamily: THEME.fonts.title,
      fontSize: '22px',
      color: THEME.colors.creamHex,
      stroke: THEME.colors.teakWoodHex,
      strokeThickness: 3
    }).setOrigin(0.5);
    this.labelText.setShadow(1, 2, 'rgba(0,0,0,0.6)', 3);
    this.add(this.labelText);

    // Subtitle / Tagline
    if (config.subText) {
      this.subLabel = scene.add.text(textOffsetX, 14, config.subText.toUpperCase(), {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
        fontStyle: 'bold',
        color: THEME.colors.turmericBrightHex,
        letterSpacing: 1
      }).setOrigin(0.5);
      this.add(this.subLabel);
    }

    // Set Interactive
    this.setSize(buttonWidth, buttonHeight);
    this.setInteractive({ useHandCursor: true });

    // Events
    this.on('pointerover', () => {
      this.isHovered = true;
      this.bgImage.setTexture('ui_wood_button_hover');
      this.labelText.setColor(THEME.colors.turmericBrightHex);
      SoundFX.getInstance().playHover();

      scene.tweens.killTweensOf(this);
      scene.tweens.add({
        targets: this,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 160,
        ease: 'Back.easeOut'
      });
    });

    this.on('pointerout', () => {
      this.isHovered = false;
      this.bgImage.setTexture('ui_wood_button');
      this.labelText.setColor(THEME.colors.creamHex);

      scene.tweens.killTweensOf(this);
      scene.tweens.add({
        targets: this,
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 160,
        ease: 'Quad.easeOut'
      });
    });

    this.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      scene.tweens.add({
        targets: this,
        scaleX: 0.96,
        scaleY: 0.96,
        duration: 80,
        ease: 'Quad.easeIn'
      });
    });

    this.on('pointerup', () => {
      scene.tweens.add({
        targets: this,
        scaleX: this.isHovered ? 1.05 : 1.0,
        scaleY: this.isHovered ? 1.05 : 1.0,
        duration: 120,
        ease: 'Back.easeOut',
        onComplete: () => {
          config.onClick();
        }
      });
    });

    scene.add.existing(this);
  }
}
