import { SlashCommandBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

export const data = new SlashCommandBuilder()
	.setName('sb')
	.setDescription('play from the soundboard')
    .addStringOption(option => 
        option.setName('text')
            .setDescription('Clip to play')
            .setRequired(true)
            .setChoices(
                { name: 'arabic', value: 'arabic.mp3' },
                { name: 'army', value: 'army.mp3' },
                { name: 'bababooey', value: 'bababooey.mp3' },
                { name: 'brain fart', value: 'brain-fart.mp3' },
                { name: 'bruh', value: 'bruh.mp3' },
                { name: 'clap', value: 'clap.mp3' },
                { name: 'congrats', value: 'congrats.mp3' },
                { name: 'creeper', value: 'creeper.mp3' },
                { name: 'fart', value: 'fart.mp3' },
                { name: 'fart2', value: 'fart2.mp3' },
                { name: 'fbi', value: 'fbi.mp3' },
                { name: 'Fuck You', value: 'fu.mp3' },
                { name: 'GET THE FUCK OUT OF MY ROOM IM PLAYING MINECRAFT', value: 'minecraft.mp3' },
                { name: 'helikopter', value: 'helikopter.mp3' },
                { name: 'James Noises', value: 'james_noises.mp3' },
                { name: 'jojo', value: 'jojo.mp3' },
                { name: 'JOKES OVER', value: 'joke.mp3' },
                { name: 'Kim Jong in the jungle', value: 'kim.mp3' },
                { name: 'knocking', value: 'knocking.mp3' },
                { name: 'laugh', value: 'laugh.mp3' },
                { name: 'lets go', value: 'letsgo.mp3' },
                { name: 'LTT', value: 'ltt.mp3' },
                { name: 'LTT earrape', value: 'ltt2.mp3' },
                { name: 'Metal Pipe', value: 'pipe.mp3' },
                { name: 'mustard', value: 'mustard.mp3' },
            )
    );

export const data2 = new SlashCommandBuilder()
    .setName('sb2')
    .setDescription('play from the soundboard')
    .addStringOption(option => 
        option.setName('text')
            .setDescription('Clip to play')
            .setRequired(true)
            .setChoices(
                { name: 'muta laugh', value: 'mutalaugh.mp3' },
                { name: 'nice', value: 'nice.mp3' },
                { name: 'ninja', value: 'ninja.mp3' },
                { name: 'Oh No', value: 'ohno.mp3' },
                { name: 'oof', value: 'oof.mp3' },
                { name: 'outro', value: 'outro.mp3' },
                { name: 'pookie', value: 'pookie.mp3' },
                { name: 'PS1', value: 'ps1.mp3' },
                { name: 'PS2', value: 'ps2.mp3' },
                { name: 'shhh', value: 'shhh.wav' },
                { name: 'Sigma Boy', value: 'sigma-boy.mp3' },
                { name: 'Skype', value: 'skype.mp3' },
                { name: 'skux', value: 'skux.mp3' },
                { name: 'sleepydengnft', value: 'sleepydengnft.mp3' },
                { name: 'spiderman', value: 'spiderman.mp3' },
                { name: 'rehehehe', value: 'rehehehe.mp3' },
                { name: 'rizz', value: 'rizz.mp3' },
                { name: 'rizz2', value: 'rizz2.mp3' },
                // { name: 'Thanks Mark', value: 'Thanks_Mark.mp4' },
                { name: 'Tokyo Drift', value: 'tokyo.mp3' },
                { name: 'train', value: 'train.mp3' },
                { name: 'There you are you little shit', value: 'valshit.mp3' },
                { name: 'valorant footstep', value: 'valorant-footstep.mp3' },
                { name: 'violin', value: 'violin.mp3' },
                { name: 'waltuh', value: 'waltuh.mp3' },
            )
    );

export const data3 = new SlashCommandBuilder()
    .setName('sb3')
    .setDescription('play from the soundboard')
    .addStringOption(option => 
        option.setName('text')
            .setDescription('Clip to play')
            .setRequired(true)
            .setChoices(
                { name: 'what', value: 'what.mp3' },
                { name: 'wonderful', value: 'wonderful.mp3' },
                { name: 'xmas', value: 'xmas1.mp3' },
                { name: 'xmas2', value: 'xmas2.mp3' },
                { name: 'xp', value: 'xp.mp3' },
                { name: 'Xue Hua Piao Piao', value: 'xue-hua-piao-piao.mp3' },
                { name: 'zam', value: 'zam.mp3' },
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
        const filePath = path.join(__dirname, '../../music/soundboard', clip);

        if (!fs.existsSync(filePath)) {
            await interaction.reply({ content: `Soundboard item "${clip}" not found.`, flags: 64 });
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

        await interaction.reply({ content: `Playing: ${clip} from soundboard`, flags: 64 });
    } else {
        await replyNoPremission(interaction);
    }
}