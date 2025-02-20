import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType } from '@discordjs/voice';
import { useMainPlayer } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor'

export const data = new SlashCommandBuilder()
	.setName('play')
	.setDescription('Play a youtube link')
    .addStringOption(option => 
        option.setName('text')
            .setDescription('URL'));

export async function execute(interaction) {
    if (isUser(interaction.user.id)) {
        const player = useMainPlayer();
        // const channel = interaction.member.voice.channel;
        // if (interaction.member.voice.channel) {
        //     const query = 'https://www.youtube.com/watch?v=qUk1ZoCGqsA'

        //     // const connection = joinVoiceChannel({
        //     //     channelId: interaction.member.voice.channel.id,
        //     //     guildId: interaction.guild.id,
        //     //     adapterCreator: interaction.guild.voiceAdapterCreator,
        //     // });

        //     await interaction.deferReply();
 
        //     try {
        //       const { track } = await player.play(channel, query, {
        //         nodeOptions: {
        //           // nodeOptions are the options for guild node (aka your queue in simple word)
        //           metadata: interaction, // we can access this metadata object using queue.metadata later on
        //         },
        //       });
           
        //       return interaction.followUp(`**${track.title}** enqueued!`);
        //     } catch (e) {
        //       // let's return error if something failed
        //       return interaction.followUp(`Something went wrong: ${e}`);
        //     }

        // } else {
        //     await interaction.reply({ content: 'You need to join a voice channel first!', flags: 64 });
        // }
    } else {
        await replyNoPremission(interaction);
    }
}
