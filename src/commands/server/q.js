import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { isUser } from '../../helpers/user-helper.js';
import { replyNoPremission } from '../../helpers/command-helper.js';
import path from "path";
import { fileURLToPath } from 'url';

export const data = new SlashCommandBuilder()
	.setName('q')
	.setDescription('See the queue');

export async function execute(interaction) {
	if (isUser(interaction.user.id)) {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const qError = path.join(__dirname, '../../images/error', 'q_error.png');
		await interaction.reply({ files: [new AttachmentBuilder(qError)], content: `Soz` });
	} else {
		await replyNoPremission(interaction);
	}
}