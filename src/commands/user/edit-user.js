import { SlashCommandBuilder } from 'discord.js';
import { getUserJsonPath, isAdminUser } from '../../helpers/user-helper.js';
import { replyFileError, replyNoPremission } from '../../helpers/command-helper.js';
import fs from "fs";

export const data = new SlashCommandBuilder()
    .setName('useredit')
    .setDescription('Edit an existing user')
    .addStringOption(option => 
        option.setName('discordid')
            .setDescription('Discord ID of user')
            .setRequired(true))
    .addStringOption(option => 
        option.setName('name')
            .setDescription("User's new name"))
    .addStringOption(option => 
        option.setName('nickname')
            .setDescription('What Conway will call the user'))
    .addStringOption(option => 
        option.setName('birthday')
            .setDescription('dd/MM'))
    .addBooleanOption(option => 
        option.setName('admin')
            .setDescription('Is this user an Admin'))

export async function execute(interaction) {
    const filePath = getUserJsonPath();
    
    if (!isAdminUser(interaction.user.id)) {
        return await replyNoPremission(interaction);
    }

    const userId = interaction.options.getString('discordid');
    const name = interaction.options.getString('name');
    const nickname = interaction.options.getString('nickname');
    const birthday = interaction.options.getString('birthday');
    const admin = interaction.options.getBoolean('admin');

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const json = JSON.parse(data);

        const userIndex = json.users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return await interaction.reply({ content: 'User not found.', flags: 64 });
        }

        const user = json.users[userIndex];

        if (name !== null) user.firstName = name;
        if (nickname !== null) user.nickname = nickname;
        if (birthday !== null) user.birthday = birthday;
        if (admin !== null) user.admin = admin;

        json.users[userIndex] = user;

        await fs.promises.writeFile(filePath, JSON.stringify(json, null, 4), 'utf8');
        await interaction.reply({ content: `Updated user ${user.firstName}`, flags: 64 });

    } catch (error) {
        console.error('Error updating user:', error);
        return await replyFileError(interaction);
    }
}