const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music")
    .addStringOption(opt =>
      opt.setName("query")
        .setDescription("Song name or URL")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const query = interaction.options.getString("query");
    const voice = interaction.member.voice.channel;

    if (!voice)
      return interaction.reply("❌ Join voice channel dulu");

    const player = client.manager.createPlayer({
      guildId: interaction.guild.id,
      voiceId: voice.id,
      textId: interaction.channel.id,
      deaf: true
    });

    await player.connect();

    const result = await client.manager.search(query, {
      requester: interaction.user
    });

    if (!result.tracks.length)
      return interaction.reply("❌ Lagu tidak ditemukan");

    const track = result.tracks[0];

    player.queue.add(track);

    if (!player.playing) player.play();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("pause")
        .setLabel("⏸ Pause")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("⏭ Skip")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("stop")
        .setLabel("⛔ Stop")
        .setStyle(ButtonStyle.Danger)
    );

    return interaction.reply({
      content: `🎵 Now playing: **${track.title}**`,
      components: [row]
    });
  }
};
