import { CommandInteraction } from "discord.js";

export async function replyNoPremission(interaction: CommandInteraction) {
    await interaction.reply({ content: "You don't have premission to use this command :(", flags: 64 });
}