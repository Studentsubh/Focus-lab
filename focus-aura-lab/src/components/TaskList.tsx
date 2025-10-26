import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskListProps {
  onTaskComplete: () => void;
}

const TaskList = ({ onTaskComplete }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Complete project proposal", completed: false },
    { id: 2, text: "Review team feedback", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
      toast({
        title: "Task Added!",
        description: "Keep going, you're doing great! 🚀",
      });
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      onTaskComplete();
      toast({
        title: "Task Completed! 🎉",
        description: "+50 points earned!",
      });
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <Card className="p-6 gradient-card border-none shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold font-heading mb-4 text-foreground">
        Today's Tasks
      </h2>

      {/* Add Task */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          className="flex-1"
        />
        <Button
          onClick={addTask}
          className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tasks yet. Add one to get started! 💪
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                task.completed
                  ? "bg-success/10 border-2 border-success/30"
                  : "bg-card hover:bg-muted/50"
              } animate-scale-in`}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="data-[state=checked]:bg-success data-[state=checked]:border-success"
              />
              <span
                className={`flex-1 ${
                  task.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.text}
              </span>
              {task.completed && <span className="text-success text-sm">✓ Done</span>}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Progress Summary */}
      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-success h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(tasks.filter((t) => t.completed).length / tasks.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskList;
