class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        //adds object to existing scene
        scene.add.existing(this);
    }
    create() {
        
    }
    update() {
        
    }
    reset() {

    }
}