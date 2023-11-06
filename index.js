import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import { commands } from './src/commands/commands.js'
import usersJSON from "./src/json/users.json" assert { type: 'json'}
import { getBirthdayStatus, getBirthdays } from './src/helpers/birthday-helper.js'
import { setActivity } from './src/helpers/activity-helper.js'
import { queryOpenAi, queryOpenAiFollowup } from './src/helpers/openai-helper.js'
import { getUser } from './src/helpers/user-helper.js'
import { getChannel } from './src/helpers/channels-helper.js'

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

let lastMessage

client.on('ready', (event) => {
    console.log('Anyone here got a knife?')
    const userBirthday = getBirthdays(usersJSON.users)
    console.log(userBirthday)

    userBirthday !== undefined ? setActivity(client, getBirthdayStatus(userBirthday)) : setActivity(client)

    //client.user.setActivity('GUESS WHOS BACK BITCHES', { type: ActivityType.Watching });
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	await commands[interaction.commandName](interaction, client)
});

client.on('messageCreate', async (message) => {
    const user = getUser(usersJSON.users, message.author.id)
    const channel = getChannel(message.channelId)
    console.log(channel)
    const no = Math.floor(Math.random() * channel.odds)
    console.log(no)
    if (user && channel && no === 0) {
        if (lastMessage) {
            lastMessage = await queryOpenAiFollowup(process.env.OPENAI_API_KEY, client, message, user, lastMessage)
        } else {
            lastMessage = await queryOpenAi(process.env.OPENAI_API_KEY, client, message, user)
        }
    }
})

client.login(process.env.DISCORD_TOKEN)