import * as THREE from 'three'
import Experience from '../Experience.js'
import Doors from './Doors.js'
import Stair from './Stair.js'
import gsap from "gsap";

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
        this.debug = this.experience.debug
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('stairsRoom')
        }

        this.onChoiceMadeBound = this.onChoiceMade.bind(this)
        this.playCameraAnimationBound = this.playCameraAnimation.bind(this)

        this.setModels()
        this.setCamera()
    }

    setModels()
    {
        this.room = this.resources.items.stairsRoom

        // Separate the background from the room
        this.backgroundMesh = this.room.scene.getObjectByName('Fond_plane').clone()
        this.room.scene.remove(this.room.scene.getObjectByName('Fond_plane'))

        if(this.debug.active) {
            this.debugFolder
                .add(this.room.scene.position, 'z')
                .name('scene position Z')
                .min(- 5)
                .max(5)
                .step(0.001)
        }

        this.scene.add(this.room.scene)
        this.scene.add(this.backgroundMesh)
        
        this.setStairs()
        this.setBackgroundSize()
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

        this.leftStair = new Stair(leftStairMesh, leftStairAnim, storyDoors)
        this.rightStair = new Stair(rightStairMesh, rightStairAnim, knowledgeDoors)

        const leftDoorAnim = THREE.AnimationClip.findByName(this.room.animations, 'PORTE gauche.002Action')
        const rightDoorAnim = THREE.AnimationClip.findByName(this.room.animations, 'PORTE droiteAction')
        this.setDoorsAnimation(knowledgeDoors, [leftDoorAnim, rightDoorAnim])

        // Set video background after the stairs are officially set
        this.setVideo()
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
        this.leftStair.freezeCurrentAnimation()
        this.rightStair.freezeCurrentAnimation()

        // clear all listeners when door is chosen
        this.doors.doors.forEach(door => {
            this.raycastHandler.removeObjectToTest(door, 'leave')
            this.raycastHandler.removeObjectToTest(door, 'enter')
            this.raycastHandler.removeObjectToTest(door, 'click')
        });

        // Get the position and rotation of the camera animation's first frame for smoother transition
        const firstFrameAnimPosition = this.cameraAction.getClip().tracks[0].values.slice(0, 3)
        const firstFrameAnimRotation = this.cameraAction.getClip().tracks[1].values.slice(0, 3)

        const tl = gsap.timeline({ onComplete: this.playCameraAnimationBound})
        tl.to(this.room.scene.rotation, { y: 0.645, duration: 1 })
        tl.to(this.camera.instance.position, { x: firstFrameAnimPosition[0], y: firstFrameAnimPosition[1], z: firstFrameAnimPosition[2], duration: 1, ease: 'power2.easeOut' })
        tl.to(this.camera.instance.rotation, { x: firstFrameAnimRotation[0], y: firstFrameAnimRotation[1], z: firstFrameAnimRotation[2], duration: 1, ease: 'power2.easeOut' }, '<')
    }

    setCamera() {
        this.camera.instance.position.set(0, 2.4, 4.2)
        this.camera.instance.rotation.set(-0.08726649245206389, 0, 0)

        this.setCameraAnimation()
    }

    setCameraAnimation() {
        this.stairsCamera = this.resources.items.stairsCamera
        this.animMixer = new THREE.AnimationMixer(this.camera.instance)
        this.cameraAction = this.animMixer.clipAction(THREE.AnimationClip.findByName(this.stairsCamera.animations, 'CameraAction'))
        this.cameraAction.setLoop(THREE.LoopOnce)
        this.cameraAction.clampWhenFinished = true
    }

    playCameraAnimation() {
        // Open the chosen door
        this.doors.openDoors()

        // Make the camera go through the chosen door
        this.cameraAction.reset()
        this.cameraAction.play()
    }

    setVideo()
    {
         // Start html video
        this.video = document.getElementById('video');
        this.video.play();
        this.setBackground()
    }

    setBackground()
    {
        // Get video source from html and create as a material
        this.texture = new THREE.VideoTexture(this.video);
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.flipY = false;
        this.texture.needsUpdate = true;

        this.material = new THREE.MeshBasicMaterial( {map: this.texture, side: THREE.FrontSide, toneMapped: false} );

        this.setBackgroundVideo()
    }

    setBackgroundVideo() {
        // Apply video material to the background
        this.backgroundMesh.material = this.material
    }

    setBackgroundSize() {
        // Make the background bigger to cover the whole scene
        this.backgroundMesh.geometry.scale(1.3, 1.3, 1.3)
    }

    update() {
        this.leftStair.update()
        this.rightStair.update()
        this.doors.update()
        this.animMixer.update(this.time.delta / 1000)
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
        this.playCameraAnimationBound = null

        this.room = null
        this.backgroundMesh.geometry.dispose()
        this.backgroundMesh = null
        this.leftStair.destroy()
        this.leftStair = null
        this.rightStair.destroy()
        this.rightStair = null
        this.doors.destroy()
        this.doors = null
        this.video = null
        this.texture.dispose()
        this.texture = null
        this.material.dispose()
        this.material = null
        this.stairsCamera = null
        this.animMixer = null
        this.cameraAction = null
    }
}