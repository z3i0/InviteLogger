import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useConfig(guildId: string) {
  return useQuery({
    queryKey: [api.config.get.path, guildId],
    queryFn: async () => {
      const url = buildUrl(api.config.get.path, { guildId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch configuration");
      return await res.json();
    },
    enabled: !!guildId,
  });
}

export function useUpdateConfig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (config: any) => {
      const res = await fetch(api.config.update.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to update configuration");
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.config.get.path, data.guildId] });
      toast({
        title: "Success",
        description: "Configuration updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
