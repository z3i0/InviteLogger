# InviteTracker - Discord Invite Tracking Dashboard

## Overview

InviteTracker is a Discord bot with a web dashboard that tracks server invites, logs member joins, and maintains a leaderboard of top inviters. The application consists of three main parts: a Discord bot that monitors invite usage and member joins, an Express backend API that stores and serves data, and a React frontend dashboard that displays real-time statistics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state with polling for real-time updates
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared/ for shared code)

### Backend Architecture
- **Server**: Express.js running on Node.js with TypeScript
- **API Pattern**: RESTful endpoints defined in shared/routes.ts with Zod validation
- **Discord Integration**: discord.js v14 bot running alongside the web server
- **Development**: tsx for TypeScript execution, Vite dev server with HMR

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: shared/schema.ts (shared between frontend and backend)
- **Tables**:
  - `join_logs`: Tracks member joins with inviter information
  - `guild_config`: Stores per-guild settings (welcome channel, language, auto-role)
- **Migrations**: Drizzle Kit with `db:push` command

### Code Organization
- **client/**: React frontend application
- **server/**: Express backend and Discord bot
- **shared/**: Shared types, schemas, and API route definitions
- **script/**: Build scripts using esbuild for production bundling

### Key Design Patterns
- Shared Zod schemas for type safety across frontend and backend
- API routes defined once in shared/routes.ts and used for both validation and typing
- Polling-based real-time updates (5-10 second intervals) rather than WebSockets
- Demo data seeding when database is empty for development purposes

## External Dependencies

### Discord Integration
- **discord.js v14**: Bot framework for tracking invites and member events
- **Required Environment Variable**: `DISCORD_TOKEN` for bot authentication
- **Features**: Slash commands for guild configuration, invite tracking, welcome messages

### Database
- **PostgreSQL**: Primary data store
- **Required Environment Variable**: `DATABASE_URL` for connection
- **ORM**: Drizzle with drizzle-zod for schema validation
- **Session Store**: connect-pg-simple for potential session management

### Third-Party UI Libraries
- **Radix UI**: Headless component primitives (dialogs, dropdowns, etc.)
- **shadcn/ui**: Pre-styled component collection
- **Lucide React**: Icon library
- **date-fns**: Date formatting utilities