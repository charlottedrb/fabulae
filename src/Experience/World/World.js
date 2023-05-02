import Experience from "../Experience.js";
import Book from "./Book.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import * as THREE from "three";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    /**
     * Setup
     */
    this.floor = new Floor();

    // Books
    this.setBooksBound = this.setBooks.bind(this);

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.environment = new Environment();
    });

    this.init()
  }

  init()
  {
    this.setBooksBound();
  }

  update() {}

  setBooks() {
    const nbBooks = 10;
    const bookDistance = 0.6;
    let initialPosition = this.floor.mesh.position.clone();
    initialPosition.x -= this.floor.geometry.parameters.width / 2;

    for (let i = 1; i < nbBooks; i++) {
      new Book(
        this.floor,
        Math.random() * 0xff0000,
        new THREE.Vector3(
          initialPosition.x + (bookDistance * i),
          initialPosition.y + 1,
          initialPosition.z
        )
      );
    }
  }
}
