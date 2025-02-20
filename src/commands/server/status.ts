import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { setActivity } from '../../helpers/activity-helper';
import { isUser } from '../../helpers/user-helper';
import { replyNoPremission } from '../../helpers/command-helper';

export const data = new SlashCommandBuilder()
	.setName('status')
	.setDescription('Change bot status')
    .addStringOption(option => 
        option.setName('text')
            .setDescription('The message to set the status as'))

export async function execute(interaction: CommandInteraction) {
    if (isUser(interaction.user.id)) {
        // const message = interaction.options.getString('text') ?? undefined
        // message !== undefined ? setActivity(interaction.client, message) : setActivity(interaction.client)
        await interaction.reply({ content: 'Status Changed', ephemeral: true });
	} else {
		await replyNoPremission(interaction);
	}
}