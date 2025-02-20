import { SlashCommandBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { joinVoiceChannel } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
	.setName('join')
	.setDescription('Join current voice channel')

export async function execute(interaction) {
    if (isUser(interaction.user.id)) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command must be used in a server.', ephemeral: true });
            return;
        }

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
        });
        await interaction.reply({ content: 'Joined', ephemeral: true });
	} else {
		await replyNoPremission(interaction);
	}
}

