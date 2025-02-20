import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { setActivity } from '../../helpers/activity-helper';
import { isUser } from '../../helpers/user-helper';
import { replyNoPremission } from '../../helpers/command-helper';

export const data = new SlashCommandBuilder()
	.setName('exit')
	.setDescription('Shutdown Conway')

export async function execute(interaction: CommandInteraction) {
	// Need to make this an admin only command
    if (isUser(interaction.user.id)) {
        await interaction.reply({ content: 'Shutting down', ephemeral: true });
		process.exit()
	} else {
		await replyNoPremission(interaction);
	}
}
