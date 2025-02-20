import { SlashCommandBuilder } from 'discord.js';
import { setActivity } from '../../helpers/activity-helper.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { queryDallE } from '../../helpers/openai-helper.js';

export const data = new SlashCommandBuilder()
	.setName('image')
	.setDescription('Generate an image')
    .addStringOption(option => 
        option.setName('text')
            .setDescription('The prompt to create the image'))

export async function execute(interaction) {
    if (isUser(interaction.user.id)) {
        await interaction.reply({ content: 'Removed this lmao', ephemeral: true })
        // const message = interaction.options.getString('text') ?? undefined
        // if (message !== undefined) {
        //     await interaction.reply({ content: 'Creating image', ephemeral: true })
        //     try {
        //         client.channels.cache.get(interaction.channelId).send(await queryDallE(message))
        //     }
        //     catch (err) {
        //         console.log(err)
        //     }
        // }
	} else {
		await replyNoPremission(interaction);
	}
}