
export async function replyNoPremission(interaction) {
    await interaction.reply({ content: "You don't have premission to use this command :(", ephemeral: true });
}