class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
        this.rockets;
    }

    preload() {
        this.load.image('rocket', './assets/missile.png');
        this.load.image('crosshair', './assets/test_crosshair.png');
        this.load.image('clouds', './assets/runner_bg_clouds.png')
        this.load.image('sun', './assets/runner_bg_sun.png');
        this.load.image('mountains', './assets/runner_bg_mnt (no filter).png')
        this.load.image('floor', './assets/floor.png');
        this.load.image('wallofdeath', './assets/wallofdeath.png');
        this.load.image('holeshading', './assets/holeshading.png');
        this.load.image('sandbags', './assets/sandbags.png');
        this.load.image('launcher', './assets/launcher_smallcanvas.png');
        this.load.audio('sfx_launch', './assets/rocket_launch.wav');
        this.load.audio('sfx_explosion', './assets/rocket_explosion.wav');
        this.load.atlas('playeranims', './assets/Player_Sprite_Move.png', './assets/Player_Sprite_Move.json');
        this.load.spritesheet('helicopter', './assets/helicopter-sheet.png', { frameWidth: 128, frameHeight: 64 });
        this.load.spritesheet('tank', './assets/TankRedrawn-sheet.png', { frameWidth: 121, frameHeight: 54 });
        this.load.atlas('explosionanims', './assets/explosion_anim.png', './assets/explosion_anim.json');
    }

    create(){
        //Sound add
        this.explosionSfx = this.sound.add('sfx_explosion', {volume: 0.25});
        this.launchSfx = this.sound.add('sfx_launch', {volume: 0.75});

        //Creating background tileSprites
        this.add.tileSprite(0, 0, 640, 480, 'sun').setOrigin(0, 0);
        this.bgMountains = this.add.tileSprite(0, 0, 640, 480, 'mountains').setOrigin(0, 0);
        this.bgClouds = this.add.tileSprite(0, 0, 640, 480, 'clouds').setOrigin(0, 0).setAlpha(0.75);

        //create hole shading
        this.holeShade = this.physics.add.image(0, 450, 'holeshading').setOrigin(0,0);
        this.holeShade.body.allowGravity = false;
        this.holeShade.setImmovable(true);

        //Physics Groups
        this.floorGroup = this.physics.add.group();
        this.obstacleGroup = this.physics.add.group();
        this.unbreakableObstacleGroup = this.physics.add.group();

        //--Wall of death to destroy map and obstacles that go off screen
        this.wallOfDeath = this.physics.add.staticGroup();
        this.wallOfDeath.create(-520, -10, 'wallofdeath'); 

        //Physics Collisions
        this.physics.add.collider(this.floorGroup, this.wallOfDeath, (floor, wall) => {floor.destroy();});
        this.physics.add.collider(this.obstacleGroup, this.wallOfDeath, (obstacle, wall) => {obstacle.destroy();});
        this.physics.add.collider(this.unbreakableObstacleGroup, this.wallOfDeath, (uObstacle, wall) => {uObstacle.destroy();});

        //Initializing starting floor
        this.floorGroup.create(0, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        this.floorGroup.create(256, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        this.floorGroup.create(512, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        this.floorGroup.create(768, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;

        //Creating repeating floor
        this.floorGroup.create(1024, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
        this.levelClockRepeat(true);

        //start obstacle generation
        this.obstacleTimer = 500;
        this.afterfloor = true;
        this.activeHole = false;
        this.obstacleClockRepeat();
        this.obstacleTimer = 1000;
        this.obstacleStartPosition = 1200;

        //TWEAKABLE GAME SETTINGS
        //
        //Difficulty thresholds
        //
        //time in seconds to get to medium difficulty:
        this.difficultyMediumThresh = 30;
        //time in seconds to get to hard difficulty:
        this.difficultyHardThresh = 60;  

        // Create animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('playeranims', {
                prefix: 'Player_Sprite_Move ',
                start: 1,
                end: 2,
                suffix: ".aseprite",
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('playeranims', {
                prefix: 'Player_Sprite_Move ',
                start: 3,
                end: 3,
                suffix: ".aseprite",
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('helicopter', {frames: [0, 1, 2]}),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'tread',
            frames: this.anims.generateFrameNumbers('tank', {frames: [0, 1]}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNames('explosionanims', {
                prefix: 'explosion_anim ',
                start: 0,
                end: 12,
                suffix: ".aseprite",
                zeroPad: 2
            }),
            frameRate: 100,
        })

        //Creating player, crosshair, and rockets
        this.player = this.add.sprite(0, 0, 'playeranims');
        this.launcher = this.add.sprite(0, 10, 'launcher');
        this.playerCont = this.add.container(120, 300, [this.player, this.launcher]);
        this.playerCont.setSize(60, 62);
        this.physics.world.enable(this.playerCont);
        this.crosshair = new Crosshair(this, 0, 0, 'crosshair');
        this.crosshair.depth = 10;
        this.rockets = new Rockets(this);

        //player and floor collision
        this.playerCont.body.friction.x = 0;
        this.physics.add.collider(this.playerCont, this.floorGroup);
        this.physics.add.overlap(this.playerCont, this.holeShade, () => {
            this.scene.start('gameOverScene');
        });

        //player and obstacle collision
        this.physics.add.collider(this.playerCont, this.obstacleGroup, () => {this.scene.start('gameOverScene');});
        this.physics.add.collider(this.playerCont, this.unbreakableObstacleGroup);

        //Explosion group
        this.explosion = this.physics.add.staticGroup();

        //rocket and floor collision
        this.physics.add.overlap(this.rockets, this.floorGroup, () => {
            if ((this.rockets.rocketX() > 0) && (this.rockets.rocketY() > 0)){
                this.explosion.create(this.rockets.rocketX(), this.rockets.rocketY(), 'explosionanims').setOrigin(0.5, 0.5).play('boom');
                this.explosionSfx.play();
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
                this.explosion.create(this.rockets.rocketX(), this.rockets.rocketY(), 'explosionanims').setOrigin(0.5, 0.5).play('boom');
                this.explosionSfx.play();
                this.rockets.blowUp();
                obstacle.destroy();
                currScore += 100;
                this.explosionClock = this.time.delayedCall(100, () => {
                    this.explosion.clear(true);
                }, null, this);
                this.cameras.main.shake(100, 0.0075);
            }   
        });
        this.physics.add.overlap(this.rockets, this.unbreakableObstacleGroup, (rocket, obstacle) => {
            if ((this.rockets.rocketX() > 0) && (this.rockets.rocketY() > 0)){
                this.explosion.create(this.rockets.rocketX(), this.rockets.rocketY(), 'explosionanims').setOrigin(0.5, 0.5).play('boom');
                this.explosionSfx.play();
                this.rockets.blowUp();
                this.explosionClock = this.time.delayedCall(100, () => {
                    this.explosion.clear(true);
                }, null, this);
                this.cameras.main.shake(100, 0.0075);
            }   
        });

        //player and explosion collision
        this.physics.add.overlap(this.playerCont, this.explosion, (playerContainer, explosion) => {
            if (playerContainer.body.touching.down){
                if ((explosion.x - 120) < 0){
                    var absDist = -(explosion.x - 120);
                } else {
                    var absDist = explosion.x - 120;
                }
                playerContainer.body.setVelocityY((168 - absDist) * -3.5);
                this.cameras.main.shake(100, 0.01);
            }
        }); 

        //Player score and points handling
        currScore = 0;
        let scoreConfig = {
            fontSize: '28px',
            fontStyle: 'bold',
            color: 'deepskyblue',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreText = this.add.text(520, 10, currScore, scoreConfig);
        this.timePoints = 10;
        this.timePointsRepeat();
        this.timePointsIncrement();    

        this.canFire = true;

        //setting base value of difficulty settings(can't make lower)
        this.difficultyLevelLower = 3;
        this.difficultyLevel = 5;
        this.difficultyCounter = 0;

    }
    
    update() {
        //update backgrounds (parallax scrolling)
        this.bgMountains.tilePositionX += 1;
        this.bgClouds.tilePositionX += 0.5;

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
                let angle = Phaser.Math.Angle.Between(this.playerCont.x, this.playerCont.y, thenPos.x, thenPos.y);
                this.launchSfx.play();
                this.rockets.fireRocket(angle, this.playerCont.x, this.playerCont.y + 10, thenPos.x, thenPos.y);
                this.rocketFireClock = this.time.delayedCall(400, () => { this.canFire = true; this.reloadText.destroy() }, null, this);
            }
        }, this);
        
        //Update score every frame
        this.scoreText.text = currScore;

        //Kill if X value changes
        if (this.playerCont.x != 120) {this.scene.start('gameOverScene');}

        //Launcher aim direction
        this.launcher.rotation = Phaser.Math.Angle.Between(this.playerCont.x, this.playerCont.y + 10, pointer.x, pointer.y);

        //Jump vs walk animation
        if (this.playerCont.y <= 330){
            this.player.play('jump');
            this.inAir = true;
        } else if (this.inAir){
            this.player.play('walk');
            this.inAir = false;
        }

    }

    // Steadily increases player score while playing
    timePointsRepeat(){
        if (this.timePointsClock != null)
        this.timePointsClock.destroy();
        this.timePointsClock = this.time.delayedCall(100, () => {
            currScore += this.timePoints;
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
    
    // Spawns obstacles; over time gets more difficult
    obstacleClockRepeat(){
        if (this.obstacleClock != null)
        this.obstacleClock.destroy();
        this.obstacleClock = this.time.delayedCall(this.obstacleTimer, () => {
            var rnum = 0;
            if (this.activeHole == false){
                if (Phaser.Math.Between(0, 5) == 0){
                    rnum = Phaser.Math.Between(0, 0);//Hole Obstacle Sets (should not have a higher domain than possible spawns)
                } else{
                    rnum = Phaser.Math.Between(this.difficultyLevelLower, this.difficultyLevel);//No Hole Obstacle Sets
                }
            }else{
                rnum = Phaser.Math.Between(this.difficultyLevelLower, this.difficultyLevel);    //No Hole Obstacle Sets
            }
            
            switch (rnum){
                case 0:
                    //Helicopter with hole
                    this.activeHole = true;
                    let heliH = this.obstacleGroup.create(this.obstacleStartPosition, Phaser.Math.Between(125, 250), 'helicopter').setOrigin(0,0).setVelocityX(-250).setImmovable(true);
                    heliH.play('fly');
                    heliH.body.allowGravity = false;
                    break;
                case 3:             //EASY OBSTACLES
                    //helicopter no hole
                    let heli = this.obstacleGroup.create(this.obstacleStartPosition, Phaser.Math.Between(125, 250), 'helicopter').setOrigin(0,0).setVelocityX(-250).setImmovable(true);
                    heli.play('fly');
                    heli.body.allowGravity = false;
                    //this.heliShoot(heli);
                    break;
                case 4:
                    //tank
                    this.obstacleGroup.create(this.obstacleStartPosition + Phaser.Math.Between(-40, 40), 362, 'tank').setOrigin(0,0).play('tread').setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                    break;
                case 5:
                    //sandbag
                    this.unbreakableObstacleGroup.create(this.obstacleStartPosition + Phaser.Math.Between(-40, 40), 382, 'sandbags').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                    break;
                case 6:             //MEDIUM OBSTACLES
                    //Heli with Sandbag
                    let heliS = this.obstacleGroup.create(this.obstacleStartPosition, Phaser.Math.Between(125, 250), 'helicopter').setOrigin(0,0).setVelocityX(-250).setImmovable(true);
                    heliS.play('fly');
                    heliS.body.allowGravity = false;
                    //helishoot
                    this.unbreakableObstacleGroup.create(this.obstacleStartPosition + Phaser.Math.Between(-40, 40), 382, 'sandbags').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                    break;
                case 7:
                    //sandbags and a tank
                    this.unbreakableObstacleGroup.create(this.obstacleStartPosition -20, 382, 'sandbags').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                    this.obstacleGroup.create(this.obstacleStartPosition+50, 362, 'tank').setOrigin(0,0).play('tread').setVelocityX(-250).setImmovable(true).body.allowGravity = false;

                    break;
                case 8:
                    //tank and heli
                    let heliT = this.obstacleGroup.create(this.obstacleStartPosition, Phaser.Math.Between(125, 250), 'helicopter').setOrigin(0,0).setVelocityX(-250).setImmovable(true);
                    heliT.play('fly');
                    heliT.body.allowGravity = false;
                    //helishoot
                    this.obstacleGroup.create(this.obstacleStartPosition + Phaser.Math.Between(-40, 40), 362, 'tank').setOrigin(0,0).play('tread').setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                    break;
                case 9:             //HARD OBSTACLES
                    //Helicopter with 2 sandbags
                    let heli2S = this.obstacleGroup.create(this.obstacleStartPosition, Phaser.Math.Between(125, 250), 'helicopter').setOrigin(0,0).setVelocityX(-250).setImmovable(true);
                    heli2S.play('fly');
                    heli2S.body.allowGravity = false;
                    this.unbreakableObstacleGroup.create(this.obstacleStartPosition -20, 382, 'sandbags').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                    this.unbreakableObstacleGroup.create(this.obstacleStartPosition +40, 382, 'sandbags').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                    break;
                case 10:
                    //2 helicopters and a tank
                    let heliD1 = this.obstacleGroup.create(this.obstacleStartPosition-40, Phaser.Math.Between(125, 250), 'helicopter').setOrigin(0,0).setVelocityX(-250).setImmovable(true);
                    heliD1.play('fly');
                    heliD1.body.allowGravity = false;
                    //helishoot
                    let heliD2 = this.obstacleGroup.create(this.obstacleStartPosition+60, Phaser.Math.Between(125, 250), 'helicopter').setOrigin(0,0).setVelocityX(-250).setImmovable(true);
                    heliD2.play('fly');
                    heliD2.body.allowGravity = false;
                    //helishoot
                    this.obstacleGroup.create(this.obstacleStartPosition + Phaser.Math.Between(-40, 40), 362, 'tank').setOrigin(0,0).play('tread').setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                    break;
                case 11:
                    //2 tanks and a helicopter
                    this.obstacleGroup.create(this.obstacleStartPosition - 50, 362, 'tank').setOrigin(0,0).play('tread').setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                    this.obstacleGroup.create(this.obstacleStartPosition + 60, 362, 'tank').setOrigin(0,0).play('tread').setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                    let heli2T = this.obstacleGroup.create(this.obstacleStartPosition, Phaser.Math.Between(125, 250), 'helicopter').setOrigin(0,0).setVelocityX(-250).setImmovable(true);
                    heli2T.play('fly');
                    heli2T.body.allowGravity = false;
                    //helishoot
                    break;
                default:
                    break;
            }
            this.difficultyCounter++;
            if (this.difficultyCounter == this.difficultyHardThresh){
                //enable hard difficulty
                this.difficultyLevelLower = 6
                this.difficultyLevel = 11;
            } else if (this.difficultyCounter == this.difficultyMediumThresh){
                //enable medium difficulty
                this.difficultyLevel = 8;
            }
            this.obstacleClockRepeat();
        }, null, this);
    }

    // Hole generation loop
    levelClockRepeat(){
        if (this.levelGenerationClock != null)
        this.levelGenerationClock.destroy();
        this.levelGenerationClock = this.time.delayedCall(1000, () => {
            if (this.activeHole && this.afterfloor){
                this.afterfloor = false;
            }
            else{
                this.floorGroup.create(1024, 416, 'floor').setOrigin(0,0).setVelocityX(-250).setImmovable(true).body.allowGravity = false;
                this.afterfloor = true;
                this.activeHole = false;
            }
            //repeat Clock
            this.levelClockRepeat();
        }, null, this);
    }
}