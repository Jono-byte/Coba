const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip music"),

  async execute(interaction, client) {
    const player = client.manager.getPlayer(interaction.guild.id);

    if (!player) return interaction.reply("❌ No music");

    player.skip();
    interaction.reply("⏭ Skipped");
  }
};
