import { SlashCommandBuilder } from 'discord.js';
import { getUserJsonPath, isAdminUser } from '../../helpers/user-helper.js';
import { replyFileError, replyNoPremission } from '../../helpers/command-helper.js';
import fs from 'fs';

export const data = new SlashCommandBuilder()
    .setName('editsystemmessage')
    .setDescription('Edit a user\'s system message')
    .addStringOption(option =>
        option.setName('identifier')
            .setDescription('Name or DiscordId of the user')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('message')
            .setDescription('New system message')
            .setRequired(true));

export async function execute(interaction) {
    const filePath = getUserJsonPath();

    if (!isAdminUser(interaction.user.id)) {
        return await replyNoPremission(interaction);
    }

    const identifier = interaction.options.getString('identifier');
    const message = interaction.options.getString('message');

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const json = JSON.parse(data);

        const user = json.users.find(user =>
            user.id === identifier || user.firstName?.toLowerCase() === identifier.toLowerCase());

        if (!user) {
            return await interaction.reply({ content: 'User not found.', flags: 64 });
        }

        user.systemMessage = message;

        await fs.promises.writeFile(filePath, JSON.stringify(json, null, 4), 'utf8');
        await interaction.reply({ content: `Updated system message for ${user.firstName ?? user.id}`, flags: 64 });

    } catch (error) {
        console.error('Error updating user:', error);
        return await replyFileError(interaction);
    }
}
