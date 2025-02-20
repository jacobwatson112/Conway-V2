import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper';
import { replyNoPremission } from '../../helpers/command-helper';
import usersJSON from "../../json/users.json"
import { getBirthdayStatus, getBirthdays, writeBirthdayMessage } from '../../helpers/birthday-helper'
import { setActivity } from '../../helpers/activity-helper'

export const data = new SlashCommandBuilder()
	.setName('checkbirthdays')
	.setDescription('Checks user birthdays');

export async function execute(interaction: CommandInteraction) {
	if (isUser(interaction.user.id)) {
        const client = interaction.client
        const userBirthday = getBirthdays(usersJSON.users)
        console.log(userBirthday)
    
        userBirthday ? setActivity(client, getBirthdayStatus(userBirthday)) : setActivity(client)
    
        if (userBirthday) {
            writeBirthdayMessage(client, userBirthday, [])
            await interaction.reply({ content: 'User birthday message sent', ephemeral: true });
        } else {
            await interaction.reply({ content: 'No users have a birthday today', ephemeral: true });
        }
	} else {
		await replyNoPremission(interaction);
	}
}