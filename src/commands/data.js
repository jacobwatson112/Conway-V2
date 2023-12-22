import { data as checkBirthdays } from './server/checkBirthdays.js'
import { data as ip } from './server/ip.js'
import { data as ping } from './test/ping.js'
import { data as status } from './test/status.js'

export const data = [
	checkBirthdays,
	ip,
	ping,
    status,
]
