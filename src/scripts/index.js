
import DataManager from '../Data/DataManager.js'
import * as Taxi from '@unseenco/taxi'
import CustomRenderer from '../config/Renderer.js'
import Cursor from '../Experience/Utils/Cursor.js'

/**
 * Landing
 */
const taxi = new Taxi.Core({
    renderers: {
		default: CustomRenderer,
	}
})

const animation = new Animation()
