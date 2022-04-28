class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.image('background', './assets/background.png');
        this.load.audio('bgm', './assets/POL-rocket-station-short.wav');
      }

    create(){
        // Play and loop background music
        if (!musicStarted) {
          let musicConfig = {
              volume: 0.4,
              loop: true
          }
          var bgm = this.sound.add('bgm', musicConfig);
          bgm.play();
          musicStarted = true;
        }

        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        //this.scene.start("playScene");
        let menuConfig = {
            fontFamily: 'Rockwell',
            fontSize: '48px',
            fontStyle: 'bold',
            color: 'black',
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding - 100, "SUPER ROCKET JUMPER", menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - 75, "~endless runner~", menuConfig).setOrigin(0.5);
        menuConfig.color = "lime";
        this.startButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, "Start", menuConfig).setOrigin(0.5).setInteractive();
        this.startButton.on('pointerdown', () => { this.scene.start('playScene'); })
        menuConfig.color = "yellow";
        this.instrButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 75, "Instructions", menuConfig).setOrigin(0.5).setInteractive();
        this.instrButton.on('pointerdown', () => { this.scene.start('instructionScene'); })
        menuConfig.color = "red";
        this.exitButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 150, "Exit", menuConfig).setOrigin(0.5).setInteractive();
        this.exitButton.on('pointerdown', () => { game.destroy(); })

    }

    update() {
       
    }
}

class Instruction extends Phaser.Scene{
    constructor(){
        super("instructionScene");
    }
    create(){
        let backConfig = {
          fontFamily: 'Rockwell',
          fontSize: '48px',
          fontStyle: 'bold',
          color: 'dodgerblue',
          align: 'middle',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
        }
     
        this.backButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 75, "Back", backConfig).setOrigin(0.5).setInteractive();
        this.backButton.on('pointerdown', () => { this.scene.start('menuScene'); })
    }

}