import Experience from "./Experience.js";
import * as THREE from "three";
import BookPoint from "./World/Book/BookPoint.js";
import Overlay from "./Interface/Overlay.js";

let interfaceUi = null 

export default class InterfaceUI {
  constructor() {
    // Singleton
    if(interfaceUi)
    {
        return interfaceUi
    }
    interfaceUi = this
    
    // Global access
    window.interface = this

    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;

    /**
     * Book interface
     */
    this.books = this.experience.world.books;
    this.currentBook = null
    this.booksPoints = []
    this.overlay = new Overlay()

    this.raycaster = null;

    // Wait for resources
    this.resources.on("ready", () => {  
      this.init();
    })
  }

  init() {
    this.raycaster = new THREE.Raycaster();

    this.overlay.on('closeBook', () => {
      this.currentBook.clickIn()
      this.overlay.bookContent.destroy()
      this.overlay.pager.destroy()
    })

    this.createPoints()
  }

  createPoints() {
    this.books.forEach((book, id) => {
      this.booksPoints.push({
        position: book.position,
        obj: new BookPoint(book, id),
      });
    });
  }
  
  updatePoints() {
    // Waiting for the scene to be ready - important
    if (this.experience.sceneReady) {
      // Go through each point
      for (const point of this.booksPoints) {
        // Get 2D screen position 
        const screenPosition = point.position.clone();
        screenPosition.project(this.camera.instance);

        // Set the raycaster
        // this.raycaster.setFromCamera(screenPosition, this.camera.instance);
        // const intersects = this.raycaster.intersectObjects(
        //   this.scene.children,
        //   true
        // );

        // // No intersect found
        // if (intersects.length === 0) {
        //   // Show
        //   point.obj.el.classList.add("visible");
        // }

        // // Intersect found
        // else {
        //   // Get the distance of the intersection and the distance of the point
        //   const intersectionDistance = intersects[0].distance;
        //   const pointDistance = point.position.distanceTo(
        //     this.camera.instance.position
        //   );

        //   // Intersection is close than the point
        //   if (intersectionDistance < pointDistance) {
        //     // Hide
        //     point.obj.el.classList.remove("visible");
        //   }
        //   // Intersection is further than the point
        //   else {
        //     // Show
        //     point.obj.el.classList.add("visible");
        //   }
        // }

        const translateX = screenPosition.x * this.sizes.width * 0.5;
        const translateY = -screenPosition.y * this.sizes.height * 0.5;
        point.obj.el.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      }
    }
  }

  update() {
    this.updatePoints();
  }
}
