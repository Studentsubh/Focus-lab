import { useState, useEffect } from "react";
import { getAllBlocks, addBlock, removeBlock, startFocus, stopFocus } from "@/api/focusApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Upload, Globe, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BlockItem {
  id: number;
  name: string;
  type: string;
  path?: string;
  url?: string;
}

const ContentBlocker = () => {
  const [blockedItems, setBlockedItems] = useState<BlockItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);

  // Load from backend on mount
  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const items = await getAllBlocks();
        setBlockedItems(items);
      } catch (error) {
        console.error("Failed to load blocked items:", error);
        toast({
          title: "Error",
          description: "Failed to load blocked items from server",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadBlocks();
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (!file.name.endsWith('.exe')) continue;

      try {
        await addBlock({
          name: file.name.replace('.exe', ''),
          fileName: file.name,
        });

        // Reload blocks from server
        const items = await getAllBlocks();
        setBlockedItems(items);

        toast({
          title: "App Blocked",
          description: `${file.name} has been added to block list`,
        });
      } catch (error) {
        console.error("Failed to add app:", error);
        toast({
          title: "Error",
          description: `Failed to add ${file.name}`,
          variant: "destructive",
        });
      }
    }

    // Reset input
    event.target.value = '';
  };

  const handleAddApp = async () => {
    if (!inputValue.trim()) return;

    const fullPath = inputValue.trim();
    const name = fullPath.split('\\').pop()?.replace('.exe', '') || fullPath;

    try {
      await addBlock({
        name,
        path: fullPath,
      });

      // Reload blocks from server
      const items = await getAllBlocks();
      setBlockedItems(items);

      setInputValue("");

      toast({
        title: "App Blocked",
        description: `${name} has been added to block list`,
      });
    } catch (error) {
      console.error("Failed to add app:", error);
      toast({
        title: "Error",
        description: "Failed to add app",
        variant: "destructive",
      });
    }
  };

  const handleAddWebsite = async () => {
    if (!inputValue.trim()) return;

    // Basic URL validation
    try {
      new URL(inputValue.startsWith('http') ? inputValue : `https://${inputValue}`);

      await addBlock({
        name: inputValue.trim(),
        url: inputValue.trim(),
      });

      // Reload blocks from server
      const items = await getAllBlocks();
      setBlockedItems(items);

      setInputValue("");

      toast({
        title: "Website Blocked",
        description: `${inputValue} has been added to block list`,
      });
    } catch (error) {
      console.error("Failed to add website:", error);
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (id: number) => {
    try {
      await removeBlock(id);
      // Reload blocks from server
      const items = await getAllBlocks();
      setBlockedItems(items);
      toast({
        title: "Item Unblocked",
        description: "Removed from block list",
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };
  return (
    <Card className="shadow-xl border-2 border-primary/20 animate-scale-in">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl">Content Blocker</CardTitle>
            <CardDescription>Block apps and websites to stay focused</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="apps" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="apps" className="gap-2">
              <Upload className="h-4 w-4" />
              Blocked Apps
            </TabsTrigger>
            <TabsTrigger value="websites" className="gap-2">
              <Globe className="h-4 w-4" />
              Blocked Websites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apps" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter full path to .exe file (e.g., C:\Program Files\app.exe)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddApp()}
                className="flex-1"
              />
              <Button onClick={handleAddApp}>
                Add App
              </Button>
            </div>

            {blockedItems.filter(item => item.type === 'app').length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No blocked apps yet. Add some to get started!</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>App Name</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blockedItems.filter(item => item.type === 'app').map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.name}</TableCell>
                        <TableCell className="text-muted-foreground">{app.path}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(app.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="websites" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter website URL (e.g., facebook.com)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddWebsite()}
                className="flex-1"
              />
              <Button onClick={handleAddWebsite}>
                Add Website
              </Button>
            </div>

            {blockedItems.filter(item => item.type === 'website').length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No blocked websites yet. Add some to stay focused!</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Website URL</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blockedItems.filter(item => item.type === 'website').map((site) => (
                      <TableRow key={site.id}>
                        <TableCell className="font-medium">{site.url}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(site.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentBlocker;
