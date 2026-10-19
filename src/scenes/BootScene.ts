import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    // Hide initial HTML loader once Phaser canvas is initialized
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.style.opacity = '0';
      setTimeout(() => {
        initialLoader.remove();
      }, 400);
    }

    this.scene.start('PreloadScene');
  }
}
