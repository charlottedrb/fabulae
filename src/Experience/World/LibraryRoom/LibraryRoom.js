import Experience from "../../Experience";
import * as THREE from "three";
import gsap from 'gsap';
import { throttle } from 'throttle-debounce';
import Book from '../LibraryRoom/Book/Book'

export default class LibraryRoom {
    constructor()
    {
        this.experience = new Experience()
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.timer = null

        this.playCameraAnimationBound = this.playCameraAnimation.bind(this)
        this.resetCameraAnimationBound = this.resetCameraAnimation.bind(this)
        this.pauseCameraAnimationBound = this.pauseCameraAnimation.bind(this)
        this.onScrollBound = throttle(5, this.onScroll.bind(this))

        this.shelves = []
        this.books = []

        this.events()
        this.setModels()
        this.setShelves()
        this.setCamera()
    }

    events()
    {
        window.addEventListener('wheel', this.onScrollBound)
    }

    onScroll(e) 
    {
        if(this.timer !== null) {
            clearTimeout(this.timer);        
        }
        
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

    setModels()
    {
        this.room = this.resources.items.libraryRoom
        this.roomCamera = this.room.scene.getObjectByName('Camera_Bake_2')
        this.scene.add(this.room.scene)

        this.loveShelf = this.room.scene.getObjectByName('Position_Livre_Amour')
        this.humorShelf = this.room.scene.getObjectByName('Position_Livre_Cocasse')
        this.tripShelf = this.room.scene.getObjectByName('Position_Livre_Humour')
        this.excitingShelf = this.room.scene.getObjectByName('Position_Livre_Sensationnel')

        console.log(this.loveShelf.position, this.humorShelf.position, this.tripShelf.position, this.excitingShelf.position);
    }

    setShelves()
    {
        this.setBooks(this.humorShelf, this.experience.dataManager.categories.filter(category => category.name === 'Cocasse')[0].id)
        this.setBooks(this.tripShelf, this.experience.dataManager.categories.filter(category => category.name === 'Voyage')[0].id)
        this.setBooks(this.excitingShelf, this.experience.dataManager.categories.filter(category => category.name === 'Sensationnel')[0].id)
        this.setBooks(this.loveShelf, this.experience.dataManager.categories.filter(category => category.name === 'Amour')[0].id)
    }
    
    setCamera()
    {
        this.setCameraAnimation()
        this.camera.instance.position.set(this.roomCamera.position.x, this.roomCamera.position.y, this.roomCamera.position.z)
        this.camera.instance.rotation.set(this.roomCamera.rotation.x, this.roomCamera.rotation.y, this.roomCamera.rotation.z)
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

    setBooks(shelf, categoryId) {
        const books = this.experience.dataManager.books.filter(book => book.categoryId === categoryId);
        console.log(shelf);
        if (books.length > 0) {
            const bookDistance = 0.05;
            let initialPosition = shelf.position.clone();
            initialPosition.x -= shelf.geometry.boundingBox.max.x - shelf.geometry.boundingBox.min.x;
    
            books.forEach((book, i) => {
                const position = new THREE.Vector3(
                    initialPosition.x + bookDistance * i,
                    initialPosition.y + shelf.geometry.boundingSphere.radius / 2 - 0.1,
                    initialPosition.z - 1
                );
    
                const bookObj = new Book(shelf, position);
    
                this.books.push({
                    position: position,
                    author: book.authorId,
                    obj: bookObj,
                });
            })
        }
    }

    destroy()
    {
        this.experience = null
        this.scene = null
        this.resources = null
        this.camera = null
        this.playCameraAnimationBound = null

        this.room = null
        
        window.removeEventListener('scroll', this.onScrollBound)
        this.onScrollBound = null
    }
}