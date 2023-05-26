import * as THREE from "three";
import Experience from "../../../Experience";
import gsap from "gsap";

export default class Book {
    constructor(parent, position) {
        this.experience = new Experience();
        this.parent = parent;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.resource = this.resources.items.blueBookModel;
        this.debug = this.experience.debug;
        this.raycastHandler = this.experience.raycastHandler;

        this.position = position || new THREE.Vector3(0, 0, 0);

        this.onBookClickBound = this.onBookClick.bind(this);
        
        this.setModel();
        this.setRaycastEvents();

        this.overlay = this.experience.interface.overlay;
        this.overlay.on("closeBook", () => {
            this.clickIn();
        });
    }

    setModel() {
        this.model = this.resource.scene.clone();
        this.model.scale.set(3, 4.7, 3);
        this.model.rotation.z = -Math.PI * 0.5;
        this.model.rotation.y = -Math.PI * 0.5;
        this.model.position.set(
            this.position.x,
            this.position.y,
            this.position.z
        );

        this.cover = this.model.getObjectByName("Plane001");

        if (this.debug.active) {
            this.debug.ui.addFolder("Book");
            this.debug.ui
                .add(this.model.position, "x")
                .min(-100)
                .max(100)
                .step(0.01)
                .name("Book X");

            this.debug.ui
                .add(this.model.position, "y")
                .min(-10)
                .max(10)
                .step(0.01)
                .name("Book Y");

            this.debug.ui
                .add(this.model.position, "z")
                .min(-10)
                .max(10)
                .step(0.01)
                .name("Book Z");

            this.debug.ui
                .add(this.model.scale, "x")
                .min(0)
                .max(10)
                .step(0.01)
                .name("Book Scale X");

            this.debug.ui
                .add(this.model.scale, "y")
                .min(0)
                .max(10)
                .step(0.01)
                .name("Book Scale Y");

            this.debug.ui
                .add(this.model.scale, "z")
                .min(0)
                .max(10)
                .step(0.01)
                .name("Book Scale Z");
        }

        this.scene.add(this.model);
    }

    setRaycastEvents() {
        this.raycastHandler.addObjectToTest(
            this.cover,
            () => {
                this.onBookClickBound();
            },
            "click"
        );
    }

    onBookClick() {
        // Show the overlay
        this.overlay.show();
        this.overlay.initPager();
        this.overlay.initBookContent(this.id);
    }

    hoverOut() {
        gsap.to(this.model.position, {
            duration: 0.2,
            x: this.model.position.x + 0.25,
            ease: "power3.inOut",
        });
    }

    hoverIn() {
        gsap.to(this.model.position, {
            duration: 0.3,
            x: this.model.position.x - 0.25,
            ease: "power3.inOut",
        });
    }

    clickOut() {
        gsap.to(this.model.position, {
            duration: 1,
            x: this.model.position.x - 0.35,
            ease: "power3.inOut",
        });
    }

    clickIn() {
        gsap.to(this.model.position, {
            duration: 1,
            x: this.model.position.x + 0.35,
            ease: "power3.inOut",
        });
    }

    destroy() {
        this.model.dispose();
        this.model = null;
        this.cover.dispose();
        this.cover = null;
        this.scene.remove(this.model);
        this.onBookClickBound = null;
    }
}
