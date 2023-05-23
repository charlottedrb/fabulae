import DataManager from "../Data/DataManager";

let backOffice = null;

export default class BackOffice {
    constructor()
    {
        // Singleton
        if(backOffice)
        {
            return backOffice
        }
        backOffice = this
        
        // Global access
        window.backOffice = this

        this.dataManager = new DataManager();
        this.author = null

        this.init();
    }

    init()
    {
        this.author = this.dataManager.getFirstAuthor()
        this.setHTMLVariables()
    }

    setHTMLVariables()
    {
        this.setAuthorFirstName()
    }

    setAuthorFirstName()
    {
        document.querySelectorAll('.author__first-name').forEach(el => {
            el.innerHTML = this.author.firstName
        })
    }

}