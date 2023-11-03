import { SlashCommandBuilder } from 'discord.js';
import { setActivity } from '../../helpers/activity-helper.js';

export const data = new SlashCommandBuilder()
	.setName('status')
	.setDescription('Change bot status')
    .addStringOption(option => 
        option.setName('text')
            .setDescription('The message to set the status as'))

export async function execute(interaction, client) {
    const message = interaction.options.getString('text') ?? undefined
    message !== undefined ? setActivity(client, message) : setActivity(client)
	await interaction.reply({ content: 'Status Changed', ephemeral: true });
}