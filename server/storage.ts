import { db } from "./db";
import { joinLogs, guildConfig, type InsertJoinLog, type JoinLog, type LeaderboardEntry, type GuildConfig, type InsertGuildConfig } from "@shared/schema";
import { desc, sql, eq } from "drizzle-orm";

export interface IStorage {
  logJoin(log: InsertJoinLog): Promise<JoinLog>;
  getLogs(): Promise<JoinLog[]>;
  getLeaderboard(): Promise<LeaderboardEntry[]>;
  getGuildConfig(guildId: string): Promise<GuildConfig | undefined>;
  setGuildConfig(config: InsertGuildConfig): Promise<GuildConfig>;
  getInvitesByInviter(inviterId: string): Promise<JoinLog[]>;
}

export class DatabaseStorage implements IStorage {
  async logJoin(log: InsertJoinLog): Promise<JoinLog> {
    const [newLog] = await db.insert(joinLogs).values(log).returning();
    return newLog;
  }

  async getLogs(): Promise<JoinLog[]> {
    return await db.select().from(joinLogs).orderBy(desc(joinLogs.joinedAt)).limit(50);
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const results = await db
      .select({
        inviterId: joinLogs.inviterId,
        inviterUsername: joinLogs.inviterUsername,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(joinLogs)
      .where(sql`${joinLogs.inviterId} IS NOT NULL`)
      .groupBy(joinLogs.inviterId, joinLogs.inviterUsername)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    return results as LeaderboardEntry[];
  }

  async getGuildConfig(guildId: string): Promise<GuildConfig | undefined> {
    const [config] = await db.select().from(guildConfig).where(eq(guildConfig.guildId, guildId));
    return config;
  }

  async setGuildConfig(config: InsertGuildConfig): Promise<GuildConfig> {
    const [existing] = await db.select().from(guildConfig).where(eq(guildConfig.guildId, config.guildId));
    if (existing) {
      const [updated] = await db.update(guildConfig)
        .set(config)
        .where(eq(guildConfig.guildId, config.guildId))
        .returning();
      return updated;
    }
    const [inserted] = await db.insert(guildConfig).values(config).returning();
    return inserted;
  }

  async getInvitesByInviter(inviterId: string): Promise<JoinLog[]> {
    return await db
      .select()
      .from(joinLogs)
      .where(eq(joinLogs.inviterId, inviterId))
      .orderBy(desc(joinLogs.joinedAt));
  }
}

export const storage = new DatabaseStorage();
