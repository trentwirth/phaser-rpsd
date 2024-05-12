export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  preload() {
    // Load any assets needed for this scene
    this.load.image('startButton', 'assets/startButton.png');
  }

  create() {
    // Create a start button and set it to start the BattleScene when clicked
    this.startButton = this.add.image(400, 300, 'startButton').setInteractive();
    this.startButton.on('pointerdown', () => this.scene.start('BattleScene'));

    // Retrieve the high score
    let highScore = this.sys.game.global ? this.sys.game.global.highScore : 0;

    // Display the high score
    this.add.text(10, 10, 'High Score: ' + highScore, { fontSize: '32px', fill: '#fff' });
  }
}