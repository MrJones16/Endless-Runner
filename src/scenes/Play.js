class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload() {
        //examples
        //this.load.image('rocket', './assets/rocket.png');
        //this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.image('player', './assets/test_player.png');
        this.load.image('rocket', './assets/test_rocket.png');
      }

    create(){
        this.add.text(0, 0, "Play Scene");

        this.player = new Player(this, game.config.width / 2, game.config.height - borderUISize - borderPadding - 100, 'player').setOrigin(0.5, 0);

    }
    update() {

    }
}