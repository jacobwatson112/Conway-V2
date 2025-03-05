import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType } from '@discordjs/voice';
import youtubedl from "youtube-dl-exec";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

export const data = new SlashCommandBuilder()
	.setName('play')
	.setDescription('Play a youtube link')
    .addStringOption(option => 
        option.setName('text')
            .setDescription('Youtube URL'));

export async function execute(interaction) {
    if (isUser(interaction.user.id)) {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const downloadFolder = path.join(__dirname, "../../music/downloads");
        const filePath = path.join(downloadFolder, "file.mp3");

        if (!fs.existsSync(downloadFolder)) {
            fs.mkdirSync(downloadFolder, { recursive: true });
        }
        if (fs.existsSync(filePath)) {
            console.log("File already exists, replacing...");
            fs.unlinkSync(filePath);
        }

        if (!interaction.guild) {
            await interaction.reply({ content: 'This command must be used in a server.', flags: 64 });
            return;
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply({ content: 'You must join a voice channel first!', flags: 64 });
            return;
        }

        try {
            const url = interaction.options.getString('text') ?? undefined
            console.log("Downloading...");
            await interaction.reply({ content: `Downloading ${url} I'll join in a second.`, flags: 64 });
    
            await youtubedl(url, {
                output: path.join(downloadFolder, "file.%(ext)s"), // Save with title
                extractAudio: true, // Extract only audio
                audioFormat: "mp3", // Convert to MP3
                audioQuality: "320K", // Highest audio quality
            });
    
            console.log("Download complete!");
        } catch (error) {
            await interaction.reply({content: `Sorry buddy, this ain't working.`, flags: 64})
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        if (!fs.existsSync(filePath)) {
            console.log('File not found')
            return;
        }

        const resource = createAudioResource(filePath, {
            inputType: 'arbitrary',
            inlineVolume: true,
        })

        const player = createAudioPlayer();
        connection.subscribe(player);
        player.play(resource);
        console.log('Done!')
    } else {
        await replyNoPremission(interaction);
    }
}