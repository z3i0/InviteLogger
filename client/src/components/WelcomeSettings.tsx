import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useConfig, useUpdateConfig } from "@/hooks/use-config";
import { motion } from "framer-motion";
import { Save, Layout, Palette, Type, Image as ImageIcon } from "lucide-react";

interface WelcomeSettingsProps {
  guildId: string;
}

export function WelcomeSettings({ guildId }: WelcomeSettingsProps) {
  const { data: config, isLoading } = useConfig(guildId);
  const updateConfig = useUpdateConfig();

  const [formData, setFormData] = useState({
    welcomeTitle: "",
    welcomeDescription: "",
    welcomeColor: "#5865F2",
    welcomeThumbnail: "true",
  });

  useEffect(() => {
    if (config) {
      setFormData({
        welcomeTitle: config.welcomeTitle || "Welcome to the Server",
        welcomeDescription: config.welcomeDescription || "Welcome! We hope you have a great time here.",
        welcomeColor: config.welcomeColor || "#5865F2",
        welcomeThumbnail: config.welcomeThumbnail || "true",
      });
    }
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig.mutate({
      guildId,
      ...formData,
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-[#2b2d31] border-black/20 animate-pulse">
        <div className="h-[400px]" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-[#2b2d31] border-black/20 overflow-hidden">
          <CardHeader className="border-b border-black/10 bg-black/5">
            <div className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" />
              <CardTitle className="text-white">Welcome Message Settings (Embed)</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Customize how the welcome embed looks when a new member joins.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Text Settings */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Type className="w-4 h-4" /> Message Title
                    </Label>
                    <Input
                      value={formData.welcomeTitle}
                      onChange={(e) => setFormData({ ...formData, welcomeTitle: e.target.value })}
                      className="bg-[#1e1f22] border-black/20 text-white focus:border-primary/50"
                      placeholder="Welcome to Onyx Royal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Type className="w-4 h-4" /> Message Description
                    </Label>
                    <Textarea
                      value={formData.welcomeDescription}
                      onChange={(e) => setFormData({ ...formData, welcomeDescription: e.target.value })}
                      className="bg-[#1e1f22] border-black/20 text-white min-h-[120px] focus:border-primary/50"
                      placeholder="Use {user} to mention the new member"
                    />
                  </div>
                </div>

                {/* Visual Settings */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Palette className="w-4 h-4" /> Embed Color
                    </Label>
                    <div className="flex gap-3 items-center">
                      <Input
                        type="color"
                        value={formData.welcomeColor}
                        onChange={(e) => setFormData({ ...formData, welcomeColor: e.target.value })}
                        className="w-12 h-12 p-1 bg-transparent border-none rounded-lg cursor-pointer"
                      />
                      <Input
                        value={formData.welcomeColor}
                        onChange={(e) => setFormData({ ...formData, welcomeColor: e.target.value })}
                        className="bg-[#1e1f22] border-black/20 text-white flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-black/10 border border-black/5">
                    <div className="space-y-0.5">
                      <Label className="text-gray-200 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Show User Thumbnail
                      </Label>
                      <p className="text-xs text-gray-400">Display the user's avatar as a thumbnail in the embed.</p>
                    </div>
                    <Switch
                      checked={formData.welcomeThumbnail === "true"}
                      onCheckedChange={(checked) => setFormData({ ...formData, welcomeThumbnail: checked ? "true" : "false" })}
                    />
                  </div>

                  {/* Preview Area */}
                  <div className="p-4 rounded-xl bg-[#1e1f22] border border-black/20 space-y-2 max-w-[350px]">
                    <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">Live Preview</div>
                    <div 
                      className="border-r-4 pr-3 py-1 space-y-1"
                      style={{ borderRightColor: formData.welcomeColor }}
                    >
                      <div className="text-sm font-bold text-white">{formData.welcomeTitle || "Embed Title"}</div>
                      <div className="text-xs text-gray-300 whitespace-pre-wrap">
                        {formData.welcomeDescription.replace("{user}", "@NewMember") || "Embed description will appear here..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateConfig.isPending}
                  className="bg-primary hover:bg-primary/90 text-white px-8 h-11 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {updateConfig.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
