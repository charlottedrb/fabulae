import Experience from "../Experience";
import * as THREE from "three";
import gsap from 'gsap';
import { throttle } from 'throttle-debounce';

export default class LibraryRoom {
    constructor()
    {
        this.experience = new Experience()
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.timer = null

        this.playCameraAnimationBound = this.playCameraAnimation.bind(this)
        this.resetCameraAnimationBound = this.resetCameraAnimation.bind(this)
        this.pauseCameraAnimationBound = this.pauseCameraAnimation.bind(this)
        this.onScrollBound = throttle(5, this.onScroll.bind(this))

        this.events()
        this.setModels()
        this.setCamera()
    }

    events()
    {
        window.addEventListener('wheel', this.onScrollBound)
    }

    setModels()
    {
        this.room = this.resources.items.libraryRoom
        this.roomShelfDown = this.room.scene.getObjectByName('étagères')
        this.roomCamera = this.room.scene.getObjectByName('Camera_Bake')
        this.scene.add(this.room.scene)
    }
    
    setCamera()
    {
        this.setCameraAnimation()

        this.camera.instance.position.set(this.roomCamera.position.x, this.roomCamera.position.y, this.roomCamera.position.z)
        this.camera.instance.rotation.set(this.roomCamera.rotation.x, this.roomCamera.rotation.y, this.roomCamera.rotation.z)
    }

    onScroll(e) 
    {
        if(this.timer !== null) {
            clearTimeout(this.timer);        
        }
        
        if (e.deltaY < 0) {
            this.cameraAction.timeScale = -1
            this.playCameraAnimationBound()
        } else {
            this.cameraAction.timeScale = 1
            this.playCameraAnimationBound()
        }

        this.timer = setTimeout(() => {
            this.pauseCameraAnimationBound()
        }, 150);
    }

    setCameraAnimation()
    {
        this.animMixer = new THREE.AnimationMixer(this.camera.instance)
        this.cameraAction = this.animMixer.clipAction(THREE.AnimationClip.findByName(this.room.animations, 'CameraAction.001'))
        this.cameraAction.setLoop(THREE.LoopOnce)
        this.cameraAction.clampWhenFinished = true

        setTimeout(() => {
            this.resetCameraAnimationBound()
        },0)
    }

    resetCameraAnimation()
    {
        this.cameraAction.reset()
    }

    playCameraAnimation()
    {
        this.cameraAction.paused = false
        this.cameraAction.play()
    }

    pauseCameraAnimation()
    {
        this.cameraAction.paused = true
    }

    update()
    {
        this.animMixer.update(this.time.delta / 1000)
    }

    destroy()
    {
        this.experience = null
        this.scene = null
        this.resources = null
        this.camera = null
        this.timer = null
        this.playCameraAnimationBound = null

        this.room = null
        this.roomCamera.dispose()
        this.roomCamera = null
        
        window.removeEventListener('scroll', this.onScrollBound)
        this.onScrollBound = null
    }
}