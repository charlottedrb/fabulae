import Experience from "./Experience.js";
import * as THREE from "three";
import BookPoint from "./World/LibraryRoom/Book/BookPoint.js";
import Overlay from "./Interface/Overlay.js";

let interfaceUi = null;

export default class InterfaceUI {
    constructor() {
        // Singleton
        if (interfaceUi) {
            return interfaceUi;
        }
        interfaceUi = this;

        // Global access
        window.interface = this;

        this.experience = new Experience();
        this.camera = this.experience.camera;
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.dataManager = this.experience.dataManager;
        this.stairsRoom = this.experience.world.stairsRoom;

        /**
         * Book interface
         */
        this.currentBook = null;
        this.booksPoints = [];
        this.overlay = new Overlay();

        this.raycaster = null;

        // Debug
        this.showBookContent = true

        // Wait for resources
        this.books = this.experience.world.libraryRoom.books;
        this.init();
    }

    init() {
        this.raycaster = new THREE.Raycaster();

        this.overlay.on("closeBook", () => {
            this.currentBook.clickIn();
            this.overlay.bookContent.destroy();
            this.overlay.pager.destroy();
        });

        this.createPoints();
        this.showBookContent && this.showBookContentOnDebug()
    }

    createPoints() {
        this.books.forEach((book, id) => {
            if (this.dataManager.books.find((b) => b.id === id)) {
                this.booksPoints.push({
                    position: book.position,
                    obj: new BookPoint(book, id),
                });
            }
        });
    }

    updatePoints() {
        // TODO: Fix bounding box of book model 
        // Waiting for the scene to be ready - important
        if (this.experience.sceneReady) {
            // Go through each point
            for (const point of this.booksPoints) {
                // Get 2D screen position
                const screenPosition = point.position.clone();
                screenPosition.project(this.camera.instance);

                // Set the raycaster
                this.raycaster.setFromCamera(
                    screenPosition,
                    this.camera.instance
                );

                const intersects = this.raycaster.intersectObjects(
                    point.obj.book.obj.scene,
                    true
                );

                // No intersect found
                if (intersects.length === 0) {
                    // Show
                    point.obj.el.classList.add("visible");
                }

                // Intersect found
                else {
                    // Get the distance of the intersection and the distance of the point
                    const intersectionDistance = intersects[0].distance;
                    const pointDistance = point.position.distanceTo(
                        this.camera.instance.position
                    );

                    // Intersection is close than the point
                    if (intersectionDistance < pointDistance) {
                        // Hide
                        point.obj.el.classList.remove("visible");
                    }
                    // Intersection is further than the point
                    else {
                        // Show
                        point.obj.el.classList.add("visible");
                    }
                }

                const translateX = screenPosition.x * this.sizes.width * 0.5;
                const translateY = -screenPosition.y * this.sizes.height * 0.5;
                point.obj.el.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
            }
        }
    }

    update() {
        this.updatePoints();
    }

    showBookContentOnDebug()
    {
        this.booksPoints[0].obj.showOnDebug()
    }
}
