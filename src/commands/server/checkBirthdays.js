import { SlashCommandBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import usersJSON from "../../json/users.json" assert { type: 'json'}
import { getBirthdayStatus, getBirthdays, writeBirthdayMessage } from '../../helpers/birthday-helper.js'
import { setActivity } from '../../helpers/activity-helper.js'

export const data = new SlashCommandBuilder()
	.setName('checkbirthdays')
	.setDescription('Checks user birthdays');

export async function execute(interaction, client) {
	if (isUser(interaction.user.id)) {
        console.log('here')
        const userBirthday = getBirthdays(usersJSON.users)
        console.log(userBirthday)
    
        userBirthday ? setActivity(client, getBirthdayStatus(userBirthday)) : setActivity(client)
    
        if (userBirthday) {
            writeBirthdayMessage(process.env.OPENAI_API_KEY, client, userBirthday)
            await interaction.reply({ content: 'User birthday message sent', ephemeral: true });
        } else {
            await interaction.reply({ content: 'No users have a birthday today', ephemeral: true });
        }
	} else {
		await replyNoPremission(interaction);
	}
}