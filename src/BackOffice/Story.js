import DataManager from "../Data/DataManager"
import BackOffice from "./BackOffice"

export default class Story {
    constructor() {
        this.dataManager = new DataManager()
        this.backOffice = new BackOffice()
        this.setCategoryCheckboxes()

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

    setCategoryCheckboxes()
    {
        const container = document.querySelector('#category')

        this.dataManager.categories.forEach(category => {
            const radio = document.createElement('input')
            const label = document.createElement('label')

            radio.type = 'radio'
            radio.value = category.id
            radio.id = category.id
            radio.name = 'category'

            label.setAttribute('for', category.id)
            label.innerHTML = category.name

            const div = document.createElement('div')
            div.classList.add('form__radio-group')
            div.appendChild(radio)
            div.appendChild(label)

            container.appendChild(div)
        })
    }
}
