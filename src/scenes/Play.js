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
        this.load.image('helicopter', './assets/test_helicopter.png');
        this.load.image('bullet', './assets/test_bullet.png');
      }

    create(){
        //Creating background tileSprite
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        this.add.text(0, 0, "Version 0.5");

        //create hole shading
        //y = 416 was perfectly aligned with floor
        this.holeShade = this.physics.add.image(0, 450, 'holeshading').setOrigin(0,0);
        this.holeShade.body.allowGravity = false;
        this.holeShade.setImmovable(true);

        //Physics Groups
        this.floorGroup = this.physics.add.group();
        this.obstacleGroup = this.physics.add.group();

        //--Wall of death to destroy map and obstacles that go off screen
        this.wallOfDeath = this.physics.add.staticGroup();
        this.wallOfDeath.create(-520, -10, 'wallofdeath'); 

        //Physics Collisions
        this.physics.add.collider(this.floorGroup, this.wallOfDeath, (floor, wall) => {floor.destroy();});
        this.physics.add.collider(this.obstacleGroup, this.wallOfDeath, (obstacle, wall) => {obstacle.destroy();});


        //Initializing starting floor
        this.floorGroup.create(0, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        this.floorGroup.create(256, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        this.floorGroup.create(512, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        this.floorGroup.create(768, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;

        //Creating repeating floor
        this.floorGroup.create(1024, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        var canHole = true;
        this.levelClockRepeat(true);

        //start obstacle generation
        this.obstacleTimer = 500;
        this.afterfloor = true;
        this.activeHole = false;
        this.obstacleClockRepeat();
        this.obstacleTimer = 1000;
        this.obstacleStartPosition = 1200;

        //TWEAKABLE GAME SETTINGS
        // each time an obstacle spawns, subtracts x miliseconds from spawn timer
        this.obstacleTimeAcceleration = -5;
        //
        this.obstacleTimerMinimum = 200; //min amount of ms that must be waited to spawn another obstacle.
        
        

        //Creating player, crosshair, and rockets
        //this.player = new Player(this, game.config.width / 2 - 200, game.config.height - borderUISize - borderPadding - 100).setOrigin(0.5, 0.5);
        this.player = this.physics.add.sprite(120, 300, 'player');
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

        //player and obstacle collision
        this.physics.add.collider(this.player, this.obstacleGroup, () => {this.scene.restart();});

        this.explosion = this.physics.add.staticGroup();

        //rocket and floor collision
        this.physics.add.overlap(this.rockets, this.floorGroup, () => {
            if ((this.rockets.rocketX() > 0) && (this.rockets.rocketY() > 0)){
                this.explosion.create(this.rockets.rocketX(), this.rockets.rocketY(), 'explosion').setOrigin(0.5, 0.5);
                this.rockets.blowUp();
                this.explosionClock = this.time.delayedCall(100, () => {
                    this.explosion.clear(true);
                }, null, this);
                this.cameras.main.shake(100, 0.01);
            }   
        });

        //rocket and Obstacle collision
        this.physics.add.overlap(this.rockets, this.obstacleGroup, (rocket, obstacle) => {
            if ((this.rockets.rocketX() > 0) && (this.rockets.rocketY() > 0)){
                this.explosion.create(this.rockets.rocketX(), this.rockets.rocketY(), 'explosion').setOrigin(0.5, 0.5);
                this.rockets.blowUp();
                if (obstacle.key == 'helicopter') {
                    this.score += 100;
                }
                obstacle.destroy();
                this.score += 100;
                this.explosionClock = this.time.delayedCall(100, () => {
                    this.explosion.clear(true);
                }, null, this);
                this.cameras.main.shake(100, 0.01);
            }   
        });
        

        //player and explosion collision
        this.physics.add.overlap(this.player, this.explosion, (player, explosion) => {
            if (this.player.body.touching.down){
                //this.player.setVelocityY(-600);
                //console.log(Phaser.Math.Between(this.player.x, 450, explosion.x, 450));
                if ((explosion.x - 120) < 0){
                    var absDist = -(explosion.x - 120);
                } else {
                    var absDist = explosion.x - 120;
                }
                console.log((168 - absDist) * -3.5);
                //this.player.setVelocityY(Phaser.Math.Between(120, 450, explosion.x, 450) * -1.75);
                this.player.setVelocityY((168 - absDist) * -3.5);
                this.cameras.main.shake(100, 0.01);
            }
        });

        //Bullet group and collisions
        this.bulletGroup = this.physics.add.group();
        this.physics.add.collider(this.player, this.bulletGroup, () => {this.scene.restart();});
        this.physics.add.collider(this.obstacleGroup, this.bulletGroup, (obstacle, bullet) => {bullet.destroy();});

        //Player score and points handling
        this.score = 0;
        let scoreConfig = {
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreText = this.add.text(520, 10, this.score, scoreConfig);
        this.timePoints = 10;
        this.timePointsRepeat();
        this.timePointsIncrement();    

        this.canFire = true;

    }
    
    update() {
        //LEVEL GENERATION------------------------
        //update background
        this.background.tilePositionX += 1;

        //Spawning enemies/obstacles

        //LEVEL GEN END --------------------------

        //crosshair follows mouse
        let pointer = this.input.activePointer;
        this.crosshair.x = pointer.x;
        this.crosshair.y = pointer.y;
        //check for rocket shoot
        this.input.on('pointerdown', (pointer) => {
            if (this.canFire == true){
                this.reloadText = this.add.text(10, 10, '[RELOADING]', { fontSize: '32px', fontStyle: 'bold', color: 'red' })
                this.canFire = false;
                let thenPos = pointer;
                let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, thenPos.x, thenPos.y);         
                this.rockets.fireRocket(angle, this.player.x, this.player.y, thenPos.x, thenPos.y);
                this.rocketFireClock = this.time.delayedCall(400, () => { this.canFire = true; this.reloadText.destroy() }, null, this);
            }
                //TEMPORARY JUMP
                // if (this.player.body.touching.down){
                //     this.player.setVelocityY(-600);
                // }
        }, this);
        
        //Update score every frame
        this.scoreText.text = this.score;

        //Kill if X value changes
        if (this.player.x != 120) {this.scene.restart();}

    }

    // Steadily increases player score while playing
    timePointsRepeat(){
        if (this.timePointsClock != null)
        this.timePointsClock.destroy();
        this.timePointsClock = this.time.delayedCall(100, () => {
            this.score += this.timePoints;
            this.timePointsRepeat();
        }, null, this);
    }

    // Increments score increase for staying alive
    timePointsIncrement(){
        if (this.pointIncrementClock != null)
        this.pointIncrementClock.destroy();
        this.pointIncrementClock = this.time.delayedCall(10000, () => {
            this.timePoints += 10;
            this.timePointsIncrement();
        }, null, this);
    }
    
    obstacleClockRepeat(){
        if (this.obstacleClock != null)
        this.obstacleClock.destroy();
        this.obstacleClock = this.time.delayedCall(this.obstacleTimer, () => {
            var rnum = 0;
            if (this.activeHole == false){
                if (Phaser.Math.Between(0, 5) == 0){
                    rnum = Phaser.Math.Between(0, 0);//Hole Obstacle Sets (should not have a higher domain than possible spawn)
                } else{
                    rnum = Phaser.Math.Between(3, 3);//No Hole Obstacle Sets
                }
            }else{
                rnum = Phaser.Math.Between(3, 3);    //No Hole Obstacle Sets
            }
            
            switch (rnum){
                case 0:
                    //Helicopter
                    console.log("Spawning Helicopter with Hole");
                    this.activeHole = true;
                    this.heliShoot(this.obstacleGroup.create(this.obstacleStartPosition, Phaser.Math.Between(125, 250), 'helicopter').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false);
                    break;
                case 3:
                    console.log("Spawning Helicopter");
                    this.heliShoot(this.obstacleGroup.create(this.obstacleStartPosition, Phaser.Math.Between(125, 250), 'helicopter').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false);
                    break;
                default:
                    console.log("Spawning Nothing");
                    break;
            }
            if (this.obstacleTimer > this.obstacleTimerMinimum)
            this.obstacleTimer += this.obstacleTimeAcceleration;
            this.obstacleClockRepeat();
        }, null, this);
    }

    levelClockRepeat(){
        if (this.levelGenerationClock != null)
        this.levelGenerationClock.destroy();
        this.levelGenerationClock = this.time.delayedCall(1000, () => {
            if (this.activeHole && this.afterfloor){
                console.log("Creating hole");
                this.afterfloor = false;
            }
            else{
                console.log("Placing floor");
                this.floorGroup.create(1024, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                this.afterfloor = true;
                this.activeHole = false;
            }
            //repeat Clock
            this.levelClockRepeat();
        }, null, this);
    }

    heliShoot(heli){
        if (heli){
            //this.newBullet = this.bulletGroup.create(heli.x, heli.y, 'bullet').setOrigin(0,0).body.allowGravity = false;
            this.bulletGroup.create(heli.x, heli.y, 'bullet').setOrigin(0,0).body.allowGravity = false;
            //this.newBullet.scene.physics.moveTo(this.newBullet, heli.x + 100, 640, 1000);
            this.bulletClock = this.time.delayedCall(1000, () => {
                this.heliShoot(heli);
            })
        }
    }
}