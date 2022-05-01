class Rocket extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'rocket');
        //adds object to existing scene
        scene.add.existing(this);
    }
    fire(angle, x, y, mouseX, mouseY) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.rotation = angle;
        this.scene.physics.moveTo(this, mouseX, mouseY, 1500);
    }
    explode() {
        this.setActive(false);
        this.setVisible(false);
    }
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        if ((this.y <= 0) || (this.y >= 480) || (this.x <= 0) || (this.x >= 640)){
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class Rockets extends Phaser.Physics.Arcade.Group {
    constructor (scene){
        super(scene.physics.world, scene);
        this.createMultiple({
            frameQuantity: 1,
            key: 'rocket',
            active: false,
            visible: false,
            classType: Rocket
        });
    }
    fireRocket(angle, x, y, mouseX, mouseY) {
        let rocket = this.getFirstDead(false);
        if (rocket){
            rocket.fire(angle, x, y, mouseX, mouseY);
        }
    }
    blowUp() {
        let rocket = this.getFirstAlive();
        if (rocket){
            rocket.explode();
        }
    }
    rocketX() {
        let rocket = this.getFirstAlive();
        if (rocket){
            return rocket.x;
        }
    }
    rocketY() {
        let rocket = this.getFirstAlive();
        if (rocket){
            return rocket.y;
        }
    }
}