import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Stair
{
    constructor(stair, animationClip, doors)
    {
        this.stair = stair
        this.animationClip = animationClip
        this.doors = doors
        this.experience = new Experience()
        this.raycastHandler = this.experience.raycastHandler
        this.time = this.experience.time
        this.canAnim = false

        this.setAnimation()
    }

    setAnimation()
    {
        this.animMixer = new THREE.AnimationMixer(this.stair)
        const clipAction = this.animMixer.clipAction(this.animationClip)
        clipAction.setLoop(THREE.LoopOnce)
        clipAction.clampWhenFinished = true;
        this.setStairsPosition()

        this.setRaycastEvents()
    }

    setStairsPosition() {
        const clipAction = this.animMixer.clipAction(this.animationClip)
        const timeStairsDown = this.animationClip.tracks[0].times[0]

        clipAction.reset()
        clipAction.play()

        this.canAnim = false
        this.animMixer.time = 0
        this.animMixer.update(timeStairsDown)
    }

    setRaycastEvents() {
        this.doors.forEach(door => {
            this.raycastHandler.addObjectToTest(door, () => {
                this.playAnim(this.animationClip)
            }, 'enter')
            this.raycastHandler.addObjectToTest(door, () => {
                this.playAnim(this.animationClip, true)
            }, 'leave')
        });
    }

    playAnim(clip, reverse = false) {
        this.animMixer.time = 0
        this.canAnim = true

        const action = this.animMixer.clipAction(clip)
        action.timeScale = reverse ? -1 : 1

        let isRunning = action.isRunning()
        if (isRunning == false) {
            action.reset()
            if (reverse) {
                action.time = action.getClip().duration;
            }
            action.play()
        }
    }

    freezeCurrentAnimation() {
        const action = this.animMixer.clipAction(this.animationClip)
        if (action.isRunning()) {
            action.clampWhenFinished = true;
        }
    }

    update() {
        if (this.canAnim === true) {
            this.animMixer.update(this.time.delta / 1000)
        }
    }

    destroy() {
        this.stair = null
        this.animationClip = null
        this.doors = null
        this.experience = null
        this.raycastHandler = null
        this.time = null
        this.canAnim = null

        this.animMixer = null
    }
}