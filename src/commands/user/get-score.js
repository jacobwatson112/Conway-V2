import { SlashCommandBuilder } from 'discord.js';
import { getUserJsonPath, isUser } from '../../helpers/user-helper.js';
import { replyFileError, replyNoPremission } from '../../helpers/command-helper.js';
import fs from 'fs';
import { getXpForNextLevel } from '../../helpers/score-helper.js';

export const data = new SlashCommandBuilder()
    .setName('score')
    .setDescription('Get a user\'s current score')
    .addStringOption(option =>
        option.setName('identifier')
            .setDescription('Name or DiscordId of the user (optional)')
            .setRequired(false));

export async function execute(interaction) {
    const filePath = getUserJsonPath();
    const identifier = interaction.options.getString('identifier');
    const requesterId = interaction.user.id;

    if (!isUser(interaction.user.id)) {
        return await replyNoPremission(interaction);
    }

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const json = JSON.parse(data);

        const user = json.users.find(user =>
            !identifier
                ? user.id === requesterId
                : user.id === identifier || user.firstName?.toLowerCase() === identifier.toLowerCase()
        );

        if (!user) {
            return await interaction.reply({ content: 'User not found.', flags: 64 });
        }

        // Initialize missing properties
        const score = user.score ?? 0;
        const xp = user.xp ?? 0;
        const level = user.level ?? 1;
        const xpNeeded = await getXpForNextLevel(level);

        const displayName = user.firstName ?? user.id;
        const progress = `Level ${level}\nXP: ${xp} / ${xpNeeded}\nScore: ${score}`;

        await interaction.reply({ content: `📊 Stats for **${displayName}**\n${progress}` });

    } catch (error) {
        console.error('Error reading user data:', error);
        return await replyFileError(interaction);
    }
}