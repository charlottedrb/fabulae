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

        this.setVideo()
        this.setBackgroundSize()
    }

    setCamera() {
        // let position = this.resources.items.stairsRoom.scene.children[0].position
        this.camera.instance.position.set(0, 2.4, 8.7)

        let rotation = this.resources.items.stairsRoom.scene.children[0].rotation
        this.camera.instance.rotation.set(...rotation)
    }

    setVideo()
    {
        this.video = document.getElementById('video');
        this.video.play();
        this.setBackground()
    }

    setBackground()
    {
        this.texture = new THREE.VideoTexture(this.video);
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.flipY = false;
        this.texture.needsUpdate = true;

        this.material = new THREE.MeshBasicMaterial( {map: this.texture, side: THREE.FrontSide, toneMapped: false} );

        this.setBackgroundVideo()
    }

    setBackgroundVideo() {
        this.room.scene.children[8].material = this.material
    }

    setBackgroundSize() {
        this.room.scene.children[8].geometry.scale(1.3, 1.3, 1.3)
    }

    update() {
        this.leftStair.update()
        this.rightStair.update()
    }
}