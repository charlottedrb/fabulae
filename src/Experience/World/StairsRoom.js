import * as THREE from 'three'
import Experience from '../Experience.js'

export default class StairsRoom
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera

        this.setModels()
        this.setCamera()
    }

    setModels()
    {
        this.room = this.resources.items.stairsRoom
        this.stairs = this.resources.items.stairs

        this.scene.add(this.room.scene)
        this.scene.add(this.stairs.scene)
    }

    setCamera() {
        let position = this.resources.items.stairsCamera.scene.children[0].position
        this.camera.instance.position.set(position.x, 2.4, 8.7)

        let rotation = this.resources.items.stairsCamera.scene.children[0].rotation
        this.camera.instance.rotation.set(...rotation)
    }
}