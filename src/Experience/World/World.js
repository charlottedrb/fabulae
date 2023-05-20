import Experience from "../Experience.js";
import Book from "./Book/Book.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import * as THREE from "three";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.books = [];

    // Methods binding
    this.setBooksBound = this.setBooks.bind(this);

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.environment = new Environment();
      this.experience.sceneReady = true
      this.init();
    });

    this.debug = this.experience.debug;
  }

  init() {
    this.setBooksBound();
  }

  update() {}

  setBooks() {
    const nbBooks = 10;
    const bookDistance = 0.07;
    let initialPosition = this.floor.mesh.position.clone();
    initialPosition.x -= this.floor.geometry.parameters.width / 2;

    // Debug
    let booksFolder = null

    for (let i = 1; i < nbBooks; i++) {
      const position = new THREE.Vector3(
        initialPosition.x + bookDistance * i,
        initialPosition.y + this.floor.geometry.parameters.height + 0.1,
        initialPosition.z
      )

      const book = new Book(
        this.floor,
        position
      );

      this.books.push({
        position: position,
        author: `Author ${i}`,
        obj: book
      });
    }
  }
}
