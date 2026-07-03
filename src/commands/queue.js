const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show queue"),

  async execute(interaction, client) {
    const player = client.manager.getPlayer(interaction.guild.id);

    if (!player || !player.queue.length)
      return interaction.reply("📭 Queue kosong");

    const list = player.queue
      .slice(0, 10)
      .map((t, i) => `${i + 1}. ${t.title}`)
      .join("\n");

    return interaction.reply("📜 Queue:\n" + list);
  }
};
