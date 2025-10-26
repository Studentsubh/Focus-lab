import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Star, Target } from "lucide-react";

interface GamificationStatsProps {
  streak: number;
  points: number;
  sessionsCompleted: number;
}

const GamificationStats = ({ streak, points, sessionsCompleted }: GamificationStatsProps) => {
  const badges = [
    { name: "First Steps", icon: Star, unlocked: sessionsCompleted >= 1, color: "text-accent" },
    { name: "Focused Mind", icon: Target, unlocked: sessionsCompleted >= 5, color: "text-primary" },
    { name: "Streak Master", icon: Flame, unlocked: streak >= 7, color: "text-warning" },
    { name: "Champion", icon: Trophy, unlocked: points >= 1000, color: "text-success" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
      {/* Streak Card */}
      <Card className="p-6 gradient-card border-none shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-warning/20">
            <Flame className="h-6 w-6 text-warning" />
          </div>
          <div>
            <div className="text-3xl font-bold font-heading text-foreground">{streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak 🔥</div>
          </div>
        </div>
      </Card>

      {/* Points Card */}
      <Card className="p-6 gradient-card border-none shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-success/20">
            <Star className="h-6 w-6 text-success" />
          </div>
          <div>
            <div className="text-3xl font-bold font-heading text-foreground">{points}</div>
            <div className="text-sm text-muted-foreground">Total Points ⭐</div>
          </div>
        </div>
      </Card>

      {/* Sessions Card */}
      <Card className="p-6 gradient-card border-none shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/20">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-3xl font-bold font-heading text-foreground">{sessionsCompleted}</div>
            <div className="text-sm text-muted-foreground">Sessions Done 🎯</div>
          </div>
        </div>
      </Card>

      {/* Badges Section */}
      <Card className="p-6 col-span-1 md:col-span-3 gradient-card border-none shadow-lg">
        <h3 className="text-lg font-semibold font-heading mb-4 text-foreground">
          Achievements & Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                badge.unlocked
                  ? "bg-card shadow-md hover:shadow-lg hover:scale-105"
                  : "bg-muted/30 opacity-50 grayscale"
              }`}
            >
              <badge.icon className={`h-8 w-8 mb-2 ${badge.unlocked ? badge.color : "text-muted-foreground"}`} />
              <span className="text-sm font-medium text-center text-foreground">{badge.name}</span>
              {badge.unlocked && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  Unlocked!
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default GamificationStats;
