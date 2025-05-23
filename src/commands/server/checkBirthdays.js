import { SlashCommandBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import usersJSON from "../../json/users.json" assert { type: 'json'}
import { getBirthdayStatus, getBirthdays, writeBirthdayMessage } from '../../helpers/birthday-helper.js'
import { setActivity } from '../../helpers/activity-helper.js'

export const data = new SlashCommandBuilder()
	.setName('checkbirthdays')
	.setDescription('Checks user birthdays');

export async function execute(interaction) {
	if (isUser(interaction.user.id)) {
        console.log('here')
        const userBirthday = getBirthdays(usersJSON.users)
        console.log(userBirthday)
    
        userBirthday ? setActivity(interaction.client, getBirthdayStatus(userBirthday)) : setActivity(interaction.client)
    
        if (userBirthday) {
            writeBirthdayMessage(process.env.OPENAI_API_KEY, interaction.client, userBirthday)
            await interaction.reply({ content: 'User birthday message sent', flags: 64 });
        } else {
            await interaction.reply({ content: 'No users have a birthday today', flags: 64 });
        }
	} else {
		await replyNoPremission(interaction);
	}
}