import { Users, UserPlus, Zap } from "lucide-react";
import { useJoinLogs, useLeaderboard } from "@/hooks/use-logs";
import { RecentJoinsTable } from "@/components/RecentJoinsTable";
import { Leaderboard } from "@/components/Leaderboard";
import { StatsCard } from "@/components/StatsCard";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeSettings } from "@/components/WelcomeSettings";
import { PanelSender } from "@/components/PanelSender";

export default function Dashboard() {
  const { data: logs = [], isLoading: logsLoading } = useJoinLogs();
  const { data: leaderboard = [], isLoading: leaderboardLoading } = useLeaderboard();

  // Calculate simple stats
  const totalJoins = logs.length;
  const uniqueInviters = leaderboard.length;
  const topInviter = leaderboard[0]?.inviterUsername || "None";
  const topCount = leaderboard[0]?.count || 0;

  return (
    <div className="min-h-screen bg-[#313338] text-gray-100 font-sans selection:bg-primary selection:text-white pb-20">
      {/* Navbar Area */}
      <nav className="border-b border-black/20 bg-[#2b2d31]/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-glow text-white">
              Invite<span className="text-primary">Tracker</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              System Online
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
            <p className="text-gray-400 max-w-2xl">
              Real-time tracking of server invites, user joins, and inviter statistics.
            </p>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-[#2b2d31] border border-black/10 p-1 rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-6">Overview</TabsTrigger>
            <TabsTrigger value="panel" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-6">Role Panel</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-6">Welcome Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <StatsCard 
                  title="Total Joins" 
                  value={totalJoins} 
                  icon={<Users className="w-6 h-6" />}
                  className="border-l-4 border-l-blue-500"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <StatsCard 
                  title="Active Inviters" 
                  value={uniqueInviters} 
                  icon={<UserPlus className="w-6 h-6" />}
                  className="border-l-4 border-l-purple-500"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <StatsCard 
                  title="Top Inviter" 
                  value={topInviter}
                  trend={`With ${topCount} invites`}
                  trendUp={true}
                  icon={<Zap className="w-6 h-6" />}
                  className="border-l-4 border-l-yellow-500"
                />
              </motion.div>
            </div>

            {/* Main Data Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              {/* Left Column: Recent Activity Table (Takes up 2/3 space on large screens) */}
              <motion.div 
                className="lg:col-span-2 h-full min-h-[500px]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <RecentJoinsTable logs={logs} isLoading={logsLoading} />
              </motion.div>

              {/* Right Column: Leaderboard (Takes up 1/3 space) */}
              <motion.div 
                className="lg:col-span-1 h-full min-h-[500px]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Leaderboard entries={leaderboard} isLoading={leaderboardLoading} />
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <WelcomeSettings guildId="1438114753263177750" /> {/* Correct Guild ID from DB */}
          </TabsContent>

          <TabsContent value="panel">
            <PanelSender guildId="1438114753263177750" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
