import { SlashCommandBuilder } from 'discord.js';
import { publicIpv4 } from 'public-ip';

export const data = new SlashCommandBuilder()
	.setName('ip')
	.setDescription('Get Minecraft server ip');

export async function execute(interaction) {
    const ip = await publicIpv4()
	await interaction.reply('The Minecraft Server is currently running on ' + ip);
}