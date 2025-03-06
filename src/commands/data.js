import { data as checkBirthdays } from './server/checkBirthdays.js'
import { data as ip } from './server/ip.js'
import { data as join } from './server/join.js'
import { data as leave } from './server/leave.js'
import { data as play } from './server/play.js'
import { data as ping } from './test/ping.js'
import { data as q } from './server/q.js'
import { data as song } from './server/song.js'
import { data as sb } from './server/soundboard.js'
import { data2 as sb2 } from './server/soundboard.js'
import { data3 as sb3 } from './server/soundboard.js'
import { data as status } from './server/status.js'
import { data as exit } from './admin/exit.js'
import { data as image } from './server/generate-image.js'

export const data = [
	checkBirthdays,
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
	image
]
