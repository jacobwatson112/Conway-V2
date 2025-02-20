import { data as checkBirthdays } from './server/checkBirthdays'
import { data as ip } from './server/ip'
import { data as ping } from './test/ping'
import { data as status } from './server/status'
import { data as exit } from './admin/exit'
import { data as image } from './server/generate-image'
import { data as join } from './server/join'
import { data as leave } from './server/leave'
import { data as play } from './server/play'

export const data = [
	checkBirthdays,
	ip,
	ping,
    status,
	exit,
	image,
	join,
	leave,
	play,
]
