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

    let isPressed = false;

    // Events
    this.on('pointerover', () => {
      this.isHovered = true;
      this.bgImage.setTexture('ui_wood_button_hover');
      this.labelText.setColor(THEME.colors.turmericBrightHex);
      SoundFX.getInstance().playHover();
      this.setScale(1.04);
    });

    this.on('pointerout', () => {
      this.isHovered = false;
      this.bgImage.setTexture('ui_wood_button');
      this.labelText.setColor(THEME.colors.creamHex);
      if (!isPressed) {
        this.setScale(1.0);
      }
    });

    this.on('pointerdown', () => {
      isPressed = true;
      SoundFX.getInstance().playClick();
      this.setScale(0.96);
    });

    const triggerClick = () => {
      if (!isPressed) return;
      isPressed = false;
      this.setScale(1.0);
      config.onClick();
    };

    this.on('pointerup', triggerClick);
    this.on('pointerupoutside', triggerClick);

    scene.add.existing(this);
  }
}
