import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const joinLogs = pgTable("join_logs", {
  id: serial("id").primaryKey(),
  discordUserId: text("discord_user_id").notNull(),
  discordUsername: text("discord_username").notNull(),
  discordAvatarUrl: text("discord_avatar_url"),
  inviterId: text("inviter_id"),
  inviterUsername: text("inviter_username"),
  inviteCode: text("invite_code"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const guildConfig = pgTable("guild_config", {
  id: serial("id").primaryKey(),
  guildId: text("guild_id").notNull().unique(),
  welcomeChannelId: text("welcome_channel_id"),
  language: text("language").default("en"),
  autoRoleId: text("auto_role_id"),
  welcomeTitle: text("welcome_title").default("Welcome to the Server"),
  welcomeDescription: text("welcome_description").default("Welcome! We hope you have a great time here."),
  welcomeColor: text("welcome_color").default("#5865F2"),
  welcomeThumbnail: text("welcome_thumbnail").default("true"), // "true" or "false"
});

export const insertJoinLogSchema = createInsertSchema(joinLogs).omit({ 
  id: true, 
  joinedAt: true 
});

export const insertGuildConfigSchema = createInsertSchema(guildConfig).omit({
  id: true
});

export type JoinLog = typeof joinLogs.$inferSelect;
export type InsertJoinLog = z.infer<typeof insertJoinLogSchema>;
export type GuildConfig = typeof guildConfig.$inferSelect;
export type InsertGuildConfig = z.infer<typeof insertGuildConfigSchema>;

// API Types
export type LeaderboardEntry = {
  inviterId: string | null;
  inviterUsername: string | null;
  count: number;
};
