import { data as checkBirthdays } from './server/checkBirthdays.js'
import { data as ip } from './server/ip.js'
import { data as ping } from './test/ping.js'
import { data as status } from './server/status.js'
import { data as exit } from './admin/exit.js'
import { data as image } from './server/generate-image.js'

export const data = [
	checkBirthdays,
	ip,
	ping,
    status,
	exit,
	image
]
