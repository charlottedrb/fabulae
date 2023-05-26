import Experience from "./Experience.js";
import Overlay from "./Interface/Overlay.js";
import EventEmitter from "./Utils/EventEmitter.js";

let interfaceUi = null;

export default class InterfaceUI extends EventEmitter {
    constructor() {
        super()

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
        this.overlay = new Overlay();

        // Wait for resources
        this.init();
    }

    init() {
        this.overlay.on("closeBook", () => {
            this.overlay.bookContent.destroy();
            this.overlay.pager.destroy();
        });
    }

    update() { }
}
