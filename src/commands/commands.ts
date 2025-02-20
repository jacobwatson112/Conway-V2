import { execute as checkbirthdays } from './server/checkBirthdays'
import { execute as ip } from './server/ip'
import { execute as ping} from './test/ping'
import { execute as status } from './server/status'
import { execute as exit } from './admin/exit'
import { execute as image } from './server/generate-image'
import { execute as join } from './server/join'
import { execute as leave } from './server/leave'
import { execute as play } from './server/play'

export const commands = {
	checkbirthdays,
	ip,
	ping,
	status,
	exit,
	image,
	join,
	leave,
	play
}
