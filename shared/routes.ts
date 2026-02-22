import { z } from 'zod';
import { joinLogs } from './schema';

export const api = {
  logs: {
    list: {
      method: 'GET' as const,
      path: '/api/logs',
      responses: {
        200: z.array(z.custom<typeof joinLogs.$inferSelect>()),
      },
    },
  },
  leaderboard: {
    get: {
      method: 'GET' as const,
      path: '/api/leaderboard',
      responses: {
        200: z.array(z.object({
          inviterId: z.string().nullable(),
          inviterUsername: z.string().nullable(),
          count: z.number()
        })),
      },
    },
  },
  config: {
    get: {
      method: 'GET' as const,
      path: '/api/config/:guildId',
    },
    update: {
      method: 'POST' as const,
      path: '/api/config',
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
