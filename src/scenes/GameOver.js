class GameOver extends Phaser.Scene{
    constructor(){
        super("gameOverScene");
    }
    create(){
        let newHigh = false;
        let gameOverConfig = {
          fontFamily: 'Rockwell',
          fontSize: '48px',
          fontStyle: 'bold',
          color: 'darkorange',
          align: 'middle',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding - 200, "Game Over", gameOverConfig).setOrigin(0.5);
        gameOverConfig.color = 'lime';
        this.restartButton = this.add.text(game.config.width/2 - 125, game.config.height/2 + borderUISize + borderPadding + 75, "Restart", gameOverConfig).setOrigin(0.5).setInteractive();
        this.restartButton.on('pointerdown', () => { this.scene.start('playScene'); })
        gameOverConfig.color = 'red';
        this.menuButton = this.add.text(game.config.width/2 + 125, game.config.height/2 + borderUISize + borderPadding + 75, "Menu", gameOverConfig).setOrigin(0.5).setInteractive();
        this.menuButton.on('pointerdown', () => { this.scene.start('menuScene'); })
        gameOverConfig.fontSize = '28px';
        gameOverConfig.color = 'darkorchid';
        this.add.text(game.config.width/2 - 150, game.config.height/2 + borderUISize + borderPadding - 90, "Your Score:", gameOverConfig).setOrigin(0.5);
        gameOverConfig.color = 'goldenrod';
        this.add.text(game.config.width/2 - 150, game.config.height/2 + borderUISize + borderPadding - 40, "High Score:", gameOverConfig).setOrigin(0.5);

        //Score calculation and printing
        if (currScore > highScore){
            highScore = currScore;
            newHigh = true;
        }
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            fontStyle: 'bold',
            color: 'white',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }
        this.add.text(game.config.width/2 + 50, game.config.height/2 + borderUISize + borderPadding - 90, currScore, scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 + 50, game.config.height/2 + borderUISize + borderPadding - 40, highScore, scoreConfig).setOrigin(0.5);
        if (newHigh){
            gameOverConfig.color = 'cyan';
            gameOverConfig.fontSize = '20px';
            this.add.text(game.config.width/2 - 150, game.config.height/2 + borderUISize + borderPadding - 15, "New Best!", gameOverConfig).setOrigin(0.5);
        }

    }

}