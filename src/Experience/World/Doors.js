import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Doors
{
    constructor(scene, doors, doorsAnimationClips)
    {
        this.scene = scene
        this.doors = doors
        this.doorsAnimationClips = doorsAnimationClips
        this.experience = new Experience()
        this.raycastHandler = this.experience.raycastHandler
        this.time = this.experience.time

        this.setAnimation()
    }

    setAnimation()
    {
        this.animMixer = new THREE.AnimationMixer(this.scene)
        this.doorsAnimationClips.forEach(clip => {
            const clipAction = this.animMixer.clipAction(clip)
            clipAction.setLoop(THREE.LoopOnce)
            clipAction.clampWhenFinished = true;
        });

        // this.setRaycastEvents()
    }

    openDoors() {
        this.playAnim(this.doorsAnimationClips[0])
        this.playAnim(this.doorsAnimationClips[1])
    }

    setRaycastEvents() {
        this.doors.forEach(door => {
            this.raycastHandler.addObjectToTest(door, () => {
                this.playAnim(this.doorsAnimationClips[0])
                this.playAnim(this.doorsAnimationClips[1])
            }, 'click')
        });
    }

    playAnim(clip) {
        const action = this.animMixer.clipAction(clip)
        let isRunning = action.isRunning()
        if (isRunning == false) {
            action.reset()
            action.play()
        }
    }

    update() {
        this.animMixer.update(this.time.delta / 1000)
    }

    destroy() {
        this.scene = null
        this.doors = null
        this.doorsAnimationClips = null
        this.experience = null
        this.raycastHandler = null
        this.time = null

        this.animMixer = null
    }
}