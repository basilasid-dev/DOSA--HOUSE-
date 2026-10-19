import Phaser from 'phaser';

/**
 * DOSA HOUSE - Steam Particles System
 * Creates warm, cozy rising steam trails for hot dosas and simmering sambar.
 */
export class SteamEmitter {
  private particles: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number = 80) {
    this.particles = scene.add.particles(x, y, 'fx_steam', {
      x: { min: -width / 2, max: width / 2 },
      y: 0,
      speedY: { min: -40, max: -70 },
      speedX: { min: -12, max: 12 },
      scale: { start: 0.35, end: 1.1 },
      alpha: { start: 0.45, end: 0 },
      lifespan: { min: 2000, max: 3200 },
      frequency: 240,
      rotate: { min: -40, max: 40 },
      blendMode: 'SCREEN'
    });
  }

  public setPosition(x: number, y: number): void {
    this.particles.setPosition(x, y);
  }

  public stop(): void {
    this.particles.stop();
  }

  public start(): void {
    this.particles.start();
  }

  public destroy(): void {
    this.particles.destroy();
  }
}
