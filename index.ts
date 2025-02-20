import { Client, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import { CronJob } from 'cron'
import { commands } from './src/commands/commands'
import usersJSON from "./src/json/users.json"
import { getBirthdayStatus, getBirthdays, writeBirthdayMessage } from './src/helpers/birthday-helper'
import { setActivity } from './src/helpers/activity-helper'
import { getUser } from './src/helpers/user-helper'
import { getChannel } from './src/helpers/channels-helper'
import { queryOllama } from './src/helpers/ollama-helper'
import { cleanMessageHistory } from './src/helpers/date-helper'
import { MessageHistory } from './src/types/messageHistory'
import { DateTime } from 'luxon'

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ]
})

const shutdown = new CronJob('0 50 21 * * *', () => {
    process.exit()
});

shutdown.start();

let messageHistory: MessageHistory[] = []

client.on('ready', (event) => {
    console.log('Anyone here got a knife?')
    const userBirthday = getBirthdays(usersJSON.users)
    console.log(userBirthday)

    userBirthday ? setActivity(client, getBirthdayStatus(userBirthday)) : setActivity(client)

    if (userBirthday) {
        writeBirthdayMessage(client, userBirthday, messageHistory)
    }
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	await commands[interaction.commandName as keyof typeof commands](interaction);
});

client.on('messageCreate', async (message) => {
    try {
        const user = getUser(usersJSON.users, message.author.id)
        const channel = getChannel(message.channelId)
        const no = channel?.odds ? Math.floor(Math.random() * channel.odds) : 1

        if (user && channel) {
            if (no === 0 || (message.content.toLowerCase().includes('conway'))) {
                messageHistory = cleanMessageHistory(messageHistory);

                messageHistory.push({timestamp: DateTime.now().toMillis(), msg: { 'role': 'user', 'content': message.content }})

                console.log("===== NEW MESSAGE =====")
                console.log("Replying to message in channel " + channel.name)
                console.log('Content: ' + message.content)
                const reply = await queryOllama(client, messageHistory, user, channel)

                messageHistory.push({timestamp: DateTime.now().toMillis(), msg: { 'role': 'assistant', 'content': reply }})
            }
        }



    } catch (e) {
        console.log(e)
    }
})

client.login(process.env.DISCORD_TOKEN)