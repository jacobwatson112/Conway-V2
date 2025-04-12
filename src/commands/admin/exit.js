import { SlashCommandBuilder } from 'discord.js';
import { isAdminUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';

export const data = new SlashCommandBuilder()
	.setName('exit')
	.setDescription('Shutdown Conway')

export async function execute(interaction) {
    if (isAdminUser(interaction.user.id)) {
        await interaction.reply({ content: 'Shutting down', flags: 64 });
		process.exit()
	} else {
		await replyNoPremission(interaction);
	}
}
