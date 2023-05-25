import LibraryRoom from "./LibraryRoom/LibraryRoom.js";
import Experience from "../Experience.js";
import Book from "./LibraryRoom/Book/Book.js";
import Environment from "./Environment.js";
import * as THREE from "three";
import StairsRoom from "./StairsRoom/StairsRoom.js";
import VisualLoader from "./VisualLoader.js";
import InterfaceUI from "../InterfaceUI.js";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.books = [];

        // this.visualLoader = new VisualLoader();

        // Wait for resources
        this.resources.on("ready", () => {
            // Setup
            this.environment = new Environment();
            // this.stairsRoom = new StairsRoom();
            this.experience.sceneReady = true;
            this.book = new Book();

            // this.visualLoader.disapear();

            // this.stairsRoom.on("initLibrary", () => {
                this.libraryRoom = new LibraryRoom();
            //     this.experience.interface = new InterfaceUI();
            // });

            // this.stairsRoom.on("endTransition", () => {
            //     this.libraryRoom.setCameraPosition();
            // });
        });
    }

    update() {
        if (this.stairsRoom) {
            this.stairsRoom.update();
        }

        if (this.libraryRoom) {
            this.libraryRoom.update();
        }
    }

    destroy() {
        if (this.floor) {
            this.floor.destroy();
            this.floor = null;
        }

        if (this.environment) {
            this.environment.destroy();
            this.environment = null;
        }

        if (this.stairsRoom) {
            this.stairsRoom.destroy();
            this.stairsRoom = null;
        }

        if (this.libraryRoom) {
            this.libraryRoom.destroy();
            this.libraryRoom = null;
        }

        this.visualLoader.destroy();
        this.visualLoader = null;

        this.experience = null;
        this.scene = null;
        this.resources = null;
    }
}
