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

        this.playCameraAnimationBound = this.playCameraAnimation.bind(this)
        this.resetCameraAnimationBound = this.resetCameraAnimation.bind(this)
        this.pauseCameraAnimationBound = this.pauseCameraAnimation.bind(this)
        
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
        this.roomCamera = this.room.scene.getObjectByName('Camera_Bake_2')
        
        this.room.scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.material.transparent = false
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
        this.cameraAction = this.animMixer.clipAction(THREE.AnimationClip.findByName(this.room.animations, 'CameraAction.002'))
        this.cameraAction.setLoop(THREE.LoopOnce)
        this.cameraAction.clampWhenFinished = true

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
                console.log(color + 'BookModel');
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