import * as dat from 'lil-gui'
import Stats from 'three/examples/jsm/libs/stats.module'

export default class Debug
{
    constructor()
    {
        this.active = window.location.hash === '#debug'

        if(this.active)
        {
            this.ui = new dat.GUI()

            this.stats = new Stats()
            this.stats.showPanel(0)
            document.body.appendChild(this.stats.dom);
        }
    }

    update() {
        if(this.active)
        {
            this.stats.update()
        }
    }
}