
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

async function countEmojis() {
  try {
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildEmojisAndStickers] });
    await client.login(process.env.DISCORD_TOKEN);
    const guild = await client.guilds.fetch('1438114753263177750');
    const emojis = await guild.emojis.fetch();
    console.log(`TOTAL_EMOJIS:${emojis.size}`);
    client.destroy();
  } catch (err) {
    console.error("ERROR_MSG:" + err.message);
    process.exit(1);
  }
}

countEmojis();
