import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { getVoiceConnection  } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
	.setName('leave')
	.setDescription('Leave voice channel')

export async function execute(interaction) {
    if (isUser(interaction.user.id)) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command must be used in a server.', ephemeral: true });
            return;
        }
        const connection = getVoiceConnection(interaction.guild.id);
        if (connection) {
            connection.destroy();
            await interaction.reply({ content: 'Bye bye 👋', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Bruh I aint in no channel', ephemeral: true });
        }
	} else {
		await replyNoPremission(interaction);
	}
}

