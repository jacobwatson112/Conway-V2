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
                { name: 'sleepydengnft', value: 'sleepydengnft.mp3' },
                { name: 'shhh', value: 'shhh.wav' },
                { name: 'Thanks Mark', value: 'Thanks_Mark.mp4' }
            )
    );

export async function execute(interaction) {
    if (isUser(interaction.user.id)) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command must be used in a server.', ephemeral: true });
            return;
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply({ content: 'You must join a voice channel first!', ephemeral: true });
            return;
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        const clip = interaction.options.getString('text') ?? undefined
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const filePath = path.join(__dirname, '../../music/soundboard', clip);

        if (!fs.existsSync(filePath)) {
            await interaction.reply({ content: `Clip "${clip}" not found.`, ephemeral: true });
            return;
        }

        let fileInput = filePath
        let resource

        if (filePath.endsWith('.mp4')) {
            // If it's an MP4 file, use FFmpeg to extract audio
            const ffmpeg = spawn('ffmpeg', [
                '-i', filePath,            // Input file
                '-f', 'wav',               // Output format as WAV
                '-ar', '48000',            // Set the audio sample rate to 48kHz
                '-ac', '2',                // Set to stereo (2 channels)
                '-vn',                     // Don't include video stream
                'pipe:1'                   // Output to stdout (pipe)
            ]);
    
            fileInput = ffmpeg.stdout
        } 

        resource = createAudioResource(fileInput, {
            inputType: AudioPlayerInputType.Arbitrary,
            inlineVolume: true,
        })


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