import { execute as checkbirthdays } from './server/checkBirthdays.js'
import { execute as ip } from './server/ip.js'
import { execute as ping} from './test/ping.js'
import { execute as status } from './test/status.js'
import { execute as exit } from './test/exit.js'
import { execute as image } from './test/generate-image.js'

export const commands = {
	checkbirthdays,
	ip,
	ping,
	status,
	exit,
	image,
}
