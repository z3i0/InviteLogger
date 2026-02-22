import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { initBot, sendPanel, discordClient } from "./bot";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/bot/send-panel", async (req, res) => {
    try {
      await sendPanel(req.body);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/bot/emojis/:guildId", async (req, res) => {
    try {
      if (!discordClient) return res.status(500).json({ error: "Bot not initialized" });
      
      const allEmojis: any[] = [];
      const guilds = Array.from(discordClient.guilds.cache.values());
      console.log(`Bypassing guildId, checking all ${guilds.length} guilds`);
      
      for (const guild of guilds) {
        try {
          const fetchedEmojis = await guild.emojis.fetch();
          console.log(`Guild: ${guild.name} (${guild.id}) - Emojis: ${fetchedEmojis.size}`);
          fetchedEmojis.forEach((e: any) => {
            allEmojis.push({
              id: e.id,
              name: e.name,
              animated: e.animated,
              url: e.url,
              string: `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`,
              guildName: guild.name
            });
          });
        } catch (err) {
          console.error(`Failed to fetch emojis for guild ${guild.id}:`, err);
        }
      }
      
      res.json(allEmojis);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get(api.logs.list.path, async (req, res) => {
    const logs = await storage.getLogs();
    res.json(logs);
  });

  app.get(api.leaderboard.get.path, async (req, res) => {
    const leaderboard = await storage.getLeaderboard();
    res.json(leaderboard);
  });
 
  app.get(api.config.get.path, async (req, res) => {
    const guildId = req.params.guildId as string;
    const config = await storage.getGuildConfig(guildId);
    if (!config) {
      // Return a default config if not found
      return res.json({
        guildId,
        welcomeTitle: "Welcome to the Server",
        welcomeDescription: "Welcome! We hope you have a great time here.",
        welcomeColor: "#5865F2",
        welcomeThumbnail: "true"
      });
    }
    res.json(config);
  });
 
  app.post(api.config.update.path, async (req, res) => {
    const config = await storage.setGuildConfig(req.body);
    res.json(config);
  });

  // Start the Discord bot
  // We don't await this because it runs in the background
  if (process.env.DISCORD_TOKEN) {
    console.log("Starting Discord bot...");
    initBot().catch(err => console.error("Failed to start bot:", err));
  } else {
    console.log("Skipping bot start: DISCORD_TOKEN not found");
  }

  // Seed with fake data if empty (for demo purposes)
  const existingLogs = await storage.getLogs();
  if (existingLogs.length === 0) {
    console.log("Seeding database with demo data...");
    await storage.logJoin({
      discordUserId: "123456789",
      discordUsername: "DemoUser1",
      inviterId: "987654321",
      inviterUsername: "TopInviter",
      inviteCode: "DEMO123"
    });
    await storage.logJoin({
      discordUserId: "111222333",
      discordUsername: "Newbie",
      inviterId: "987654321",
      inviterUsername: "TopInviter",
      inviteCode: "DEMO123"
    });
    await storage.logJoin({
      discordUserId: "444555666",
      discordUsername: "Guest",
      inviterId: "555666777",
      inviterUsername: "Helper",
      inviteCode: "COOLINV"
    });
  }

  return httpServer;
}
