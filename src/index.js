require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Kazagumo, Plugins } = require("kazagumo");
const { Connectors } = require("shoukaku");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// 🎧 Music Manager (PRODUCTION CORE)
client.manager = new Kazagumo(
  {
    defaultSearchEngine: "youtube",
    plugins: [
      new Plugins.PlayerMoved(client)
    ]
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

// 📦 Load Commands
const commandFiles = fs.readdirSync("./src/commands");
for (const file of commandFiles) {
  const cmd = require(`./src/commands/${file}`);
  client.commands.set(cmd.name, cmd);
}

// 🎯 Ready
client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ⚡ Slash handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction, client);
  } catch (err) {
    console.log("❌ Error:", err);
    return interaction.reply("❌ Terjadi error saat menjalankan command");
  }
});

// 🔌 Auto reconnect Lavalink
client.manager.shoukaku.on("ready", (name) => {
  console.log(`🎧 Lavalink node ready: ${name}`);
});

client.manager.shoukaku.on("error", (name, error) => {
  console.log(`⚠️ Lavalink error on ${name}`, error);
});

client.login(process.env.TOKEN);
