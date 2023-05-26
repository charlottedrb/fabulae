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

        // Wait for resources
        this.books = this.experience.world.libraryRoom.books;
        this.init();
    }

    init() {
        this.overlay.on("closeBook", () => {
            this.currentBook.clickIn();
            this.overlay.bookContent.destroy();
            this.overlay.pager.destroy();
        });
    }

    update() { }
}
