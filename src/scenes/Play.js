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
        this.load.image('background', './assets/background.png');
        this.load.image('floor', './assets/floor.png');
        this.load.image('wallofdeath', './assets/wallofdeath.png');
      }

    create(){
        //Creating background tileSprite
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        this.add.text(0, 0, "Play Scene");
        //Physics Groups
        this.mapGroup = this.physics.add.staticGroup();
        //--Wall of death to destroy map and obstacles that go off screen
        this.wallOfDeath = this.physics.add.staticGroup();
        this.wallOfDeath.create(-100, -10, 'wallofdeath'); 
        //Physics Collisions
        //this.physics.add.collider(this.mapGroup, this.wallOfDeath);
        

        this.player = new Player(this, game.config.width / 2, game.config.height - borderUISize - borderPadding - 100, 'player').setOrigin(0.5, 0);
        this.crosshair = new Crosshair(this, 0, 0, 'crosshair');
        
    }
    update() {
        //LEVEL GENERATION------------------------
        //update background
        this.background.tilePositionX += 1;
        //Spawning the floor
        this.mapGroup.create(400, 395, 'floor');
        //spawning the ceiling

        //Spawning enemies/obstacles

        //LEVEL GEN END --------------------------

        //crosshair follows mouse
        var pointer = this.input.activePointer;
        this.crosshair.x = pointer.x;
        this.crosshair.y = pointer.y;
        //check for rocket shoot
        this.input.on('pointerdown', (pointer) => {
            let thenPos = pointer;
            let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, thenPos.x, thenPos.y);            
            this.shoot(angle, thenPos.x, thenPos.y);
        }, this);
        
    }
    shoot(angle, x, y) {
        //this.rocket = new Rocket(this, this.player.x, this.player.y, 'rocket');
        this.rocket = this.physics.add.sprite(this.player.x, this.player.y, 'rocket');
        this.rocket.rotation = angle;
        this.physics.moveTo(this.rocket, x, y, 1500);
        this.rocket.body.collideWorldBounds = true;
        this.rocket.body.onWorldBounds = true;
        // this.physics.world.on('worldbounds', (body, up, down, left, right)=> {
        //     if (up){
        //         this.rocket.destroy();
        //     }
        // })
        // var rocket = new Rocket({
        //     scene: this.scene,
        //     x: this.player.x,
        //     y: this.player.y
        // });
        // rocket.rotation = angle;
    }
}