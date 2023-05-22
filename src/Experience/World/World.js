import Experience from "../Experience.js";
import Book from "./Book/Book.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import * as THREE from "three";
import StairsRoom from './StairsRoom.js'

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.books = [];

        // Setup
        this.environment = new Environment()
        // Methods binding
        this.setBooksBound = this.setBooks.bind(this);

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.environment = new Environment()
            this.stairsRoom = new StairsRoom()
            this.experience.sceneReady = true
            this.init();
        })
    }

    init() {
      this.setBooksBound();
    }

    update()
    {
      if (this.stairsRoom) {
        this.stairsRoom.update()
    }
    }

    destroy() {
      if (this.floor) {
          this.floor.destroy()
          this.floor = null
      }

      if (this.environment) {
          this.environment.destroy()
          this.environment = null
      }

      if (this.stairsRoom) {
          this.stairsRoom.destroy()
          this.stairsRoom = null
      }

      this.experience = null
      this.scene = null
      this.resources = null
  }

  setBooks() {
    const nbBooks = 10;
    const bookDistance = 0.05;
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