import { REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
import { data } from './src/commands/data.js'

dotenv.config()

const discordToken = process.env.DISCORD_TOKEN
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID

const commands = [];
for (let c of data) {
	commands.push(c.toJSON())
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
