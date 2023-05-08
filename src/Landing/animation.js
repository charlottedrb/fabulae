import gsap from "gsap";
import Splitting from "splitting";

export default class Animation {
  constructor() {
    this.init();
  }

  init() {
    this.getElements();
    this.events();
    this.splitTitles();
    this.prepareAnimation();
    this.animateTitles();
  }

  getElements() {
    /**
     * Titles
     */
    this.titles = document.querySelectorAll(".landing__title");
    this.titlesContent = document.querySelectorAll(".landing__title-content");
  }

  splitTitles() {
    this.splittedTitles = [];
    this.titles.forEach((title) => {
      this.splittedTitles.push(Splitting({ target: title, by: "chars" })[0]);
    });
  }

  events() {
    // this.titles.forEach(title => {
    //   title.addEventListener('mouseenter', this.showContent.bind(this, title))
    // })
  }

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
  }

  prepareAnimation() {
    this.splittedTitles.forEach((title) => {
      gsap.set(title.chars, {
        y: "100%",
        alpha: 0,
      });
    });
  }

  showContent(title) {
    console.log(title);
  }
}
