class Credits extends Phaser.Scene{
    constructor(){
        super("creditsScene");
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

        let creditsConfig = {
            fontFamily: 'Rockwell',
            fontSize: '32px',
            fontStyle: 'bold',
            color: 'darkorchid',
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 250, "Credits", creditsConfig).setOrigin(0.5);
        creditsConfig.fontSize = '20px';
        creditsConfig.color = 'orchid';
        creditsConfig.align = 'left';
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding - 210, "Dominic Berardi --- Player, Rocket, and Menu Programming", creditsConfig);
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding - 150, "Peyton Jones --- Obstacle and Level Programming, Sprites", creditsConfig);
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding - 90, "Luis Acevedo --- Sprites and Animation", creditsConfig);
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding, "Music: “Rocket Station”, from PlayOnLoop.com", creditsConfig);
        this.add.text(game.config.width/2 - 275, game.config.height/2 + borderUISize + borderPadding + 20, "Licensed under Creative Commons by Attribution 4.0", creditsConfig);
    }
}