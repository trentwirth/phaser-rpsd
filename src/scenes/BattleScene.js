export default class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
        this.npcs = [
            {
                name: 'Scissor-Swordsman',
                scissors: 75,
                rock: 10,
                paper: 15
            },
            {
                name: 'Rock-Warden',
                scissors: 10,
                rock: 75,
                paper: 15
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
        this.load.image('player', 'assets/sprites/Player_RPSD.png');
        this.load.image('npc1', 'assets/sprites/npc1.png');
        this.load.image('npc2', 'assets/sprites/npc2.png');
        this.load.image('npc3', 'assets/sprites/npc3.png');
        this.load.image('npc4', 'assets/sprites/npc4.png');
        this.load.image('rock', 'assets/sprites/rock.png');
        this.load.image('paper', 'assets/sprites/paper.png');
        this.load.image('scissors', 'assets/sprites/scissors.png');
    }
  
    create() {
        this.playerState = this.registry.get('playerState');
        this.player = this.physics.add.image(100, 500, 'player').setScale(0.4);      
        this.npc = this.physics.add.image(600, 200, 'npc1').setScale(0.4);
        this.scissors = this.add.image(700, 500, 'scissors').setInteractive().setScale(0.25);
        this.paper = this.add.image(600, 500, 'paper').setInteractive().setScale(0.25);
        this.rock = this.add.image(500, 500, 'rock').setInteractive().setScale(0.25);
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
        this.hpText = this.add.text(16, 48, 'HP: ' + this.playerState.hp, { fontSize: '32px', fill: '#fff' });
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
        var challengerText = this.add.text(400, 300, 'New Challenger Approaches', { fontSize: '32px', fill: '#ff0000', fontWeight: 'bold' });
        challengerText.setOrigin(0.5, 0.5); // Center the text
  
        // Fade out the NPC image
        this.tweens.add({
          targets: this.npc,
          alpha: 0,
          duration: 1000,
          onComplete: function() {
              var npcImageKey = 'npc' + (this.currentNpcIndex + 1); // Assumes NPC images are named 'npc1', 'npc2', etc.
              this.npc.setTexture(npcImageKey);
              this.npc.setAlpha(1); // Reset the alpha to make the new NPC image visible
          },
          callbackScope: this // Make sure "this" refers to the scene in the onComplete callback
        });
  
        // Remove the text after 0.25 seconds
        this.time.delayedCall(250, function() {
            challengerText.destroy();
        }, [], this);
    }
  
    getGameResult(playerChoice, npcChoice) {
        if (playerChoice === npcChoice) {
          // ...
        } else if (
          (playerChoice === 'rock' && npcChoice === 'scissors') ||
          (playerChoice === 'paper' && npcChoice === 'rock') ||
          (playerChoice === 'scissors' && npcChoice === 'paper')
        ) {
          return 'win';
        } else {
          // Check the player's HP
          if (this.playerState.hp > 1) {
            // The player takes damage
            this.playerState.hp--;
            var damageText = this.add.text(400, 300, 'DAMAGE', { fontSize: '32px', fill: '#ff0000' });
            damageText.setOrigin(0.5, 0.5); // Center the text
    
            this.hpText.setText('HP: ' + this.playerState.hp); // Update the HP text
            
            this.registry.set('playerState', this.playerState);

            // Remove the text after .5 seconds
            this.time.delayedCall(500, function() {
              damageText.destroy();
            }, [], this);
    
            return 'draw';
          } else {
            // Remove the buttons
            this.rock.destroy();
            this.paper.destroy();
            this.scissors.destroy();

            var loseText = this.add.text(400, 300, 'Death!', { fontSize: '32px', fill: '#ff0000' });
            loseText.setOrigin(0.5, 0.5); // Center the text
  
            // Remove the text after 1 seconds
            this.time.delayedCall(1000, function() {
              loseText.destroy();
            }, [], this);
            
            // Store the high score
            this.sys.game.global = this.sys.game.global || {};
            this.sys.game.global.highScore = Math.max(this.score, this.sys.game.global.highScore || 0);
            
            // Delay the switch back to the StartScene by 2 seconds
            this.time.delayedCall(2000, function() {
                this.scene.start('StartScene');
            }, [], this);

            return 'lose';
          }
      }
    }    
}
