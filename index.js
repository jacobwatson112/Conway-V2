import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'

import { execute as ip } from './commands/server/ip.js'
import { execute as ping } from './commands/test/ping.js'

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
})

const commands = {
	ip,
	ping, 
}

client.on('ready', (event) => {
    console.log('Anyone here got a knife?')
    client.user.setActivity('GUESS WHOS BACK BITCHES', { type: ActivityType.Watching });
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	await commands[interaction.commandName](interaction)
});

client.on('messageCreate', async (message) => {
    //console.log(message)
})

client.login(process.env.DISCORD_TOKEN)