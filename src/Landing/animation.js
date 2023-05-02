import gsap from "gsap";
import Splitting from "splitting";

export default class Animation {
  constructor() {
    this.init();
  }

  init() {
    this.getElements();
    this.splitTitles();
    this.prepareAnimation();
    this.animateTitles();
  }

  getElements() {
    /**
     * Titles
     */
    this.titles = document.querySelectorAll(".landing__title");
  }

  splitTitles() {
    this.splittedTitles = [];
    this.titles.forEach((title) => {
      this.splittedTitles.push(Splitting({ target: title, by: "chars" })[0]);
    });
  }

  events() {}

  animateTitles() {
    const animation = gsap.timeline().delay(0.5)
    this.splittedTitles.forEach(title => {
        animation.to(title.chars, {
            y: '0%',
            alpha: 1,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.05
        }, '-=0.6')
    })
    // gsap.to(this.titles, {
    //     y: '0%',
    //     alpha: 1,
    //     delay: 0.5,
    //     duration: 1.2,
    //     ease: 'expo.out',
    //     stagger: 0.18
    // })
  }

  prepareAnimation() {
    console.log(this.splittedTitles);
    this.splittedTitles.forEach((title) => {
      gsap.set(title.chars, {
        y: "100%",
        alpha: 0,
      });
    });
    console.log("prepareAnimation");
    // gsap.set(this.titles, {
    //   y: "100%",
    //   alpha: 0,
    // });
  }
}
