import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Clock, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const Reports = () => {
  const navigate = useNavigate();

  // Sample data
  const weeklyData = [
    { day: "Mon", hours: 4 },
    { day: "Tue", hours: 6 },
    { day: "Wed", hours: 3 },
    { day: "Thu", hours: 7 },
    { day: "Fri", hours: 5 },
    { day: "Sat", hours: 2 },
    { day: "Sun", hours: 4 },
  ];

  const progressData = [
    { week: "Week 1", sessions: 12 },
    { week: "Week 2", sessions: 18 },
    { week: "Week 3", sessions: 22 },
    { week: "Week 4", sessions: 28 },
  ];

  return (
    <div className="min-h-screen gradient-primary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 animate-fade-in">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="icon"
            className="shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold font-heading text-white">
              Your Progress & Insights
            </h1>
            <p className="text-white/80 mt-1">Track your productivity journey</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
          <Card className="p-6 gradient-card border-none shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold font-heading text-foreground">31h</div>
                <div className="text-sm text-muted-foreground">Total Focus Time</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 gradient-card border-none shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/20">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="text-3xl font-bold font-heading text-foreground">87%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 gradient-card border-none shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/20">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <div className="text-3xl font-bold font-heading text-foreground">+32%</div>
                <div className="text-sm text-muted-foreground">vs Last Week</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Focus Hours */}
          <Card className="p-6 gradient-card border-none shadow-xl animate-fade-in">
            <h2 className="text-xl font-bold font-heading mb-4 text-foreground">
              Weekly Focus Hours
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Progress */}
          <Card className="p-6 gradient-card border-none shadow-xl animate-fade-in">
            <h2 className="text-xl font-bold font-heading mb-4 text-foreground">
              Monthly Sessions Progress
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--accent))", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Achievements Summary */}
        <Card className="p-6 gradient-card border-none shadow-xl animate-scale-in">
          <h2 className="text-xl font-bold font-heading mb-4 text-foreground">
            Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "7 Day Streak", value: "🔥", color: "text-warning" },
              { label: "100 Tasks", value: "✅", color: "text-success" },
              { label: "50 Hours", value: "⏰", color: "text-primary" },
              { label: "Top 10%", value: "🏆", color: "text-secondary" },
            ].map((achievement) => (
              <div
                key={achievement.label}
                className="p-4 rounded-lg bg-card hover:bg-muted/50 transition-all hover:scale-105 cursor-pointer"
              >
                <div className={`text-4xl mb-2 ${achievement.color}`}>{achievement.value}</div>
                <div className="text-sm font-semibold text-foreground">{achievement.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
