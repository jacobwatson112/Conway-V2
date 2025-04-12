import { SlashCommandBuilder } from 'discord.js';
import { getUserJsonPath, isUser } from '../../helpers/user-helper.js';
import { replyFileError, replyNoPremission } from '../../helpers/command-helper.js';
import fs from 'fs';
import { getXpForNextLevel } from '../../helpers/score-helper.js';

export const data = new SlashCommandBuilder()
    .setName('topscore')
    .setDescription('View the top 5 users by score');

export async function execute(interaction) {
    const filePath = getUserJsonPath();

    if (!isUser(interaction.user.id)) {
        return await replyNoPremission(interaction);
    }

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const json = JSON.parse(data);

        const sortedUsers = json.users
            .filter(user => typeof user.level === 'number' && typeof user.xp === 'number')
            .sort((a, b) => {
                if (b.level === a.level) return b.xp - a.xp;
                return b.level - a.level;
            })
            .slice(0, 5);

        if (sortedUsers.length === 0) {
            return await interaction.reply({ content: 'No user XP/level data found.', flags: 64 });
        }

        const leaderboardLines = await Promise.all(
            sortedUsers.map(async (user, index) => {
                const displayName = user.firstName ?? user.id;
                const level = user.level ?? 1;
                const xp = user.xp ?? 0;
                const xpNeeded = await getXpForNextLevel(level); // async call
                const score = user.score ?? 0;

                return `${index + 1}. **${displayName}** - Level ${level} (${xp}/${xpNeeded} XP) | Score: ${score}`;
            })
        );

        const leaderboard = leaderboardLines.join('\n');

        await interaction.reply({ content: `🏆 **Top 5 Users by Level** 🏆\n${leaderboard}` });

    } catch (error) {
        console.error('Error retrieving top level leaderboard:', error);
        return await replyFileError(interaction);
    }
}
