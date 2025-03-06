import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
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
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/;
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const downloadFolder = path.join(__dirname, "../../music/downloads");
        const databasePath = path.join(downloadFolder, "downloads.json");
        const url = interaction.options.getString('text') ?? undefined
        const voiceChannel = interaction.member.voice.channel;
        let downloadedVideos = {};

        // File Checks
        if (!fs.existsSync(downloadFolder)) {
            fs.mkdirSync(downloadFolder, { recursive: true });
        }
        if (fs.existsSync(databasePath)) {
            downloadedVideos = JSON.parse(fs.readFileSync(databasePath, "utf8"));
        }

        // Error Checks
        if (!interaction.guild) {
            await interaction.reply({ content: `can you not dm me`, flags: 64 });
            return;
        }
        if (!url || !regex.test(url)) {
            const urlError = path.join(__dirname, '../../images/error', 'url_error.png');
            await interaction.reply({ files: [new AttachmentBuilder(urlError)], content: 'Bruh wtf is this link.', flags: 64 });
            return;
        }
        if (!voiceChannel) {
            const joinError = path.join(__dirname, '../../images/error', 'join_channel_error.png');
            await interaction.reply({ files: [new AttachmentBuilder(joinError)], content: `My brother, you're not even in a vc`, flags: 64 });
            return;
        }

        // Download from Youtube
        try {
            console.log("Checking for existing download...");

            let videoId;
            if (downloadedVideos[url]) {
                videoId = downloadedVideos[url];
                console.log("Video already downloaded.");
                await interaction.reply({ content: `Playing ${url}`, flags: 64 });
            } else {
                console.log("Downloading new video...");
                await interaction.reply({ content: `Downloading ${url}, I'll join in a second.`, flags: 64 });

                // Get video ID using youtube-dl
                const info = await youtubedl(url, { dumpSingleJson: true });
                videoId = info.id;

                // Download and save as videoId.mp3
                await youtubedl(url, {
                    output: path.join(downloadFolder, `${videoId}.%(ext)s`),
                    extractAudio: true,
                    audioFormat: "mp3",
                    audioQuality: "320K",
                });

                // Update the database
                downloadedVideos[url] = videoId;
                fs.writeFileSync(databasePath, JSON.stringify(downloadedVideos, null, 2));
            }

            // Play the downloaded file
            const filePath = path.join(downloadFolder, `${videoId}.mp3`);
            if (!fs.existsSync(filePath)) {
                console.log("File not found after download.");
                return;
            }

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: false,
            });

            const resource = createAudioResource(filePath, {
                inputType: "arbitrary",
                inlineVolume: true,
            });

            const player = createAudioPlayer();
            connection.subscribe(player);
            player.play(resource);
            console.log("Playing audio!");

        } catch (error) {
            console.error("Error:", error);
            const playError = path.join(__dirname, '../../images/error', 'play_error.png');
            await interaction.reply({ files: [new AttachmentBuilder(playError)], content: `Sorry buddy, this ain't working.`, flags: 64 });
        }
    } else {
        await replyNoPremission(interaction);
    }
}
