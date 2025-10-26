import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const NotesPanel = () => {
  const [notes, setNotes] = useState("# My Focus Notes\n\nWrite your thoughts here...");

  const saveNotes = () => {
    toast({
      title: "Notes Saved!",
      description: "Your notes have been saved successfully. 📝",
    });
  };

  return (
    <Card className="p-6 gradient-card border-none shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold font-heading flex items-center gap-2 text-foreground">
          <FileText className="h-6 w-6 text-primary" />
          Quick Notes
        </h2>
        <Button
          onClick={saveNotes}
          variant="outline"
          size="sm"
          className="shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Capture your ideas, plans, and thoughts..."
        className="min-h-[300px] font-mono text-sm resize-none"
      />

      <div className="mt-4 text-xs text-muted-foreground">
        💡 Tip: Use Markdown for formatting (e.g., # for headings, ** for bold)
      </div>
    </Card>
  );
};

export default NotesPanel;
