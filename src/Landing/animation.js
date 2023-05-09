import gsap from "gsap";
import Splitting from "splitting";

export default class Animation {
  constructor() {
    this.init();
  }

  init() {
    this.animation = gsap.timeline()

    this.getElements();
    this.events();
    this.splitTitles();
    this.prepareAnimation();
  }

  getElements() {
    /**
     * Illustration
     */
    this.leftIllustration = document.querySelector('#left-illustration')
    this.rightIllustration = document.querySelector('#right-illustration')

    /**
     * Titles
     */
    this.titles = document.querySelectorAll(".landing__title")
    this.titlesWithContent = document.querySelectorAll('.landing__title-with-content')
    this.titlesContent = document.querySelectorAll(".landing__title-content")
  }

  splitTitles() {
    this.splittedTitles = []
    this.titles.forEach((title) => {
      this.splittedTitles.push(Splitting({ target: title, by: "chars" })[0])
    });
  }

  events() {
    window.addEventListener('load', this.onEnterCompleted.bind(this))
  
    this.titlesWithContent.forEach((title, index) => {
      title.addEventListener('mouseenter', this.showContent.bind(this, index))
      title.addEventListener('mouseleave', this.hideContent.bind(this, index))
    })
  }

  onEnterCompleted()
  {
    this.animation.to(this.leftIllustration, {
      x: '-50%',
      delay: 1.5,
      duration: 2.2,
      ease: 'power3.inOut'
    })
    this.animation.to(this.rightIllustration, {
      x: '50%',
      duration: 2.2,
      ease: 'power3.inOut'
    }, '-=2.2')

    this.animateTitles()
  }

  animateTitles() {
    gsap.set([this.leftIllustration, this.rightIllustration], {
      z: 0
    })

    this.splittedTitles.forEach((title, i) => {
        const delay = i === 0 ? '-=1.2' : '-=0.6'
        this.animation.to(title.chars, {
            y: '0%',
            alpha: 1,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.05,
        }, delay)
    })

    this.animation.set(this.titles, {
      pointerEvents: 'auto',
      cursor: 'pointer'
    })
  }

  prepareAnimation() {
    this.splittedTitles.forEach((title) => {
      gsap.set(title.chars, {
        y: "100%",
        alpha: 0,
      });
    });
    
    gsap.set(this.titles, {
      pointerEvents: 'none',
      cursor: 'auto'
    })
  }

  showContent(index) {
    gsap.to(this.titlesContent[index], {
      x: '100%',
      duration: 0.8,
      ease: 'power3.out'
    })
  }

  hideContent(index) {
    gsap.to(this.titlesContent[index], {
      x: 0,
      delay: 0.2,
      duration: 0.8,
      ease: 'power3.in'
    })
  }
}
