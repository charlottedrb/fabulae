export default class BookContent {
    constructor()
    {
        this.init()
    }

    init()
    {
        this.pager = new Pager()

        this.getElements()
        this.onEnterCompleted()
    }

    getElements()
    {
        this.el = document.querySelector('.book__content')
        this.leftPage = this.el.querySelector('.book__left-page')
        this.rightPage = this.el.querySelector('.book__right-page')
    }

    events()
    {
        
    }

    onEnterCompleted()
    {

    }

    fadeIn()
    {

    }

    fadeOut()
    {

    }
}