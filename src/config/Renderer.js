import { Renderer } from '@unseenco/taxi';
import Experience from '../Experience/Experience.js'
import Animation from '../Landing/animation.js'
import BackOffice from '../BackOffice/BackOffice.js'
import Story from '../BackOffice/Story.js'

export default class CustomRenderer extends Renderer {
  onEnter() {
    // run after the new content has been added to the Taxi container
  }

  onEnterCompleted() {
     // run after the transition.onEnter has fully completed
     if (window.location.pathname === '/') {
        const animation = new Animation()
    }
    /**
     * Experience
     */
    if (window.location.pathname === '/experience.html') {
        const experience = new Experience(document.querySelector('canvas.webgl'))
    }
    
    /**
     * Back-office
     */
    if (window.location.pathname === '/back-office.html') {
        const backOffice = new BackOffice()
    }
    
    if (window.location.pathname === '/create-story.html') {
        const story = new Story()
    }
  }

  onLeave() {
    // run before the transition.onLeave method is called
  }

  onLeaveCompleted() {
    // run after the transition.onleave has fully completed
  }
}