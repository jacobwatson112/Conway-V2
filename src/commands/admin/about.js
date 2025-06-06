import { SlashCommandBuilder } from 'discord.js';
import pkg from '../../../package.json' assert { type: 'json'};
import { replyNoPremission } from '../../helpers/command-helper.js';
import { isUser } from '../../helpers/user-helper.js';

export const data = new SlashCommandBuilder()
	.setName('about')
	.setDescription('About Conway')


export async function execute(interaction) {
    if (isUser(interaction.user.id)) {
        await interaction.reply({ content: 'Conway\nVersion: ' + pkg.version + '\n™ and © 1955 - 2011\nAll Rights Reserved'});
  } else {
    await replyNoPremission(interaction);
  }
}