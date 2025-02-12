import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import { CronJob } from 'cron'
import { commands } from './src/commands/commands.js'
import usersJSON from "./src/json/users.json" assert { type: 'json'}
import { getBirthdayStatus, getBirthdays, writeBirthdayMessage } from './src/helpers/birthday-helper.js'
import { setActivity } from './src/helpers/activity-helper.js'
import { getUser } from './src/helpers/user-helper.js'
import { getChannel } from './src/helpers/channels-helper.js'
import { queryOllama } from './src/helpers/ollama-helper.js'

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ]
})

const shutdown = new CronJob('0 50 20 * * *', () => {
    process.exit()
});

shutdown.start();

let lastMessage

client.on('ready', (event) => {
    console.log('Anyone here got a knife?')
    const userBirthday = getBirthdays(usersJSON.users)
    console.log(userBirthday)

    userBirthday ? setActivity(client, getBirthdayStatus(userBirthday)) : setActivity(client)

    if (userBirthday) {
        writeBirthdayMessage(client, userBirthday)
    }
    //client.user.setActivity('GUESS WHOS BACK BITCHES', { type: ActivityType.Watching });
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	await commands[interaction.commandName](interaction, client)
});

client.on('messageCreate', async (message) => {
    try {
        const user = getUser(usersJSON.users, message.author.id)
        const channel = getChannel(message.channelId)
        const no = channel?.odds ? Math.floor(Math.random() * channel.odds) : 1
        if (user && channel && no === 0 || (message.content.toLowerCase().includes('conway'))) {
            console.log("===== NEW MESSAGE =====")
            console.log("Sending message in channel " + channel.name)
            lastMessage = await queryOllama(client, message, user, channel, lastMessage)
        }
    } catch (e) {
        console.log(e)
    }
})

client.login(process.env.DISCORD_TOKEN)