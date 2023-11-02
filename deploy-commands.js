import { REST, Routes } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { getGlobals } from 'common-es'

dotenv.config()

const discordToken = process.env.DISCORD_TOKEN
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID
const { __dirname } = getGlobals(import.meta.url)

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(discordToken);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

        // Global application commands will be available in all the guilds your application has the applications.commands scope authorized in, and in direct messages by default.

/*         const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        ); */

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
