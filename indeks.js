require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Kazagumo, Plugins } = require("kazagumo");
const { Connectors } = require("shoukaku");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Collection();

// 🎧 MUSIC ENGINE
client.manager = new Kazagumo(
  {
    defaultSearchEngine: "youtube",
    plugins: [new Plugins.PlayerMoved(client)]
  },
  new Connectors.DiscordJS(client),
  [
    {
      name: "main",
      url: `${process.env.LAVALINK_HOST}:${process.env.LAVALINK_PORT}`,
      auth: process.env.LAVALINK_PASSWORD
    }
  ]
);

// 📦 LOAD COMMANDS
const commandFiles = fs.readdirSync("./src/commands");

for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

// 🎯 READY
client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ⚡ SLASH COMMAND HANDLER
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction, client);
  } catch (err) {
    console.log(err);
    interaction.reply("❌ Error command");
  }
});

// 🎮 BUTTON HANDLER
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const player = client.manager.getPlayer(interaction.guild.id);
  if (!player) return;

  if (interaction.customId === "pause") {
    player.pause(!player.paused);
    return interaction.reply({ content: "⏸ Paused/Resume", ephemeral: true });
  }

  if (interaction.customId === "skip") {
    player.skip();
    return interaction.reply({ content: "⏭ Skipped", ephemeral: true });
  }

  if (interaction.customId === "stop") {
    player.destroy();
    return interaction.reply({ content: "⛔ Stopped", ephemeral: true });
  }
});

client.login(process.env.TOKEN);
