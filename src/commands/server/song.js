import { SlashCommandBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import fs from 'fs';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

export const data = new SlashCommandBuilder()
	.setName('song')
	.setDescription('play a song')
    .addStringOption(option => 
        option.setName('text')
            .setDescription('Song to play')
            .setRequired(true)
            .setChoices(
                { name: 'carl', value: 'carl.mp3' },
                { name: 'Gas Money', value: 'gas.mp3' },
                { name: 'GTA 4', value: 'gta.mp3' },
                { name: 'Hero', value: 'hero.mp3' },
                { name: 'illuminatitv', value: 'illuminatitv.mp3' },
                { name: 'Welcome to my Mine', value: 'mine.mp3' },
                { name: 'Ram Ranch 7', value: 'RamRanch7.mp3' },
                { name: 'Rich', value: 'rich.mp3' },
                { name: 'Rico', value: 'rico.mp3' },
                { name: 'Shia Labeouf Live', value: 'shia.mp3' },
                { name: 'Sprite', value: 'sprite.mp3' },
                { name: 'Stephen', value: 'stephen.mp3' },
                { name: 'Chug Jug', value: 'victory.mp3' },
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
            inputType: 'arbitrary',
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