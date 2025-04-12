import { SlashCommandBuilder } from 'discord.js';
import { getUserJsonPath, isAdminUser } from '../../helpers/user-helper.js';
import { replyFileError, replyNoPremission, replyUserExistsError } from '../../helpers/command-helper.js';
import fs from 'fs';

export const data = new SlashCommandBuilder()
    .setName('useradd')
    .setDescription('Add a new user')
    .addStringOption(option =>
        option.setName('discordid')
            .setDescription('Discord ID of user')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('name')
            .setDescription("User's name")
            .setRequired(true))
    .addStringOption(option =>
        option.setName('nickname')
            .setDescription('What Conway will call the user (Default: name)'))
    .addStringOption(option =>
        option.setName('birthday')
            .setDescription('Birthday in dd/MM format'))
    .addBooleanOption(option =>
        option.setName('admin')
            .setDescription('Is this user an Admin (Default: false)'));

export async function execute(interaction) {
    if (!isAdminUser(interaction.user.id)) {
        return await replyNoPremission(interaction);
    }

    const filePath = getUserJsonPath();
    const userId = interaction.options.getString('discordid');
    const userName = interaction.options.getString('name');
    const nickname = interaction.options.getString('nickname') || userName;
    const birthday = interaction.options.getString('birthday') || null;
    const admin = interaction.options.getBoolean('admin') ?? false;

    const newUser = {
        id: userId,
        firstName: userName,
        nickname,
        birthday,
        admin,
        systemMessage: '',
        score: 0
    };

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const json = JSON.parse(data);

        const userExists = json.users.some(user => user.id === userId);
        if (userExists) {
            return await replyUserExistsError(interaction)
        }

        json.users.push(newUser);
        await fs.promises.writeFile(filePath, JSON.stringify(json, null, 4), 'utf8');

        await interaction.reply({ content: `Added user: ${userName}`, flags: 64 });
    } catch (error) {
        return await replyFileError(interaction);
    }
}
