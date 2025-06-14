import { SlashCommandBuilder } from 'discord.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { isUser} from '../../helpers/user-helper.js';
import { resetMessageHistory } from '../../helpers/history-helper.js';

export const data = new SlashCommandBuilder()
    .setName('forget')
    .setDescription('Forget all message history')

export async function execute(interaction) {
    if (isUser(interaction.user.id)) {
        resetMessageHistory()

        console.log("===== MANUALLY RESET MESSAGE HISTORY =====")
        await interaction.reply({ content: 'Message History Reset', flags: 64 });
    } else {
        await replyNoPremission(interaction);
    }
}