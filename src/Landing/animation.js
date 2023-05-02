import gsap from 'gsap';

export default class Animation {
    constructor() {
        this.init();
    }

    init() {
        this.getElements()
        this.prepareAnimation()
        this.animateTitles()
    }

    getElements() {
        /**
         * Titles
         */
        this.titles = document.querySelectorAll('.landing__title');
    }

    events() {
    }

    animateTitles() {
        gsap.to(this.titles, {
            y: '0%',
            alpha: 1,
            delay: 0.5,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.18
        })
    }

    prepareAnimation() {
        console.log("prepareAnimation");
        gsap.set(this.titles, {
            y: '100%',
            alpha: 0
        })
    }
}