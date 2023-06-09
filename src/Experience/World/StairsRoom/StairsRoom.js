import * as THREE from 'three'
import Experience from '../../Experience.js'
import Doors from './Doors.js'
import Stair from './Stair.js'
import gsap from "gsap";
import EventEmitter from '../../Utils/EventEmitter.js';
import TransitionShader from './TransitionShader.js';
import BackgroundVideo from './BackgroundVideo.js';

export default class StairsRoom extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.raycastHandler = this.experience.raycastHandler
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.isChoiceMade = false
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('stairsRoom')
        }

        this.onChoiceMadeBound = this.onChoiceMade.bind(this)
        this.goToNextSceneBound = this.goToNextScene.bind(this)
        this.finishTransitionBound = this.finishTransition.bind(this)

        this.setModels()
        this.setCamera()
        this.setVideoBackground()
        this.setIndication()
        this.transitionShader = new TransitionShader()
        this.setSound()
    }

    setSound() {
        this.musicSound = new Audio("/sounds/StairsRoom/music.mp3")
        this.musicSound.loop = true
        this.musicSound.volume = 0.5
        this.musicSound.play();

        this.doorSound = new Audio("/sounds/StairsRoom/door.mp3")
    }

    stopSound() {
        const tl = gsap.timeline({ onComplete: () => { this.musicSound.pause() } })
        tl.to(this.musicSound, { volume: 0, duration: 2 })
    }

    setModels()
    {
        this.room = this.resources.items.stairsRoom
        // Remove useless mesh
        this.room.scene.remove(this.room.scene.getObjectByName('Fond_plane'))
        // Optimize platform texture
        this.room.scene.getObjectByName('plate-forme').material.map.minFilter = THREE.LinearFilter

        this.scene.add(this.room.scene)
        this.setStairs()
    }

    setCamera() {
        this.camera.instance.position.set(0, 2.15, 4.55)
        this.camera.instance.rotation.set(-0.08726649245206389, 0, 0)
    }

    setVideoBackground() {
        this.backgroundVideo = new BackgroundVideo()
        this.scene.background = this.backgroundVideo.texture
        this.scene.background.flipY = true
        this.scene.background.encoding = THREE.sRGBEncoding
    }

    setIndication() {
        this.indication = document.querySelector('#stairs-indication')
        this.indication.animation = gsap.to(this.indication, { opacity: 1, duration: 1, delay: 3, ease: 'power1.easeInOut', onStart: this.showIndication.bind(this) })
    }

    showIndication() {
        if (this.isChoiceMade) {
            this.indication.animation.pause()
        }
    }

    hideIndication() {
        gsap.to(this.indication, { opacity: 0, duration: 1, delay: 0, ease: 'power1.easeInOut' })
    }

    setStairs() {
        const leftStairMesh = this.room.scene.getObjectByName('ESCALIER_GAUCHE_MDD')
        const rightStairMesh = this.room.scene.getObjectByName('ESCALIER_DROIT_MDD')
        const leftStairAnim = THREE.AnimationClip.findByName(this.room.animations, 'Key.003Action')
        const rightStairAnim = THREE.AnimationClip.findByName(this.room.animations, 'Key.004Action')

        const storyDoors = []
        const storyLeftDoor = this.room.scene.getObjectByName('PORTE_SOUVENIR_gauche')
        const storyRightDoor = this.room.scene.getObjectByName('PORTE_SOUVENIR_droite')
        storyDoors.push(storyLeftDoor, storyRightDoor)

        const knowledgeDoors = []
        const knowledgeLeftDoor = this.room.scene.getObjectByName('PORTE_SAVOIR_gauche')
        const knowledgeRightDoor = this.room.scene.getObjectByName('PORTE_SAVOIR_droite')
        knowledgeDoors.push(knowledgeLeftDoor, knowledgeRightDoor)

        // Set material and emissive intensity for all doors
        const alldoors = [storyLeftDoor, storyRightDoor, knowledgeLeftDoor, knowledgeRightDoor]
        alldoors.forEach((door) => {
            const lambertMaterial = new THREE.MeshBasicMaterial().copy(door.material)
            door.material = lambertMaterial
            // door.material.emissiveIntensity = 0
        })

        this.leftStair = new Stair(leftStairMesh, leftStairAnim, storyDoors)
        this.rightStair = new Stair(rightStairMesh, rightStairAnim, knowledgeDoors)

        const leftDoorAnim = THREE.AnimationClip.findByName(this.room.animations, 'PORTE gauche.002Action')
        const rightDoorAnim = THREE.AnimationClip.findByName(this.room.animations, 'PORTE droiteAction')
        this.setDoorsAnimation(knowledgeDoors, [leftDoorAnim, rightDoorAnim])
    }

    setDoorsAnimation(doors, animationClips) {
        this.doors = new Doors(this.scene, doors, animationClips)
        this.setRaycastEvents()
    }

    setRaycastEvents() {
        this.doors.doors.forEach(door => {
            this.raycastHandler.addObjectToTest(door, this.onChoiceMadeBound, 'click')
        });
    }

    onChoiceMade() {
        this.isChoiceMade = true

        // stop stairs animations
        this.leftStair.freezeCurrentAnimation()
        this.rightStair.freezeCurrentAnimation()

        // clear all listeners when door is chosen
        this.doors.doors.forEach(door => {
            this.raycastHandler.removeObjectToTest(door, 'leave')
            this.raycastHandler.removeObjectToTest(door, 'enter')
            this.raycastHandler.removeObjectToTest(door, 'click')
        });

        // Hide the indication
        this.hideIndication()

        // Rotate scene to face the chosen door
        const tl = gsap.timeline({ onComplete: this.goToNextSceneBound})
        tl.to(this.room.scene.rotation, { y: 0.65, duration: 1, ease: 'power1.easeOut' })

        // Make camera go to the chosen door manually
        tl.to(this.camera.instance.position, { y: 1.058, z: -0.337, duration: 1.5, ease: 'power1.easeOut' })
        tl.to(this.camera.instance.rotation, { x: 0.283, duration: 1, ease: 'power1.easeIn' }, '>-0.8')
        tl.to(this.camera.instance.position, { y: 2.763, z: -4.057, duration: 3 }, '>-0.75')
        tl.to(this.camera.instance.rotation, { x: -0.027, duration: 1 }, '>-0.80')
    }

    goToNextScene() {
        // Instanciate the next scene
        this.trigger('initLibrary')

        setTimeout(() => {
            // Open the chosen door
            this.doors.openDoors()
            this.doorSound.play()
    
            // Make sure the indication is hidden
            this.hideIndication()
    
            // Start the transition shader
            this.transitionShader.start()
    
            // Make the camera go through the chosen door
            const tl = gsap.timeline({ delay: 2, onComplete: this.finishTransitionBound })
            tl.to(this.camera.instance.position, { z: -4.557, duration: 1, ease: 'power1.easeOut' })
        }, 100);

    }

    finishTransition() {
        this.hideIndication()
        this.trigger('endTransition')
        this.stopSound()
        this.transitionShader.end()
        this.disapear()
    }

    update() {
        if (this.leftStair) {
            this.leftStair.update()
        }
        if (this.rightStair) {
            this.rightStair.update()
        }
        if (this.doors) {
            this.doors.update()
        }
    }

    disapear() {
        this.room.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.visible = false
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })
    }

    destroy() {
        this.experience = null
        this.scene = null
        this.resources = null
        this.camera = null
        this.raycastHandler = null
        this.time = null
        this.debug = null
        this.debugFolder = null
        this.onChoiceMadeBound = null
        this.goToNextSceneBound = null
        this.finishTransitionBound = null

        this.room = null
        this.leftStair.destroy()
        this.leftStair = null
        this.rightStair.destroy()
        this.rightStair = null
        this.doors.destroy()
        this.doors = null
        this.video = null
        this.texture = null
        this.material = null
        this.transitionShader.destroy()
        this.transitionShader = null
        this.backgroundVideo.destroy()
        this.backgroundVideo = null
        this.isChoiceMade = null
        this.indication = null
    }
}