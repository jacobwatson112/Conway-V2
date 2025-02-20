import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { publicIpv4 } from 'public-ip';
import { isUser } from '../../helpers/user-helper';
import { replyNoPremission } from '../../helpers/command-helper';

export const data = new SlashCommandBuilder()
	.setName('ip')
	.setDescription('Get server ip');

export async function execute(interaction: CommandInteraction) {
	if (isUser(interaction.user.id)) {
		const ip = await publicIpv4()
		await interaction.reply('The server is currently running on ' + ip);
	} else {
		await replyNoPremission(interaction);
	}
}