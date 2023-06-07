import Experience from "../../Experience";
import * as THREE from "three";
import gsap from 'gsap';
import { throttle } from 'throttle-debounce';
import Book from './Book/Book'
import EventEmitter from "../../Utils/EventEmitter";
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';

export default class LibraryRoom extends EventEmitter {
    constructor()
    {
        super()
        this.experience = new Experience()
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.timer = null
        this.debug = this.experience.debug

        this.playCameraAnimationBound = this.playCameraAnimation.bind(this)
        this.resetCameraAnimationBound = this.resetCameraAnimation.bind(this)
        this.pauseCameraAnimationBound = this.pauseCameraAnimation.bind(this)

        if (this.debug.active) {
            this.libraryRoomDebugFolder = this.experience.world.worldDebugFolder.addFolder("libraryRoom");
        }
        
        this.setModels()
        this.setShelves()
        this.setCameraAnimation()

        this.experience.interface.initNavigation()
        this.onScrollBound = throttle(5, this.onScroll.bind(this))

    }

    events()
    {
        window.addEventListener('wheel', this.onScrollBound)
    }

    setCameraPosition() {
        this.camera.instance.position.set(this.roomCamera.position.x, this.roomCamera.position.y, this.roomCamera.position.z)
        this.camera.instance.rotation.set(this.roomCamera.rotation.x, this.roomCamera.rotation.y, this.roomCamera.rotation.z)
        this.camera.instance.near = 1
        this.camera.instance.updateProjectionMatrix()
    }

    setSound() {
        this.musicSound = new Audio("/sounds/LibraryRoom/music.mp3")
        this.musicSound.loop = true
        this.musicSound.volume = 0
        this.musicSound.play();
        gsap.to(this.musicSound, { volume: 0.5, duration: 2, delay: 1 })
    }

    setScrollIndication() {
        const scrollIndication = document.querySelector('#scroll-indication')
        gsap.to(scrollIndication, { opacity: 1, duration: 1, delay: 3, ease: 'power1.easeInOut' })
        gsap.to(scrollIndication, { opacity: 0, duration: 1, delay: 7, ease: 'power1.easeInOut' })
    }

    onScroll(e) 
    {
        // TODO: fix bug on scroll
        if(this.timer !== null) {
            clearTimeout(this.timer);        
        }
        
        if (this.cameraAction) {
            if (e.deltaY < 0) {
                this.cameraAction.timeScale = -1 * -(e.deltaY / 100)
                this.playCameraAnimationBound()
            } else {
                this.cameraAction.timeScale = 1 * e.deltaY / 100
                this.playCameraAnimationBound()
            }
    
            this.timer = setTimeout(() => {
                this.pauseCameraAnimationBound()
            }, 150);
        }
    }

    setModels()
    {
        this.room = this.resources.items.libraryRoom
        this.roomCamera = this.room.scene.getObjectByName('Camera')

        /** Tree */
        const treeMaterial = new THREE.SpriteMaterial({ map: this.resources.items.arbreColor })
        this.tree = new THREE.Sprite(treeMaterial)
        this.tree.position.set(-1.38, 6.91, 4.94)
        this.tree.scale.set(24.43, 15.43, 0)
        this.scene.add(this.tree)

        /** Vitrail */
        this.vitrail = this.room.scene.getObjectByName('Vitrail_Centre')
        const vitrailMaterial = new THREE.MeshBasicMaterial().copy(this.vitrail.material)
        this.vitrail.material = vitrailMaterial

        /** Cloison */
        this.cloison = this.room.scene.getObjectByName('Cloison_Baked_Baked')
        this.cloison.material.emissiveIntensity = 0.5

        /** Ground */
        this.ground = this.room.scene.getObjectByName('Sol_Baked001')
        this.ground.material.metalness = 1
        this.ground.material.roughness = 0
        this.ground.material.metalnessMap = this.resources.items.metalnessGround
        this.ground.material.emissiveIntensity = 0.5

        /** Poutres */
        this.poutreBas = this.room.scene.getObjectByName('Poutre_Avant_Haut002_Baked_Baked')
        this.poutreHaut = this.room.scene.getObjectByName('Poutre_Avant_Haut002_Baked_Baked001')

        this.poutreBas.material.emissiveIntensity = 2

        if (this.debug.active) {
            this.libraryRoomDebugFolder.add(this.ground.material, 'metalness', 0, 1, 0.01)
            this.libraryRoomDebugFolder.add(this.ground.material, 'roughness', 0, 1, 0.01)
            this.libraryRoomDebugFolder.add(this.ground.material, 'emissiveIntensity', 0, 1, 0.01)
            this.libraryRoomDebugFolder.add(this.ground.material, 'envMapIntensity', 0, 1, 0.01)
            this.libraryRoomDebugFolder.add(this.tree.position, 'x', -100, 100, 0.01)
            this.libraryRoomDebugFolder.add(this.tree.position, 'y', -100, 100, 0.01)
            this.libraryRoomDebugFolder.add(this.tree.position, 'z', -100, 100, 0.01)
            this.libraryRoomDebugFolder.add(this.tree.scale, 'x', 0, 30, 0.01)
            this.libraryRoomDebugFolder.add(this.tree.scale, 'y', 0, 30, 0.01)
            this.libraryRoomDebugFolder.add(this.tree.scale, 'z', 0, 30, 0.01)
        }

        this.room.scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.material.transparent = false
                obj.material.depthWrite = true
            }
        })
        this.scene.add(this.room.scene)

        this.loveShelf = this.room.scene.getObjectByName('Position_Livre_Amour')
        this.tripShelf = this.room.scene.getObjectByName('Position_Livre_Voyage')
        this.humorShelf = this.room.scene.getObjectByName('Position_Livre_Cocasse')
        this.excitingShelf = this.room.scene.getObjectByName('Position_Livre_Sensationnel')
    }

    setShelves()
    {
        this.setBooks(this.loveShelf, this.experience.dataManager.categories.filter(category => category.name === 'Amour')[0].id, 'red')
        this.setBooks(this.tripShelf, this.experience.dataManager.categories.filter(category => category.name === 'Voyage')[0].id, 'blue')
        this.setBooks(this.humorShelf, this.experience.dataManager.categories.filter(category => category.name === 'Cocasse')[0].id, 'green')
        this.setBooks(this.excitingShelf, this.experience.dataManager.categories.filter(category => category.name === 'Sensationnel')[0].id, 'purple')
    }

    setCameraAnimation()
    {
        this.animMixer = new THREE.AnimationMixer(this.camera.instance)
        console.log(this.room.animations);
        this.cameraAction = this.animMixer.clipAction(THREE.AnimationClip.findByName(this.room.animations, 'CameraAction.002'))
        this.cameraAction.setLoop(THREE.LoopRepeat)

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
        // this.tree.scene.quaternion.copy(this.camera.instance.quaternion)
        this.animMixer.update(this.time.delta / 1000)
    }

    setBooks(shelf, categoryId, color) {
        const books = this.experience.dataManager.books.filter(book => book.categoryId === categoryId);
        
        if (books.length > 0) {
            const bookDistance = 0.25;
            let initialPosition = shelf.position.clone();
            initialPosition.x -= shelf.geometry.boundingBox.max.x - shelf.geometry.boundingBox.min.x;
            
            books.forEach((book, i) => {
                const position = new THREE.Vector3(
                    initialPosition.x - 0.18,
                    initialPosition.y + shelf.geometry.boundingSphere.radius / 2 - 0.08,
                    initialPosition.z - 1 + (bookDistance * i)
                );
                new Book(shelf, position, book.id, color);
            })
        }
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
        
        window.removeEventListener('wheel', this.onScrollBound)
        this.onScrollBound = null
    }
}