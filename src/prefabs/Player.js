class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        //adds object to existing scene
        scene.add.existing(this);
    }
    update() {
        
    }
    reset() {

    }
}