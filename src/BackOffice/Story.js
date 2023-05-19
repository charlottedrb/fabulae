import DataManager from "../Data/DataManager"

export default class Story {
    constructor() {
        this.dataManager = new DataManager()
        this.backOffice = new BackOffice()
        this.setCategorySelectionOptions()

        this.events()
    }

    events()
    {
        document.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault()
            this.submitForm()
        })
    }

    submitForm()
    {
        const title = document.querySelector('#title').value
        const content = document.querySelector('#content').value
        const categoryId = document.querySelector('#category').value
        const authorId = this.backOffice.author.id

        const story = {
            title,
            content,
            categoryId,
            authorId,
            imagePath: '',
            comments: [],
            createdAt: new Date().toISOString()
        }

        this.dataManager.addStory(story)
    }

    setCategorySelectionOptions()
    {
        const select = document.querySelector('#category')

        this.dataManager.categories.forEach(category => {
            const option = document.createElement('option')
            option.value = category.id
            option.innerHTML = category.name
            select.appendChild(option)
        })
    }
}
