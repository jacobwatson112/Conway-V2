import { SlashCommandBuilder } from 'discord.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { isAdminUser} from '../../helpers/user-helper.js';

export const data = new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Repeat message')
    .addStringOption(option =>
        option.setName('message')
            .setDescription('What Conway should repeat')
            .setRequired(true))

export async function execute(interaction) {
    if (isAdminUser(interaction.user.id)) {
        await interaction.deferReply({ ephemeral: true });
        const message = interaction.options.getString('message');

        const channel = await interaction.client.channels.fetch(interaction.channelId);
        await channel.send(message);
        await interaction.deleteReply(); 
    } else {
        await replyNoPremission(interaction);
    }
}