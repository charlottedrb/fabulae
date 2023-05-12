import * as THREE from 'three'
import Experience from '../Experience.js'
import Stair from './Stair.js'

export default class StairsRoom
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.raycastHandler = this.experience.raycastHandler
        this.time = this.experience.time
        this.canAnim = false

        this.setModels()
        this.setCamera()
    }

    setModels()
    {
        this.room = this.resources.items.stairsRoom
        this.stairs = this.resources.items.stairs

        this.scene.add(this.room.scene)
        this.scene.add(this.stairs.scene)

        this.leftStair = new Stair(this.stairs.scene.children[0], this.stairs.animations[0], this.room.scene.children[1])
        this.rightStair = new Stair(this.stairs.scene.children[1], this.stairs.animations[1], this.room.scene.children[4])
    }

    setCamera() {
        // let position = this.resources.items.stairsRoom.scene.children[0].position
        this.camera.instance.position.set(0, 2.4, 8.7)

        let rotation = this.resources.items.stairsRoom.scene.children[0].rotation
        this.camera.instance.rotation.set(...rotation)
    }

    update() {
        this.leftStair.update()
        this.rightStair.update()
    }
}