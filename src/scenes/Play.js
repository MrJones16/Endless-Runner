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
        this.load.image('crosshair', './assets/test_crosshair.png');
      }

    create(){
        this.add.text(0, 0, "Play Scene");

        this.player = new Player(this, game.config.width / 2, game.config.height - borderUISize - borderPadding - 100, 'player').setOrigin(0.5, 0);
        this.crosshair = new Crosshair(this, 0, 0, 'crosshair');
        
    }
    update() {
        //crosshair follows mouse
        var pointer = this.input.activePointer;
        this.crosshair.x = pointer.x;
        this.crosshair.y = pointer.y;
        //check for rocket shoot
        this.input.on('pointerdown', (pointer) => {
            let thenPos = pointer;
            let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, thenPos.x, thenPos.y);            
            this.shoot(angle);
        }, this);

    }
    shoot(angle) {
        this.rocket = new Rocket(this, this.player.x, this.player.y, 'rocket');
        this.rocket.rotation = angle;
        // var rocket = new Rocket({
        //     scene: this.scene,
        //     x: this.player.x,
        //     y: this.player.y
        // });
        // rocket.rotation = angle;
    }
}