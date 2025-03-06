import { execute as checkbirthdays } from './server/checkBirthdays.js'
import { execute as ip } from './server/ip.js'
import { execute as join } from './server/join.js'
import { execute as leave } from './server/leave.js'
import { execute as play } from './server/play.js'
import { execute as ping} from './test/ping.js'
import { execute as q } from './server/q.js'
import { execute as song } from './server/song.js'
import { execute as sb } from './server/soundboard.js'
import { execute as sb2 } from './server/soundboard.js'
import { execute as sb3 } from './server/soundboard.js'
import { execute as status } from './server/status.js'
import { execute as exit } from './admin/exit.js'
import { execute as image } from './server/generate-image.js'

export const commands = {
	checkbirthdays,
	ip,
	join,
	leave,
	play,
	ping,
	q,
	song,
	sb,
	sb2,
	sb3,
	status,
	exit,
	image,
}
