import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';

window.addEventListener('DOMContentLoaded', () => {
  const game = new Phaser.Game(gameConfig);

  // Handle window focus/blur and mobile viewport adjustments
  window.addEventListener('resize', () => {
    game.scale.refresh();
  });
});
