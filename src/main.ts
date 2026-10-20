import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import { SoundFX } from './audio/SoundFX';

window.addEventListener('DOMContentLoaded', () => {
  const game = new Phaser.Game(gameConfig);

  // Handle window focus/blur, orientation changes, and mobile viewport adjustments
  const handleViewportChange = () => {
    setTimeout(() => {
      game.scale.refresh();
      window.scrollTo(0, 0);
    }, 150);
  };

  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('orientationchange', handleViewportChange);

  // Mobile Web Audio unlock on very first tap/touch
  const unlockAudio = () => {
    SoundFX.getInstance();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });
});

