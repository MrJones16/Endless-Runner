class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
        this.rockets;
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
        this.load.image('holeshading', './assets/holeshading.png');
        this.load.image('explosion', './assets/test_explosion.png');
      }

    create(){
        //Creating background tileSprite
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        this.add.text(0, 0, "Play Scene");

        //create hole shading
        //y = 416 was perfectly aligned with floor
        this.holeShade = this.physics.add.image(0, 450, 'holeshading').setOrigin(0,0);
        this.holeShade.body.allowGravity = false;
        this.holeShade.setImmovable(true);

        //Physics Groups
        this.floorGroup = this.physics.add.group();

        //--Wall of death to destroy map and obstacles that go off screen
        this.wallOfDeath = this.physics.add.staticGroup();
        this.wallOfDeath.create(-520, -10, 'wallofdeath'); 

        //Physics Collisions
        this.physics.add.collider(this.floorGroup, this.wallOfDeath, (floor, wall) => {floor.destroy();});

        //Initializing starting floor
        this.floorGroup.create(0, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        this.floorGroup.create(256, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        this.floorGroup.create(512, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        this.floorGroup.create(768, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;

        //Creating repeating floor
        this.floorGroup.create(1024, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        var canHole = true;
        this.levelClockRepeat(canHole);

        //Creating player, crosshair, and rockets
        //this.player = new Player(this, game.config.width / 2 - 200, game.config.height - borderUISize - borderPadding - 100).setOrigin(0.5, 0.5);
        this.player = this.physics.add.sprite(game.config.width / 2 - 200, game.config.height - borderUISize - borderPadding - 100, 'player');
        this.crosshair = new Crosshair(this, 0, 0, 'crosshair');
        this.crosshair.depth = 10;
        this.rockets = new Rockets(this);

        //player and floor collision
        this.player.body.friction.x = 0;
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.floorGroup);
        this.physics.add.overlap(this.player, this.holeShade, () => {
            this.scene.restart();
        });

        this.explosion = this.physics.add.staticGroup();

        // //rocket and floor collision
        this.physics.add.overlap(this.rockets, this.floorGroup, () => {
            if ((this.rockets.rocketX() > 0) && (this.rockets.rocketY() > 0)){
                this.explosion.create(this.rockets.rocketX(), this.rockets.rocketY(), 'explosion');
                this.rockets.blowUp();
                this.explosionClock = this.time.delayedCall(100, () => {
                    this.explosion.clear(true);
                }, null, this);
            }   
        });

        //player and explosion collision
        this.physics.add.overlap(this.player, this.explosion, () => {
            if (this.player.body.touching.down){
                this.player.setVelocityY(-600);
            }
        });

    }
    
    update() {
        //LEVEL GENERATION------------------------
        //update background
        this.background.tilePositionX += 1;

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
            this.rockets.fireRocket(angle, this.player.x, this.player.y, thenPos.x, thenPos.y);
            //TEMPORARY JUMP
            // if (this.player.body.touching.down){
            //     this.player.setVelocityY(-600);
            // }
        }, this);
        

    }
    
    obstacleClockRepeat(){
        if (this.obstacleClock != null)
        this.obstacleClock.destroy();
        this.obstacleClock = this.time.delayedCall(1000, () => {
            var rnum = Phaser.Math.Between(0, 1);
            switch (rnum){
                case 0:
                    //Helicopter

                    break;
                case 1:
                    //nothing
                    break;
                default:
                    console.warn("Obstacle Clock had default case!");
                    break;
            }
            this.levelClockRepeat(holeBool);
        }, null, this);
    }

    levelClockRepeat(holeBool){
        if (this.levelGenerationClock != null)
        this.levelGenerationClock.destroy();
        this.levelGenerationClock = this.time.delayedCall(1000, () => {
            if (Phaser.Math.Between(0, 3) == 0 && holeBool){
                console.log("Creating hole");
                holeBool = false;
            }
            else{
                console.log("Placing floor");
                this.floorGroup.create(1024, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                holeBool = true;
            }
            //repeat Clock
            this.levelClockRepeat(holeBool);
        }, null, this);
    }
    //shoot(angle, x, y) {
        //this.rocket = new Rocket(this, this.player.x, this.player.y, 'rocket');
        //this.rocket = this.physics.add.sprite(this.player.x, this.player.y, 'rocket');
        //this.rocket.rotation = angle;
        //this.physics.moveTo(this.rocket, x, y, 1500);
        //this.rocket.body.collideWorldBounds = true;
        //this.rocket.body.onWorldBounds = true;

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
    //}
}