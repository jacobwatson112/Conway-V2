import { execute as checkbirthdays } from './server/checkBirthdays.js'
import { execute as ip } from './server/ip.js'
import { execute as ping} from './test/ping.js'
import { execute as status } from './test/status.js'

export const commands = {
	checkbirthdays,
	ip,
	ping,
	status,
}
