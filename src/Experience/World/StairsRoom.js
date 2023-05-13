import * as THREE from 'three'
import Experience from '../Experience.js'
import Stair from './Stair.js'

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

        this.setModels()
        this.setCamera()
    }

    setModels()
    {
        this.room = this.resources.items.stairsRoom
        this.stairs = this.resources.items.stairs

        this.scene.add(this.room.scene)
        this.scene.add(this.stairs.scene)

        this.backgroundMesh = this.room.scene.getObjectByName('Fond_plane')
        
        this.setStairs()
        this.setBackgroundSize()
    }

    setStairs() {
        const leftStairMesh = this.stairs.scene.getObjectByName('ESCALIER_GAUCHE_MDD')
        const rightStairMesh = this.stairs.scene.getObjectByName('ESCALIER_DROIT_MDD')
        const leftStairAnim = THREE.AnimationClip.findByName(this.stairs.animations, 'Key.003Action')
        const rightStairAnim = THREE.AnimationClip.findByName(this.stairs.animations, 'Key.004Action')

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

        // Set video background after the stairs are officially set
        this.setVideo()
    }

    setCamera() {
        this.camera.instance.position.set(0, 2.4, 8.7)

        let rotation = this.room.scene.getObjectByName('Camera').rotation
        this.camera.instance.rotation.set(...rotation)
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
    }
}