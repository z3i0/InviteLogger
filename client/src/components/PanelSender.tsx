import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, Trash2, Send, Layout, Palette, Type, Hash, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface Emoji {
  id: string;
  name: string;
  url: string;
  string: string;
}

interface PanelSenderProps {
  guildId: string;
}

export function PanelSender({ guildId }: PanelSenderProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [formData, setFormData] = useState({
    channelId: "",
    title: "Role Board",
    description: "Choose your role from the list below to activate it.",
    color: "#5865F2",
    thumbnail: "",
    options: [
      { label: "Member Role", description: "Get member role", roleId: "", emoji: "" },
    ],
  });

  useEffect(() => {
    if (guildId) {
      fetch(`/api/bot/emojis/${guildId}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch emojis");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setEmojis(data);
          } else {
            console.error("Emojis data is not an array:", data);
          }
        })
        .catch(err => {
          console.error("Error fetching emojis:", err);
        });
    }
  }, [guildId]);

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { label: "", description: "", roleId: "", emoji: "" }],
    });
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const updateOption = (index: number, field: string, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.channelId) return toast({ title: "خطأ", description: "يرجى إدخال ID الروم", variant: "destructive" });
    
    setLoading(true);
    try {
      const res = await fetch("/api/bot/send-panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      
      toast({ title: "نجاح", description: "تم إرسال اللوحة بنجاح" });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-[#2b2d31] border-black/20">
            <CardHeader className="border-b border-black/10">
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                <CardTitle className="text-white">Panel Sender (Embed + Select Menu)</CardTitle>
              </div>
              <CardDescription className="text-gray-400">Create a custom panel and send it to a specific channel.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2 mr-2">
                       Channel ID <Hash className="w-4 h-4" />
                    </Label>
                    <Input
                      value={formData.channelId}
                      onChange={(e) => setFormData({ ...formData, channelId: e.target.value })}
                      className="bg-[#1e1f22] border-black/20 text-white"
                      placeholder="1234567890..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2 mr-2">
                      Title <Type className="w-4 h-4" />
                    </Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-[#1e1f22] border-black/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2 mr-2">
                      Description <Type className="w-4 h-4" />
                    </Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[#1e1f22] border-black/20 text-white min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2 mr-2">
                      Color <Palette className="w-4 h-4" /> 
                    </Label>
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-10 w-full p-1 bg-transparent border-none rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Thumbnail URL</Label>
                    <Input
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="bg-[#1e1f22] border-black/20 text-white"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-lg">Select Menu Options</Label>
                  <Button type="button" onClick={addOption} variant="outline" size="sm" className="bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary">
                    <Plus className="w-4 h-4 mr-1" /> Add Option
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {formData.options.map((option, index) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={index} className="p-4 rounded-xl bg-black/10 border border-black/10 relative group">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs text-gray-400 mb-1 block">Label</Label>
                          <Input
                            value={option.label}
                            onChange={(e) => updateOption(index, "label", e.target.value)}
                            className="bg-[#1e1f22] border-black/20 text-white h-9"
                            placeholder="e.g. VIP Role"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400 mb-1 block">Role ID</Label>
                          <Input
                            value={option.roleId}
                            onChange={(e) => updateOption(index, "roleId", e.target.value)}
                            className="bg-[#1e1f22] border-black/20 text-white h-9"
                            placeholder="12345..."
                          />
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                          <div className="flex-1">
                            <Label className="text-xs text-gray-400 mb-1 block">Description (Optional)</Label>
                            <Input
                              value={option.description}
                              onChange={(e) => updateOption(index, "description", e.target.value)}
                              className="bg-[#1e1f22] border-black/20 text-white h-9"
                            />
                          </div>
                          <div className="w-24">
                            <Label className="text-xs text-gray-400 mb-1 block">Emoji</Label>
                            <div className="flex gap-1">
                              <Input
                                value={option.emoji}
                                onChange={(e) => updateOption(index, "emoji", e.target.value)}
                                className="bg-[#1e1f22] border-black/20 text-white h-9 text-center px-1"
                              />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" size="icon" className="h-9 w-9 p-0 bg-[#1e1f22] border-black/20">
                                    <Smile className="h-4 h-4 text-gray-400" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0 bg-[#1e1f22] border-black/20 shadow-2xl z-[100]" side="top" align="end">
                                  <Command className="bg-transparent">
                                    <CommandInput placeholder="Search for emoji..." className="text-white border-none focus:ring-0" />
                                    <CommandList className="max-h-[300px]">
                                      <CommandEmpty className="p-4 text-gray-400 text-center">No results found.</CommandEmpty>
                                      <CommandGroup heading="Server Emojis" className="text-gray-500">
                                        <div className="grid grid-cols-5 gap-1 p-2">
                                          {emojis.map((emoji) => (
                                            <CommandItem
                                              key={emoji.id}
                                              value={emoji.name}
                                              onSelect={() => {
                                                updateOption(index, "emoji", emoji.string);
                                              }}
                                              className="flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                                            >
                                              <div 
                                                className="flex flex-col items-center justify-center w-full"
                                                onClick={() => updateOption(index, "emoji", emoji.string)}
                                              >
                                                <img src={emoji.url} alt={emoji.name} className="w-8 h-8 object-contain" />
                                                <span className="text-[8px] mt-1 text-gray-400 truncate w-full text-center">:{emoji.name}:</span>
                                              </div>
                                            </CommandItem>
                                          ))}
                                        </div>
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <Button type="button" onClick={() => removeOption(index)} variant="destructive" size="icon" className="h-9 w-9 mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-black/10 flex justify-end">
                <Button disabled={loading} type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 rounded-xl shadow-lg shadow-primary/20">
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Sending..." : "Send Panel Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}
