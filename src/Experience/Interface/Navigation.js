import Experience from "../Experience";
import gsap from "gsap";
import Splitting from "splitting";

export default class Navigation {
    constructor() {
        this.experience = new Experience();
        this.libraryRoom = null;

        // Methods binding
        this.onLinkClickBound = (i) => this.onLinkClick.bind(this, i);

        this.keyframes = [9.0, 21.0, 30.0, 40.0];
        this.clickInterval = null;
        this.previousIndex = -1;
        this.animation = gsap.timeline();

        this.hasShowIndication = false;

        this.getElements();
        this.prepareAnimation()
        this.events();
    }

    getElements() {
        this.el = document.querySelector(".navigation");
        this.links = document.querySelectorAll(".navigation__link");
        this.categoryNames = [
            {
                el: Splitting({
                    target: document.querySelector(".category__name-Amour"),
                    by: "chars",
                })[0],
                showing: false,
            },
            {
                el: Splitting({
                    target: document.querySelector(".category__name-Voyage"),
                    by: "chars",
                })[0],
                showing: false,
            },
            {
                el: Splitting({
                    target: document.querySelector(".category__name-Cocasse"),
                    by: "chars",
                })[0],
                showing: false,
            },
            {
                el: Splitting({
                    target: document.querySelector(
                        ".category__name-Sensationnel"
                    ),
                    by: "chars",
                })[0],
                showing: false,
            },
        ];
    }

    prepareAnimation() {
        this.categoryNames.forEach((categoryName, i) => {
            this.animation.set(categoryName.el.chars, {
                y: "100%",
            });
        });
    }

    setIndication() {
        const indication = document.querySelector('#book-indication')
        gsap.to(indication, { opacity: 1, duration: 1, delay: 0, ease: 'power1.easeInOut' })
        gsap.to(indication, { opacity: 0, duration: 1, delay: 4, ease: 'power1.easeInOut' })
    }

    events() {
        this.links.forEach((link, i) => {
            link.addEventListener("click", this.onLinkClickBound(i));
        });
    }

    show() {
        gsap.to(this.el, {
            alpha: 1,
            duration: 1,
            ease: "power2.out",
            pointerEvents: "auto",
            delay: 1.5,
        });
    }

    onLinkClick(i) {
        console.log(i);
        if (this.libraryRoom === null)
            this.libraryRoom = this.experience.world.libraryRoom;
        clearInterval(this.clickInterval);
        if (this.previousIndex === i) return;

        if (this.previousIndex !== -1)
            this.links[this.previousIndex]
                .querySelector("span")
                .classList.remove("active");
        this.links[i].querySelector("span").classList.add("active");

        this.clickInterval = setInterval(() => {
            if (this.previousIndex > i) {
                this.libraryRoom.cameraAction.time += 0.01;
                this.libraryRoom.cameraAction.timeScale = -2;
                this.libraryRoom.playCameraAnimationBound();

                if (this.libraryRoom.cameraAction.time <= this.keyframes[i]) {
                    this.libraryRoom.pauseCameraAnimationBound();
                    clearInterval(this.clickInterval);
                    this.previousIndex = i;
                }
            } else {
                this.libraryRoom.cameraAction.time += 0.01;
                this.libraryRoom.cameraAction.timeScale = 2;
                this.libraryRoom.playCameraAnimationBound();

                if (this.libraryRoom.cameraAction.time >= this.keyframes[i]) {
                    this.libraryRoom.pauseCameraAnimationBound();
                    clearInterval(this.clickInterval);
                    this.previousIndex = i;
                }
            }
        }, 100);
    }

    update() {
        if (this.libraryRoom === null)
            this.libraryRoom = this.experience.world.libraryRoom;
        if (this.libraryRoom) {
            this.keyframes.forEach((keyframe, i) => {
                // Detect if the keyframe is reached
                if (
                    this.libraryRoom.cameraAction.time >= keyframe - 1 &&
                    this.libraryRoom.cameraAction.time <= keyframe + 2
                ) {
                    // If category name is already showing, return
                    if (this.categoryNames[i].showing) return;
                    this.categoryNames[i].showing = true;

                    this.animation
                        .set(this.categoryNames[i].el.el, {
                            alpha: 1,
                        })
                        .to(this.categoryNames[i].el.chars, {
                            y: "0%",
                            alpha: 1,
                            duration: 0.05 * this.categoryNames[i].el.chars.length,
                            ease: "power2.out",
                            stagger: 0.05,
                        });

                    if (i === 0 && !this.hasShowIndication) {
                        this.hasShowIndication = true
                        this.setIndication()
                    }
                } else {
                    if (!this.categoryNames[i].showing) return;
                    this.categoryNames[i].showing = false;

                    const reversedSplittedChars =
                        this.categoryNames[i].el.chars.slice().reverse();

                    this.animation.to(reversedSplittedChars, {
                        y: "100%",
                        alpha: 0,
                        duration: 0.03 * this.categoryNames[i].el.chars.length,
                        ease: "power2.out",
                        stagger: 0.03,
                    });
                }
            });
        }
    }

    destroy() {
        this.experience = null;
        this.libraryRoom = null;
        this.onLinkClickBound = null;
        this.hasShowIndication = null;

        this.links.forEach((link) => {
            link.removeEventListener("click", this.onLinkClickBound);
        });
    }
}
