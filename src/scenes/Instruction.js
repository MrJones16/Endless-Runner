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