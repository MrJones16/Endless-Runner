let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 1000},
        debug: false
      }
    },
    scene: [Menu, Play]
  }

let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let keyLEFT, keyRIGHT;

// MOD: Background music variable
var musicStarted = false;
