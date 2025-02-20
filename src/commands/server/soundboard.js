import { SlashCommandBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import fs from 'fs';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';
import { fileURLToPath } from 'url';

export const data = new SlashCommandBuilder()
	.setName('soundboard')
	.setDescription('play from the soundboard')
    .addStringOption(option => 
        option.setName('text')
            .setDescription('Clip to play')
            .setRequired(true)
            .setChoices(
                { name: 'sleepydengnft', value: 'sleepydengnft' },
                { name: 'Clip 2', value: 'clip2' },
                { name: 'Clip 3', value: 'clip3' }
            )
    );

export async function execute(interaction) {
    if (isUser(interaction.user.id)) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command must be used in a server.', ephemeral: true });
            return;
        }

        // Get the voice channel the user is in
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply({ content: 'You must join a voice channel first!', ephemeral: true });
            return;
        }

        // Join the voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        // Specify the path to the MP3 file or clip
        const clip = interaction.options.getString('text') ?? undefined // You can specify different clips based on the input
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const filePath = path.join(__dirname, '../../music/soundboard', `${clip}.mp3`); // Adjust your path to the MP3 files

        if (!fs.existsSync(filePath)) {
            await interaction.reply({ content: `Clip "${clip}" not found.`, ephemeral: true });
            return;
        }

        // Create an audio resource from the MP3 file
        const resource = createAudioResource(filePath, {
            inputType: 'arbitrary', // Specifies that we are using raw MP3 data
            inlineVolume: true,
        });

        // Create the audio player and play the resource
        const player = createAudioPlayer();
        connection.subscribe(player);
        player.play(resource);

        // Reply to the user
        await interaction.reply({ content: `Playing clip: ${clip}`, ephemeral: true });

        // Handle stopping the audio when it's done
        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy(); // Destroy connection once done
        });
    } else {
        await replyNoPremission(interaction);
    }
}