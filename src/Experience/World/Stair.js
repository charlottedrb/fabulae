import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Stair
{
    constructor(stair, animationClip, door)
    {
        this.stair = stair
        this.animationClip = animationClip
        this.door = door
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
        this.setStairsPosition()

        this.setRaycast()
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

    setRaycast() {
        this.raycastHandler.addObjectToTest(this.door, () => {
            this.playAnim(this.animationClip)
        }, 'enter')
        this.raycastHandler.addObjectToTest(this.door, () => {
            this.playAnim(this.animationClip, true)
        }, 'leave')
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

        const onFinishPlaying = (info) => {
            this.canAnim = false
            if (reverse) {
                this.setStairsPosition()
            }
            this.animMixer.removeEventListener("finished", onFinishPlaying)
        }
        this.animMixer.addEventListener("finished", onFinishPlaying)
    }

    update() {
        if (this.canAnim === true) {
            this.animMixer.update(this.time.delta / 1000)
        }
    }
}