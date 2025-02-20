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
                { name: 'Chug Jug', value: 'victory.mp3' },
                { name: 'Gas Money', value: 'gas.mp3' },
                { name: 'GigaChad (Phonk)', value: 'chad.mp3' },
                { name: 'GTA 4', value: 'gta.mp3' },
                { name: 'Hero', value: 'hero.mp3' },
                { name: 'illuminatitv', value: 'illuminatitv.mp3' },
                { name: 'Let it snow', value: 'snow.mp3' },
                { name: 'Program in C', value: 'c.mp3' },
                { name: 'Ram Ranch 7', value: 'RamRanch7.mp3' },
                { name: 'Rich', value: 'rich.mp3' },
                { name: 'Rico', value: 'rico.mp3' },
                { name: 'Shia Labeouf Live', value: 'shia.mp3' },
                { name: 'Sprite', value: 'sprite.mp3' },
                { name: 'Stephen', value: 'stephen.mp3' },
                { name: 'Subway Sexist', value: 'subway.mp3' },
                { name: 'Welcome to my Mine', value: 'mine.mp3' },
            )
    );

export async function execute(interaction) {
    if (isUser(interaction.user.id)) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command must be used in a server.', flags: 64 });
            return;
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply({ content: 'You must join a voice channel first!', flags: 64 });
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
        const filePath = path.join(__dirname, '../../music/songs', clip);

        if (!fs.existsSync(filePath)) {
            await interaction.reply({ content: `Song "${clip}" not found.`, flags: 64 });
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

        const player = createAudioPlayer();
        connection.subscribe(player);
        player.play(resource);

        await interaction.reply({ content: `Playing song: ${clip}`, flags: 64 });

    } else {
        await replyNoPremission(interaction);
    }
}