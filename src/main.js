import BattleScene from './scenes/BattleScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  scene: [BattleScene], // Add BattleScene to the list of scenes
};

const game = new Phaser.Game(config); // Instantiate the game with the config