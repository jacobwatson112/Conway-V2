import { SlashCommandBuilder } from 'discord.js';
import { getUserJsonPath, isAdminUser } from '../../helpers/user-helper.js';
import { replyFileError, replyNoPremission } from '../../helpers/command-helper.js';
import fs from 'fs';

export const data = new SlashCommandBuilder()
    .setName('getsystemmessage')
    .setDescription('Get a user\'s current system message')
    .addStringOption(option =>
        option.setName('identifier')
            .setDescription('Name or DiscordId of the user')
            .setRequired(true));

export async function execute(interaction) {
    const filePath = getUserJsonPath();

    if (!isAdminUser(interaction.user.id)) {
        return await replyNoPremission(interaction);
    }

    const identifier = interaction.options.getString('identifier');

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const json = JSON.parse(data);

        const user = json.users.find(user =>
            user.id === identifier || user.firstName?.toLowerCase() === identifier.toLowerCase());

        if (!user) {
            return await interaction.reply({ content: 'User not found.', flags: 64 });
        }

        const systemMessage = user.systemMessage ?? 'No system message set for this user.';
        await interaction.reply({ content: `System message for ${user.firstName ?? user.id}: ${systemMessage}`, flags: 64 });

    } catch (error) {
        console.error('Error reading user data:', error);
        return await replyFileError(interaction);
    }
}
