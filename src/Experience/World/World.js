import LibraryRoom from "./LibraryRoom/LibraryRoom.js";
import Experience from "../Experience.js";
import Environment from "./Environment.js";
import * as THREE from "three";
import StairsRoom from "./StairsRoom/StairsRoom.js";
import VisualLoader from "./VisualLoader.js";
import InterfaceUI from "../InterfaceUI.js";
import Fireflies from "./Fireflies.js";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.books = [];

        if (this.experience.debug.active) {
            this.worldDebugFolder = this.experience.debug.ui.addFolder("world");
            this.booksDebugFolder = this.worldDebugFolder.addFolder("books").close();
        }

        // Debug
        this.showLibraryOnly = false;

        !this.showLibraryOnly && (this.visualLoader = new VisualLoader());

        // Wait for resources
        this.resources.on("ready", () => {
            // Setup
            this.environment = new Environment();

            if (this.showLibraryOnly) {
                this.experience.interface = new InterfaceUI();
                this.libraryRoom = new LibraryRoom();
                this.libraryRoom.setCameraPosition();
                this.libraryRoom.events()
                this.experience.interface.navigation.show();
                this.libraryRoom.setScrollIndication()
            } else {
                this.visualLoader.disapear();
                this.stairsRoom = new StairsRoom();

                this.stairsRoom.on("initLibrary", () => {
                    this.experience.interface = new InterfaceUI();
                    this.libraryRoom = new LibraryRoom();
                });
                
                this.stairsRoom.on("endTransition", () => {
                    this.environment.setSunLightBlue()
                    this.libraryRoom.setCameraPosition()
                    this.libraryRoom.events()
                    this.experience.interface.navigation.show();
                    this.libraryRoom.setScrollIndication()
                    this.fireflies.updateFirefliesSize()
                    this.libraryRoom.setSound()
                });

                this.stairsRoom.transitionShader.on("initTree", () => {
                    this.libraryRoom.makeTreeVisible()
                })
            }

            this.fireflies = new Fireflies()
            this.experience.sceneReady = true;
        });
    }

    update() {
        if (this.stairsRoom) {
            this.stairsRoom.update();
        }

        if (this.libraryRoom) {
            this.libraryRoom.update();
        }

        if (this.fireflies) {
            this.fireflies.update()
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

        if (this.fireflies) {
            this.fireflies.destroy()
            this.fireflies = null
        }

        this.visualLoader.destroy();
        this.visualLoader = null;

        this.stairsRoom.off("initLibrary")
        this.stairsRoom.off("endTransition")
        this.stairsRoom.off("initTree")

        this.experience = null;
        this.scene = null;
        this.resources = null;
    }
}
