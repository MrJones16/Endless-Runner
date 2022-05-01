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
     
        this.backButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding + 150, "Back", backConfig).setOrigin(0.5).setInteractive();
        this.backButton.on('pointerdown', () => { this.scene.start('menuScene'); })

        let instructionConfig = {
            fontFamily: 'Rockwell',
            fontSize: '32px',
            color: 'goldenrod',
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
          }
        
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 250, "How To Play", instructionConfig).setOrigin(0.5);
        instructionConfig.fontSize = '14px';
        instructionConfig.color = 'yellow';
        instructionConfig.align = 'left';
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding - 210, "Controls --- Move Crosshair = Mouse / Shoot Rocket = Click", instructionConfig);
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding - 180, "Run as far as you can! Gain points by staying alive and shooting enemies.", instructionConfig);
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding - 150, "Your only way to jump is to ROCKET JUMP!", instructionConfig);
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding - 120, "Shoot the ground below you to propel yourself into the air.", instructionConfig);
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding - 90, "Jump height changes based on how close the explosion is to you.", instructionConfig);
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding - 60, "Running into obstacles and falling into holes will end your run.", instructionConfig);
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding - 30, "Shoot at tanks and helicopters to destroy them!", instructionConfig);
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding, "TIP --- You can launch yourself off of obstacles and enemies, too!", instructionConfig);
    }

}