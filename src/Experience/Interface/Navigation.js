import Experience from "../Experience";

export default class Navigation {
    constructor() {
        this.experience = new Experience();
        this.libraryRoom = this.experience.world.libraryRoom;

        // Methods binding
        this.onLinkClickBound = (i) => this.onLinkClick.bind(this, i);

        this.keyframes = [9.0, 21.0, 30.0, 40.0];
        this.clickInterval = null;
        this.previousIndex = -1;

        this.getElements();
        this.events();
    }

    getElements() {
        this.el = document.querySelector(".navigation");
        this.links = document.querySelectorAll(".navigation__link");
    }

    events() {
        this.links.forEach((link, i) => {
            link.addEventListener("click", this.onLinkClickBound(i));
        });
    }

    onLinkClick(i) {
        clearInterval(this.clickInterval);
        if (this.previousIndex === i) return;

        if (this.previousIndex !== -1) this.links[this.previousIndex].querySelector('span').classList.remove("active");
        this.links[i].querySelector('span').classList.add("active");

        this.clickInterval = setInterval(() => {
            if (this.previousIndex > i) {
                this.libraryRoom.cameraAction.time += 0.01;
                this.libraryRoom.cameraAction.timeScale = -2
                this.libraryRoom.playCameraAnimationBound();

                if (this.libraryRoom.cameraAction.time <= this.keyframes[i]) {
                    this.libraryRoom.pauseCameraAnimationBound();
                    clearInterval(this.clickInterval);
                    this.previousIndex = i;
                }
            } else {
                this.libraryRoom.cameraAction.time += 0.01;
                this.libraryRoom.cameraAction.timeScale = 2
                this.libraryRoom.playCameraAnimationBound();

                if (this.libraryRoom.cameraAction.time >= this.keyframes[i]) {
                    this.libraryRoom.pauseCameraAnimationBound();
                    clearInterval(this.clickInterval);
                    this.previousIndex = i;
                }
            }
        }, 100);
    }

    destroy() {
        this.experience = null;
        this.libraryRoom = null;
        this.onLinkClickBound = null;

        this.links.forEach((link) => {
            link.removeEventListener("click", this.onLinkClickBound);
        });
    }
}
