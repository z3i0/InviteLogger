import { formatDistanceToNow } from "date-fns";
import { User, Hash, Clock, ArrowRight } from "lucide-react";
import type { JoinLog } from "@shared/schema";
import { motion } from "framer-motion";

interface RecentJoinsTableProps {
  logs: JoinLog[];
  isLoading: boolean;
}

export function RecentJoinsTable({ logs, isLoading }: RecentJoinsTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center glass-panel rounded-2xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center glass-panel rounded-2xl text-muted-foreground">
        <User className="w-12 h-12 mb-4 opacity-20" />
        <p>No join logs found yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Recent Activity
        </h2>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="bg-black/20 text-xs uppercase text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Invited By</th>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log, index) => (
              <motion.tr 
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg border border-white/20">
                      {log.discordAvatarUrl ? (
                        <img src={log.discordAvatarUrl} alt={log.discordUsername} className="w-full h-full object-cover" />
                      ) : (
                        log.discordUsername.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {log.discordUsername}
                      </span>
                      <p className="text-xs text-muted-foreground font-mono opacity-50">ID: {log.discordUserId}</p>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  {log.inviterUsername ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-foreground">{log.inviterUsername}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm italic">Unknown / Vanity</span>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono bg-black/30 px-2 py-1 rounded w-fit text-primary/80 border border-primary/20">
                    <Hash className="w-3 h-3" />
                    {log.inviteCode || "---"}
                  </div>
                </td>
                
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {log.joinedAt ? formatDistanceToNow(new Date(log.joinedAt), { addSuffix: true }) : 'Just now'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
