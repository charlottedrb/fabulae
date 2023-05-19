import * as authors from './authors'
import * as books from './books'
import * as comments from './comments'
import * as users from './users'
import * as categories from './categories'

/**
 * @class DataManager
 * @description This class is used to manage the data of the application
 */
export default class DataManager {
    constructor() 
    {
        this.authors = null
        this.books = null 
        this.comments = null 
        this.users = null
        this.categories = null

        this.init()
    }

    init() 
    {
        this.authors = authors.default
        this.books = books.default
        this.comments = comments.default
        this.users = users.default
        this.categories = categories.default
    }

    /**
     * Authors
     */

    /**
     * 
     * @param {int} id 
     * @returns {object}
     */
    getAuthorById(id)
    {
        return this.authors.find(author => author.id === id)
    }

    /**
     * 
     * @returns {object}
     */
    getFirstAuthor()
    {
        return this.authors[0]
    }

    /**
     * 
     * @param {string} name 
     * @returns {object}
     */
    getAuthorByName(name) 
    {
        return this.authors.find(author => author.firstName === name || author.lastName === name)
    }

    /**
     * Books
     */

    /**
     * 
     * @param {int} id 
     * @returns {object}
     */
    getBookById(id)
    {
        return this.books.find(book => book.id === id)
    }

    /**
     * 
     * @param {string} title 
     * @returns {object}
     */
    getBookByTitle(title)
    {
        return this.books.find(book => book.title === title)
    }

    /**
     * 
     * @param {int} id 
     * @returns {array}
     */
    getBooksByCategory(id) 
    {
        return this.books.filter(book => book.categoryId === id)
    }
    
    /**
     * Stories
     */
    addStory(story) 
    {
        this.stories.push(story)
    }

    /**
     * Comments
     */

    /**
     * 
     * @param {int} id 
     * @returns {array}
     */
    getCommentsByBook(id)
    {
        return this.comments.filter(comment => comment.bookId === id)
    }
}