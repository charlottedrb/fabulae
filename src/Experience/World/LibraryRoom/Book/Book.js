import * as THREE from "three";
import Experience from "../../../Experience";
import gsap from "gsap";
import PostProcessing from "../../../PostProcessing";

export default class Book {
    constructor(parent, position, id, color) {
        this.experience = new Experience();
        this.parent = parent;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.resource = this.resources.items[`${color}BookModel`];
        this.debug = this.experience.debug;
        this.raycastHandler = this.experience.raycastHandler;
        
        this.position = position || new THREE.Vector3(0, 0, 0);
        this.id = id;
        this.color = color
        
        this.onBookClickBound = this.onBookClick.bind(this);
        
        this.setModel();
        this.setRaycastEvents();
        
        this.overlay = this.experience.interface.overlay;
        this.overlay.on("closeBook", (bookContent) => {
            if (this.id === bookContent.id) {
                this.raycastHandler.raycaster.layers.enableAll()
                this.clickIn();
            }
        });
    }

    setModel() {
        this.model = this.resource.scene.clone();
        this.model.scale.set(2.6, 4.3, 2.6);
        this.model.rotation.z = -Math.PI * 0.5;

        if (this.parent.position.x < 0) {
            this.model.rotation.y = Math.PI * 0.5;
        } else {
            this.model.rotation.y = -Math.PI * 0.5;
        }
        this.model.position.set(
            this.position.x,
            this.position.y,
            this.position.z
        );

        this.cover = this.model.getObjectByName("Plane001") || this.model.getObjectByName("Plane003");

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
        this.raycastHandler.addObjectToTest(
            this.cover,
            () => {
                this.experience.renderer.postProcessing.addOutlineObject(this.model)
            },
            "enter"
        );
        this.raycastHandler.addObjectToTest(
            this.cover,
            () => {
                this.experience.renderer.postProcessing.removeOutlineObject()
            },
            "leave"
        );
    }

    onBookClick() {
        // Show the overlay
        this.overlay.show();
        this.overlay.initPager();
        this.overlay.initBookContent(this.id, this.color);
        this.clickOut();
        this.raycastHandler.raycaster.layers.disableAll()
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
            x: this.parent.position.x < 0 ? this.model.position.x + 0.35 : this.model.position.x - 0.35,
            ease: "power3.inOut",
        });
    }

    clickIn() {
        gsap.to(this.model.position, {
            duration: 1,
            x: this.parent.position.x < 0 ? this.model.position.x - 0.35 : this.model.position.x + 0.35,
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
