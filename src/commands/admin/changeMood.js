import { SlashCommandBuilder } from 'discord.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import { isUser} from '../../helpers/user-helper.js';
import { getMood, setMood } from '../../helpers/mood-helper.js';

export const data = new SlashCommandBuilder()
    .setName('changemood')
    .setDescription('Puts conway in a different mood')

export async function execute(interaction) {
    if (isUser(interaction.user.id)) {
        setMood()

        await interaction.reply({ content: 'Mood changed too: ' + getMood(), flags: 64 });
    } else {
        await replyNoPremission(interaction);
    }
}