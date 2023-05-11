import * as THREE from 'three'
import Experience from './Experience.js'

export default class AnimationHandler
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.actions = []
        this.mixer = new THREE.AnimationMixer(this.scene)
    }

    update() {
        if(this.mixer)
        {
            this.mixer.update(this.time.delta / 1000)
        }
    }

    add(anim, name) {
        const action = this.mixer.clipAction(anim)
        action.setLoop(THREE.LoopOnce)
        this.actions.push({action, name})
    }

    play(name) {
        const anim = this.actions.find(anim => anim.name === name)
        if (anim) {
            let isRunning = anim.action.isRunning()
            if (isRunning == false) {
                anim.action.reset()
                anim.action.play()
            }
        }
    }
}