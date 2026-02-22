import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useJoinLogs() {
  return useQuery({
    queryKey: [api.logs.list.path],
    queryFn: async () => {
      const res = await fetch(api.logs.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch join logs");
      return api.logs.list.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Poll every 5 seconds for real-time feel
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: [api.leaderboard.get.path],
    queryFn: async () => {
      const res = await fetch(api.leaderboard.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return api.leaderboard.get.responses[200].parse(await res.json());
    },
    refetchInterval: 10000, // Poll every 10 seconds
  });
}
