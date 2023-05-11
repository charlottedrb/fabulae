import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Stairs
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.animationHandler = this.experience.animationHandler

        this.setModel()
        this.setAnimations()
        this.playAnimations()
    }

    setModel()
    {
        this.stairs = this.resources.items.stairsModel
        this.stairs.scene.scale.set(0.5, 0.5, 0.5)
        this.stairs.scene.position.y = this.stairs.scene.position.y + 0.5
        this.scene.add(this.stairs.scene)
    }

    setAnimations() {
        this.stairs.animations.forEach((anim, index) => {
            this.animationHandler.add(anim, `Stone${index}`)
        });
    }

    playAnimations() {
        for (let index = 0; index < this.stairs.animations.length; index++) {
            this.animationHandler.play(`Stone${index}`)
        }
    }
}