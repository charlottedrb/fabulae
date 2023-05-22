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
        // action.time = (this.mixer.time + 0.04)
        action.setLoop(THREE.LoopOnce)
        console.log('anim', anim);
        console.log('action', action);
        this.actions.push({action, name})
    }

    play(name, reverse = false) {
        const anim = this.actions.find(anim => anim.name === name)
        anim.action.timeScale = 1
        if (reverse) {
            anim.action.timeScale = -1
        }
        if (anim) {
            let isRunning = anim.action.isRunning()
            if (isRunning == false) {
                anim.action.reset()
                if (reverse) {
                    anim.action.time = anim.action.getClip().duration;
                }
                anim.action.play()
            }
        }
    }

    destroy() {
        this.actions = null
        this.mixer = null

        this.experience = null
        this.scene = null
        this.time = null
    }
}