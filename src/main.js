class MyGameScene extends Phaser.Scene {
  constructor() {
      super('myGameScene');
      this.npcs = [
          {
              name: 'Scissor-Swordsman',
              scissors: 60,
              rock: 10,
              paper: 30
          },
          {
              name: 'Rock-Warden',
              scissors: 10,
              rock: 60,
              paper: 30
          },
          {
              name: 'Paper-Ninja',
              scissors: 40,
              rock: 10,
              paper: 50
          },
          {
              name: 'The-Traveler',
              scissors: 34,
              rock: 33,
              paper: 33
          }
      ];
      this.currentNpcIndex = 0;
      this.score = 0;
  }
  
  preload() {
      this.load.image('player', 'src/assets/sprites/Player_RPSD.png');
      this.load.image('npc1', 'src/assets/sprites/npc1.png');
      this.load.image('npc2', 'src/assets/sprites/npc2.png');
      this.load.image('npc3', 'src/assets/sprites/npc3.png');
      this.load.image('npc4', 'src/assets/sprites/npc4.png');
      this.load.image('rock', 'src/assets/sprites/rock.png');
      this.load.image('paper', 'src/assets/sprites/paper.png');
      this.load.image('scissors', 'src/assets/sprites/scissors.png');
  }

  create() {
      this.player = this.physics.add.image(100, 500, 'player').setScale(0.4);      
      this.npc = this.physics.add.image(700, 100, 'npc1').setScale(0.4);
      this.scissors = this.add.image(700, 500, 'scissors').setInteractive().setScale(0.25);
      this.paper = this.add.image(600, 500, 'paper').setInteractive().setScale(0.25);
      this.rock = this.add.image(500, 500, 'rock').setInteractive().setScale(0.25);
      this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
      // this.npcs = npcs;
      this.currentNpcIndex = 0;
      this.score = 0;
      this.rock.on('pointerdown', () => {
          console.log('Rock selected');
          this.playGame('rock');
      });
      this.paper.on('pointerdown', () => {
          console.log('Paper selected');
          this.playGame('paper');
      });
      this.scissors.on('pointerdown', () => {
          console.log('Scissors selected');
          this.playGame('scissors');
      });
  }

  playGame(playerChoice) {
      var npcChoice = this.getNPCChoice();
      var result = this.getGameResult(playerChoice, npcChoice);
      if (result === 'win') {
          this.score++;
          if (this.score > 100) {
              this.scoreText.setText('RPS GOD');
          } else {
              this.scoreText.setText('score: ' + this.score);
          }

          // update NPC
          this.newChallenger();
      }
  }

  getNPCChoice() {
      var npc = this.getCurrentNPC();
      var random = Math.random() * 100;

      if (random < npc.scissors) {
          console.log('NPC chose scissors');
          return 'scissors';
      } else if (random < npc.scissors + npc.rock) {
          console.log('NPC chose rock');
          return 'rock';
      } else {
          console.log('NPC chose paper');
          return 'paper';
      }
  }

  getCurrentNPC() {
      return this.npcs[this.currentNpcIndex];
  }

  newChallenger() {
      var odds = [0, 0, 1, 1, 2, 2, 3]; // The Traveler is at index 3
      var randomIndex = Math.floor(Math.random() * odds.length);
      this.currentNpcIndex = odds[randomIndex];

      // Display "New Challenger Approaches" text
      var challengerText = this.add.text(400, 300, 'New Challenger Approaches', { fontSize: '32px', fill: '#ff0000' });
      challengerText.setOrigin(0.5, 0.5); // Center the text

      var npcImageKey = 'npc' + (this.currentNpcIndex + 1); // Assumes NPC images are named 'npc1', 'npc2', etc.
      this.npc.setTexture(npcImageKey);

      // Remove the text after 3 seconds
      this.time.delayedCall(3000, function() {
          challengerText.destroy();
      }, [], this);
  }

  getGameResult(playerChoice, npcChoice) {
      if (playerChoice === npcChoice) {
          
          var drawText = this.add.text(400, 300, 'Draw!', { fontSize: '32px', fill: '#ff0000' });
          drawText.setOrigin(0.5, 0.5); // Center the text

          // Remove the text after 1 seconds
          this.time.delayedCall(1000, function() {
              drawText.destroy();
          }, [], this);
          
          return 'draw';
      } else if (
          (playerChoice === 'rock' && npcChoice === 'scissors') ||
          (playerChoice === 'paper' && npcChoice === 'rock') ||
          (playerChoice === 'scissors' && npcChoice === 'paper')
      ) {
          return 'win';
      } else {
          var loseText = this.add.text(400, 300, 'Death!', { fontSize: '32px', fill: '#ff0000' });
          loseText.setOrigin(0.5, 0.5); // Center the text

          // Remove the text after 1 seconds
          this.time.delayedCall(1000, function() {
              loseText.destroy();
          }, [], this);
    
          return 'lose';
      }
  }
}

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
  },
  scene: [MyGameScene] // Reference to the MyGameScene class
};

new Phaser.Game(config); // Instantiate the game with the config