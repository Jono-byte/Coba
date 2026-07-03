const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause music"),

  async execute(interaction, client) {
    const player = client.manager.getPlayer(interaction.guild.id);
    if (!player) return interaction.reply("❌ No music");

    player.pause(true);
    interaction.reply("⏸ Paused");
  }
};
