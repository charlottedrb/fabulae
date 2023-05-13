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
        this.canAnim = false
        this.debug = this.experience.debug
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('stairsRoom')
        }

        this.onClickHandlerBound = this.onClickHandler.bind(this)

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
                .add(this.room.scene.rotation, 'y')
                .name('Room Rotation Y')
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
            this.raycastHandler.addObjectToTest(door, this.onClickHandlerBound, 'click')
        });
    }

    onClickHandler() {
        gsap.to(this.room.scene.rotation, { y: 0.6, duration: 1 })
        this.leftStair.onClickHandler()
        this.rightStair.onClickHandler()
        this.doors.doors.forEach(door => {
            this.raycastHandler.removeObjectToTest(door, 'leave')
            this.raycastHandler.removeObjectToTest(door, 'enter')
            this.raycastHandler.removeObjectToTest(door, 'click')
        });
        this.doors.onClickHandler()
    }

    setCamera() {
        // let rotation = this.room.scene.getObjectByName('Camera').rotation
        this.camera.instance.position.set(0, 2.4, 4.2)
        this.camera.instance.rotation.set(-0.08726649245206389, 0, 0)
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
        this.backgroundMesh.material = this.material
    }

    setBackgroundSize() {
        this.backgroundMesh.geometry.scale(1.3, 1.3, 1.3)
    }

    update() {
        this.leftStair.update()
        this.rightStair.update()
        this.doors.update()
    }
}