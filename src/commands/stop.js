const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop music"),

  async execute(interaction, client) {
    const player = client.manager.getPlayer(interaction.guild.id);

    if (!player) return interaction.reply("❌ No music");

    player.destroy();
    interaction.reply("⛔ Stopped");
  }
};
