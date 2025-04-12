import { getUserJsonPath } from '../helpers/user-helper.js';
import fs from 'fs';

export async function getXpForNextLevel(level) {
    return 5 * level * level + 50 * level + 100;
}

export async function updateUserScore(message) {
    const filePath = getUserJsonPath();
    const userId = message.author.id;
    const messageLength = message.content.length;

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const json = JSON.parse(data);

        // Find the user or create a new one
        let user = json.users.find(u => u.id === userId);
        if (!user) {
            user = { id: userId };
            json.users.push(user);
        }

        // Initialize missing properties
        user.score ??= 0;
        user.xp ??= 0;
        user.level ??= 1;

        // Score system (optional)
        const scoreBonus = 1 + Math.floor(messageLength / 50);
        user.score += scoreBonus;

        // XP system
        user.xp += scoreBonus;

        // Level up logic
        const xpNeeded = await getXpForNextLevel(user.level);
        while (user.xp >= xpNeeded) {
            user.xp -= xpNeeded;
            user.level += 1;

            const levelUpChannelId = '709945199521955871';
            const levelUpChannel = await message.client.channels.fetch(levelUpChannelId).catch(() => null);
            
            if (levelUpChannel && levelUpChannel.isTextBased()) {
                const msg = `HOLY COW, YOUR PENIS IS GIGANTIC. GIGANTIC.\n` +
                            `IT'S LITERALLY THE GAYEST THING IN THE AREA.\n` +
                            `IT'S LEVEL ${user.level}, LOTS OF BRANCHES ON <@${user.id}>'s PENIS\n` +
                            `YOUR TRULY BLESSED\nCONGRATS 🎉`;
            
                levelUpChannel.send(msg);
            }
        }

        await fs.promises.writeFile(filePath, JSON.stringify(json, null, 4), 'utf8');

    } catch (error) {
        console.error('Error updating user XP/score:', error);
    }
}