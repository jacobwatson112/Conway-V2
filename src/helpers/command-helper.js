import { AttachmentBuilder } from "discord.js";
import path from "path";
import { fileURLToPath } from 'url';

export async function replyNoPremission(interaction) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const premissionError = path.join(__dirname, '../../images/error', 'premission_error.png');
    await interaction.reply({ files: [new AttachmentBuilder(premissionError)], content: `You don't have premission to use this command :(`, flags: 64 });
}

export async function replyFileError(interaction) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const premissionError = path.join(__dirname, '../images/error', 'file_error.png');
    await interaction.reply({ files: [new AttachmentBuilder(premissionError)], content: `The file isnt right :(`, flags: 64 });
}

export async function replyUserExistsError(interaction) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const premissionError = path.join(__dirname, '../images/error', 'user_exists_error.png');
    await interaction.reply({ files: [new AttachmentBuilder(premissionError)], content: `i already have them?!?!`, flags: 64 });
}