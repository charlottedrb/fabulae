import Experience from "./Experience.js";
import * as THREE from "three";

export default class InterfaceUI {
  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.books = this.experience.world.books;
    this.raycaster = null;
    this.bookPoints = null;
    this.points = [];

    this.init();
  }

  init() {
    this.raycaster = new THREE.Raycaster();

    this.createHTMLPoints();
  }

  createHTMLPoints() {
    this.books.forEach((book, index) => {
      const point = document.createElement("div");
      point.classList.add("book-point");
      point.id = `book-${index}`;
      point.innerHTML = `
            <div class="book-point__content">
                <div class="book-point__title">${book.author}</div>
            </div>
        `;
      document.querySelector(".books-points").appendChild(point);
    });
  }

  createPoints() {
    this.books.forEach((book, index) => {
      this.points.push({
        position: book.position,
        element: document.querySelector(`#book-${index}`),
      });
    });

    
    // Go through each point
    for (const point of this.points) {
      // Get 2D screen position
      const screenPosition = point.position.clone();
      screenPosition.project(this.camera);

      // Set the raycaster
      this.raycaster.setFromCamera(screenPosition, this.camera);
      const intersects = this.raycaster.intersectObjects(
        this.scene.children,
        true
      );

      // No intersect found
      if (intersects.length === 0) {
        // Show
        point.element.classList.add("visible");
      }

      // Intersect found
      else {
        // Get the distance of the intersection and the distance of the point
        const intersectionDistance = intersects[0].distance;
        const pointDistance = point.position.distanceTo(this.camera.position);

        // Intersection is close than the point
        if (intersectionDistance < pointDistance) {
          // Hide
          point.element.classList.remove("visible");
        }
        // Intersection is further than the point
        else {
          // Show
          point.element.classList.add("visible");
        }
      }

      const translateX = screenPosition.x * this.sizes.width * 0.5;
      const translateY = -screenPosition.y * this.sizes.height * 0.5;
      point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    }
  }

  update() {
    // this.createHTMLPoints();
    this.createPoints();
  }
}
