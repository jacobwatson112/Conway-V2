import { execute as ip } from './server/ip.js'
import { execute as ping} from './test/ping.js'

export const commands = {
	ip,
	ping, 
}