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
import { addMessageHistory, cleanMessageHistory } from './src/helpers/history-helper.js'
import { DateTime } from 'luxon'
import { updateUserScore } from './src/helpers/score-helper.js'
import { setMood } from './src/helpers/mood-helper.js'

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

client.on('ready', (event) => {
    console.log('Anyone here got a knife?')
    const userBirthday = getBirthdays(usersJSON.users)
    console.log(userBirthday)

    userBirthday ? setActivity(client, getBirthdayStatus(userBirthday)) : setActivity(client)

    if (userBirthday) {
        writeBirthdayMessage(client, userBirthday)
    }
    setMood()
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	await commands[interaction.commandName](interaction)
});

client.on('messageCreate', async (message) => {
    try {
        const user = getUser(message.author.id)
        const channel = getChannel(message.channelId)
        const no = channel?.odds ? Math.floor(Math.random() * channel.odds) : 1

        if (user && channel) {
            const alwaysReply = message.content.toLowerCase().includes('conway' || '<@818647774823317514>')
            if (no === 0 || alwaysReply) {
                cleanMessageHistory();
                addMessageHistory('user', message.content)
                
                let systemMessageCtx = ''

                if (message.content.toLowerCase().includes('<@818647774823317514>')) {
                    systemMessageCtx = "You have been manually pinged, you don't like it when users @ you and you should tell them not to do this."
                }

                console.log("===== NEW MESSAGE =====")
                console.log("Replying to message in channel " + channel.name)
                console.log('Content: ' + message.content)
                const reply = await queryOllama(client, user, channel, systemMessageCtx)

                addMessageHistory('assistant', reply)
            }
        }

        if (user) {
            updateUserScore(message)
        }

    } catch (e) {
        console.log(e)
    }
})

client.login(process.env.DISCORD_TOKEN)