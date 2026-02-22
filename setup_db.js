import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

async function setup() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not defined");
        return;
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    try {
        console.log("Updating tables and adding missing columns...");

        // Check if table exists, create if not
        await pool.query(`
      CREATE TABLE IF NOT EXISTS join_logs (
        id serial PRIMARY KEY,
        discord_user_id text NOT NULL,
        discord_username text NOT NULL,
        inviter_id text,
        inviter_username text,
        invite_code text,
        joined_at timestamp DEFAULT now()
      )
    `);

        // Add discord_avatar_url if it doesn't exist
        try {
            await pool.query(`ALTER TABLE join_logs ADD COLUMN discord_avatar_url text;`);
            console.log("Added column 'discord_avatar_url' to 'join_logs'.");
        } catch (e) {
            // Column might already exist
        }

        await pool.query(`
      CREATE TABLE IF NOT EXISTS guild_config (
        id serial PRIMARY KEY,
        guild_id text NOT NULL UNIQUE,
        welcome_channel_id text,
        language text DEFAULT 'ar',
        auto_role_id text
      )
    `);

        console.log("Database schema is up to date.");

    } catch (err) {
        console.error("Error setting up database:", err);
    } finally {
        await pool.end();
    }
}

setup();
