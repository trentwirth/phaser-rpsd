var npcs = [
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

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: function() {
            this.load.setBaseURL('https://labs.phaser.io');
            this.load.image('player', 'assets/sprites/Player_RPSD.png');
            this.load.image('npc1', 'assets/sprites/npc1.png');
            this.load.image('npc2', 'assets/sprites/npc2.png');
            this.load.image('npc3', 'assets/sprites/npc3.png');
            this.load.image('npc4', 'assets/sprites/npc4.png');
            this.load.image('rock', 'assets/sprites/rock.png');
            this.load.image('paper', 'assets/sprites/paper.png');
            this.load.image('scissors', 'assets/sprites/scissors.png');
        },
        create: function() {
            this.player = this.physics.add.image(100, 500, 'player');
            this.npc = this.physics.add.image(700, 100, 'npc');
            this.rock = this.add.image(200, 500, 'rock').setInteractive();
            this.paper = this.add.image(300, 500, 'paper').setInteractive();
            this.scissors = this.add.image(400, 500, 'scissors').setInteractive();
            this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
            this.npcs = npcs;
            this.currentNpcIndex = 0;
            this.score = 0;

            // create Rock Paper Scissors buttons
            this.rock.on('pointerdown', function () {
                this.playGame('rock');
            }, this);
            this.paper.on('pointerdown', function () {
                this.playGame('paper');
            }, this);
            this.scissors.on('pointerdown', function () {
                this.playGame('scissors');
            }, this);
        },

        playGame: function(playerChoice) {
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
        },

        getNPCChoice: function() {
          var npc = this.getCurrentNPC();
          var random = Math.random() * 100;

          if (random < npc.scissors) {
              return 'scissors';
          } else if (random < npc.scissors + npc.rock) {
              return 'rock';
          } else {
              return 'paper';
          }
        },

        getCurrentNPC: function() {
          return this.npcs[this.currentNpcIndex];
        },

        newChallenger: function() {
            var odds = [0, 0, 1, 1, 2, 2, 3]; // The Traveler is at index 3
            var randomIndex = Math.floor(Math.random() * odds.length);
            this.currentNpcIndex = odds[randomIndex];

            // Display "New Challenger Approaches" text
            var challengerText = this.add.text(400, 300, 'New Challenger Approaches', { fontSize: '32px', fill: '#000' });
            challengerText.setOrigin(0.5, 0.5); // Center the text

            var npcImageKey = 'npc' + (this.currentNpcIndex + 1); // Assumes NPC images are named 'npc1', 'npc2', etc.
            this.npc.setTexture(npcImageKey);

            // Remove the text after 3 seconds
            this.time.delayedCall(3000, function() {
                challengerText.destroy();
            }, [], this);
        },

        getGameResult: function(playerChoice, npcChoice) {
          if (playerChoice === npcChoice) {
                return 'draw';
            } else if (
                (playerChoice === 'rock' && npcChoice === 'scissors') ||
                (playerChoice === 'paper' && npcChoice === 'rock') ||
                (playerChoice === 'scissors' && npcChoice === 'paper')
            ) {
                return 'win';
            } else {
                return 'lose';
            }
        }
    }
};

new Phaser.Game(config);