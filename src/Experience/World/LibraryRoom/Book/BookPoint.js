import Experience from "../../Environment";
import InterfaceUI from "../../../InterfaceUI";
import EventEmitter from "../../../Utils/EventEmitter";

export default class BookPoint extends EventEmitter {
  constructor(book, id) {
    super()

    this.experience = new Experience();
    this.interface = new InterfaceUI()
    this.overlay = this.interface.overlay
    this.resources = this.experience.resources;
    
    this.book = book
    this.id = id
    this.el = null
    this.isClicked = false
    
    this.overlay.on('closeBook', () => {
      this.isClicked = false
    })

    this.init();
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
    this.el.classList.add('point');
    this.el.id = `book-${this.id}`;
    this.el.innerHTML = `
        <div class="label">${this.id}</div>
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
    
    // Open the new book
    this.experience.world.books[this.id].obj.clickOut();
    this.interface.currentBook = this.book.obj;
    this.isClicked = true

    // Show the overlay
    this.overlay.show()
    this.overlay.initPager()
    this.overlay.initBookContent(this.id)
  }
}