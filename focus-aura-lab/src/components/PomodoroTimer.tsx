import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { startFocus, stopFocus } from "@/api/focusApi";


interface PomodoroTimerProps {
  onSessionComplete: () => void;
}

const PomodoroTimer = ({ onSessionComplete }: PomodoroTimerProps) => {
  const [mode, setMode] = useState<"short" | "long">("short"); // short = 25+5, long = 50+10
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus");
  const [showDialog, setShowDialog] = useState(false);
  const [isReset, setIsReset] = useState(false); // to know whether pause or reset triggered

  const getDurations = () => {
    return mode === "short"
      ? { focus: 25, break: 5 }
      : { focus: 50, break: 10 };
  };

  const durations = getDurations();

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            onSessionComplete();
            if (sessionType === "focus") {
              setSessionType("break");
              setMinutes(durations.break);
              setSeconds(0);
            } else {
              setSessionType("focus");
              setMinutes(durations.focus);
              setSeconds(0);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, sessionType, onSessionComplete, durations]);

 const toggleTimer = async () => {
  if (isActive) {
    setIsReset(false);
    setShowDialog(true); // ask confirmation when pausing
  } else {
    setIsActive(true);
    try {
      await startFocus(); // ✅ start blocking when timer starts
      console.log("Focus mode started - blocker active");
    } catch (err) {
      console.error("Failed to start focus mode:", err);
    }
  }
};


  const resetTimer = () => {
    setIsReset(true);
    setShowDialog(true); // ask confirmation when resetting
  };

  const handleDialogResponse = async (finished: boolean) => {
  setShowDialog(false);
  setIsActive(false);
  setSessionType("focus");
  setMinutes(durations.focus);
  setSeconds(0);

  try {
    await stopFocus(); // ✅ stop blocking when timer stops or resets
    console.log("Focus mode stopped - blocker disabled");
  } catch (err) {
    console.error("Failed to stop focus mode:", err);
  }
};


  const totalSeconds =
    sessionType === "focus" ? durations.focus * 60 : durations.break * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return (
    <Card className="p-8 gradient-card border-none shadow-xl animate-fade-in">
      <div className="text-center space-y-6">
        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-4">
          <Button
            variant={mode === "short" ? "default" : "outline"}
            onClick={() => {
              if (!isActive) {
                setMode("short");
                setMinutes(25);
                setSeconds(0);
                setSessionType("focus");
              }
            }}
          >
            25+5 Mode
          </Button>
          <Button
            variant={mode === "long" ? "default" : "outline"}
            onClick={() => {
              if (!isActive) {
                setMode("long");
                setMinutes(50);
                setSeconds(0);
                setSessionType("focus");
              }
            }}
          >
            50+10 Mode
          </Button>
        </div>

        {/* Progress Ring */}
        <div className="relative w-64 h-64 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>

          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold font-heading text-foreground">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>
            <div className="text-sm font-semibold text-muted-foreground mt-2 uppercase tracking-wide">
              {sessionType === "focus" ? "Focus Time" : "Break Time"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            {isActive ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start
              </>
            )}
          </Button>
          <Button
            onClick={resetTimer}
            size="lg"
            variant="outline"
            className="shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>

        {/* Motivation */}
        <div className="text-muted-foreground text-sm animate-pulse-slow">
          {isActive
            ? sessionType === "focus"
              ? "🎯 Stay focused! You're doing great!"
              : "☕ Take a break, you've earned it!"
            : "💪 Ready to beat procrastination? Let's go!"}
        </div>
      </div>

      {/* Confirmation Popup */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Did you finish your work?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-4">
            <Button
              onClick={() => handleDialogResponse(true)}
              className="bg-primary text-primary-foreground"
            >
              Yes
            </Button>
            <Button variant="outline" onClick={() => handleDialogResponse(false)}>
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PomodoroTimer;
