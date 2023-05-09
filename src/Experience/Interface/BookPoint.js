import Experience from "../Experience";
import InterfaceUI from "../InterfaceUI";

export default class BookPoint {
  constructor(book, id) {
    this.experience = new Experience();
    this.interface = new InterfaceUI()

    this.book = book
    this.id = id
    this.el = null
    this.isClicked = false

    this.init()
  }

  init() {
    this.createHTMLPoint();
    
    setTimeout(() => {
        this.events()
    }, 0);
  }

  createHTMLPoint()
  {
    this.el = document.createElement("div");
    this.el.classList.add("point");
    this.el.id = `book-${this.id}`;
    this.el.innerHTML = `
        <div class="label">${this.id}</div>
        <div class="text">Ventilation with air purifier and detection of environment toxicity.</div>
    `;
    // document.querySelector('.books-points').appendChild(this.el);
    document.body.appendChild(this.el);
  }

  events() {
    this.el.addEventListener("click", this.onPointClick.bind(this));
    // this.el.addEventListener('mouseenter', this.onPointEnter.bind(this))
    // this.el.addEventListener('mouseleave', this.onPointLeave.bind(this))
  }

  onPointEnter()
  {
    this.experience.world.books[this.id].obj.hoverOut();
  }

  onPointLeave()
  {
    this.experience.world.books[this.id].obj.hoverIn();
  }

  onPointClick() 
  {
    if (this.isClicked) return
    
    this.interface.currentBook && this.experience.world.books[this.interface.currentBook].obj.clickIn();  
    this.experience.world.books[this.id].obj.clickOut();
    this.interface.currentBook = this.id;
    this.isClicked = true
  }
}
