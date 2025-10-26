import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PomodoroTimer from "@/components/PomodoroTimer";
import GamificationStats from "@/components/GamificationStats";
import TaskList from "@/components/TaskList";
import NotesPanel from "@/components/NotesPanel";
import ContentBlocker from "@/components/ContentBlocker";

const Index = () => {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(7);
  const [points, setPoints] = useState(850);
  const [sessionsCompleted, setSessionsCompleted] = useState(12);

  const handleSessionComplete = () => {
    setSessionsCompleted((prev) => prev + 1);
    setPoints((prev) => prev + 100);
  };

  const handleTaskComplete = () => {
    setPoints((prev) => prev + 50);
  };

  return (
    <div className="min-h-screen gradient-primary">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold font-heading text-white">FocusFlow</h1>
          </div>
          <Button
            onClick={() => navigate("/reports")}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            View Reports
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center text-white animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-2">
            Ready to Crush Your Goals?
          </h2>
          <p className="text-xl text-white/80">
            Beat procrastination with focused work sessions 🚀
          </p>
        </div>

        {/* Gamification Stats */}
        <GamificationStats
          streak={streak}
          points={points}
          sessionsCompleted={sessionsCompleted}
        />

        {/* Content Blocker */}
        <ContentBlocker />

        {/* Timer and Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <PomodoroTimer onSessionComplete={handleSessionComplete} />
            <NotesPanel />
          </div>
          <div>
            <TaskList onTaskComplete={handleTaskComplete} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 text-sm py-8 animate-fade-in">
          <p>💡 Pro tip: Take regular breaks to maintain peak focus!</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
