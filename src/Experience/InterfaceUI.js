import Experience from "./Experience.js";
import Overlay from "./Interface/Overlay.js";
import Navigation from "./Interface/Navigation.js";
import EventEmitter from "./Utils/EventEmitter.js";

let interfaceUi = null;

export default class InterfaceUI extends EventEmitter {
    constructor() {
        super();

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
        this.navigation = null

        /**
         * Book interface
         */
        this.overlay = new Overlay();
        
        this.init();
    }

    init() {
        this.overlay.on("closeBook", (bookContent) => {
            if (this.overlay.bookContent === bookContent) {
                this.overlay.bookContent.destroy();
                this.overlay.pager.destroy();
                this.overlay.bookContent = null;
                this.overlay.pager = null;
            }
        });
    }

    initNavigation() {
        this.navigation = new Navigation();
    }

    update() {
        if (this.navigation) {
            this.navigation.update();
        }
    }
}
