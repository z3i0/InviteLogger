import { Trophy, Medal, Crown } from "lucide-react";
import type { LeaderboardEntry } from "@shared/schema";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
}

export function Leaderboard({ entries, isLoading }: LeaderboardProps) {
  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center glass-panel rounded-2xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Sort just in case API didn't, although API should
  const sortedEntries = [...entries].sort((a, b) => b.count - a.count);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full bg-gradient-to-b from-card to-card/95">
      <div className="p-6 border-b border-white/5 bg-gradient-to-r from-yellow-500/10 to-transparent">
        <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-500">
          <Trophy className="w-5 h-5 fill-yellow-500/20" />
          Top Inviters
        </h2>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar max-h-[600px]">
        {sortedEntries.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">No invites yet.</div>
        ) : (
          sortedEntries.map((entry, index) => (
            <LeaderboardItem 
              key={entry.inviterId || index} 
              entry={entry} 
              rank={index + 1} 
            />
          ))
        )}
      </div>
    </div>
  );
}

function LeaderboardItem({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const isTop3 = rank <= 3;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={cn(
        "relative p-4 rounded-xl flex items-center justify-between group transition-all duration-300 border border-transparent",
        rank === 1 ? "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-yellow-500/30" : 
        rank === 2 ? "bg-gradient-to-r from-gray-400/20 to-gray-400/5 border-gray-400/30" :
        rank === 3 ? "bg-gradient-to-r from-amber-700/20 to-amber-700/5 border-amber-700/30" :
        "bg-black/20 hover:bg-black/40 border-white/5"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-8 h-8 flex items-center justify-center font-bold rounded-lg text-sm",
          rank === 1 ? "text-yellow-500 bg-yellow-500/10" :
          rank === 2 ? "text-gray-300 bg-gray-400/10" :
          rank === 3 ? "text-amber-600 bg-amber-700/10" :
          "text-muted-foreground bg-white/5"
        )}>
          {rank === 1 ? <Crown className="w-5 h-5 fill-current" /> : 
           rank <= 3 ? <Medal className="w-5 h-5 fill-current" /> : 
           `#${rank}`}
        </div>
        
        <div>
          <h3 className={cn(
            "font-semibold truncate max-w-[150px]",
            isTop3 ? "text-white" : "text-gray-300"
          )}>
            {entry.inviterUsername || "Unknown"}
          </h3>
          <p className="text-xs text-muted-foreground opacity-60 font-mono">
            {entry.inviterId}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <span className={cn(
          "text-xl font-bold font-mono",
          rank === 1 ? "text-yellow-500" :
          rank === 2 ? "text-gray-300" :
          rank === 3 ? "text-amber-600" :
          "text-primary"
        )}>
          {entry.count}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Invites</span>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
    </motion.div>
  );
}
