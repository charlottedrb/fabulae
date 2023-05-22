import Experience from "../Experience";
import * as THREE from "three";
import gsap from 'gsap';

export default class LibraryRoom {
    constructor()
    {
        this.experience = new Experience()
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.playCameraAnimationBound = this.playCameraAnimation.bind(this)

        this.setModels()
        this.setCamera()
    }

    init()
    {

    }

    setModels()
    {
        this.room = this.resources.items.libraryRoom
        console.log(this.room);
        this.roomCamera = this.room.scene.getObjectByName('Camera_Bake')
        this.scene.add(this.room.scene)
    }
    
    setCamera()
    {
        this.setCameraAnimation()

        this.camera.instance.position.set(this.roomCamera.position.x, this.roomCamera.position.y, this.roomCamera.position.z)
        this.camera.instance.rotation.set(this.roomCamera.rotation.x, this.roomCamera.rotation.y, this.roomCamera.rotation.z)
    }

    setCameraAnimation()
    {
        this.animMixer = new THREE.AnimationMixer(this.camera.instance)
        this.cameraAction = this.animMixer.clipAction(THREE.AnimationClip.findByName(this.room.animations, 'CameraAction.001'))
        this.cameraAction.setLoop(THREE.LoopPingPong)
        this.cameraAction.clampWhenFinished = true

        console.log(this.cameraAction, this.room.animations);

        setTimeout(() => {
            this.playCameraAnimationBound()
        },0)
    }

    playCameraAnimation()
    {
        this.cameraAction.reset()
        this.cameraAction.play()
    }

    update()
    {
        const cameraInitialPosition = this.cameraAction.getClip().tracks[0].values.slice(0, 3)
        const cameraInitialRotation = this.cameraAction.getClip().tracks[1].values.slice(0, 3)
        this.animMixer.update(this.time.delta / 1000)
    }

    destroy()
    {
        this.experience = null
        this.scene = null
        this.resources = null
        this.camera = null
        this.playCameraAnimationBound = null

        this.room = null
    }
}