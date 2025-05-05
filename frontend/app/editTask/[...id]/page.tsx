"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import Navbar from "@taskShivManager/components/DashBoard/NavBar";
import { Button } from "@taskShivManager/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@taskShivManager/components/ui/card";
import { Input } from "@taskShivManager/components/ui/input";
import { Label } from "@taskShivManager/components/ui/label";
import { Textarea } from "@taskShivManager/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@taskShivManager/components/ui/select";
import { Calendar } from "@taskShivManager/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@taskShivManager/components/ui/popover";
import { cn } from "@taskShivManager/lib/utils";
import { Task } from "@taskShivManager/components/DashBoard/Task_Card";

// Mock data for assigned tasks (tasks created by the current user)
const mockAssignedTasks: Task[] = [
  {
    _id: "6",
    title: "Create marketing materials",
    description:
      "Design and create marketing materials for the new product launch including brochures, social media graphics, and email templates.",
    priority: "high",
    status: "in-progress",
    assignedToName: "Emily Davis",
    assignedTo: "3124saacvf",
    createdByName: "John Doe",
    createdBy: "dsavdsds",
    dueDate: new Date(2025, 4, 18).toISOString(),
  },
  {
    _id: "7",
    title: "Conduct user research",
    description:
      "Interview 5-10 users to gather feedback on the new feature prototype and compile findings into a report.",
    priority: "medium",
    status: "pending",
    assignedTo:"@1easdfafda",
    assignedToName: "Sarah Johnson",
    createdBy:"sdafsaafsd",
    createdByName: "John Doe",
    dueDate: new Date(2025, 4, 22).toISOString(),
  },
];

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(
    "pending"
  );
  const [assignee, setAssignee] = useState("");
  const [date, setDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Simulate fetching task data
    const fetchTask = () => {
      setIsFetching(true);

      // Find the task in our mock data
      const foundTask = mockAssignedTasks.find((t) => t._id === taskId);

      setTimeout(() => {
        if (foundTask) {
          setTask(foundTask);
          setTitle(foundTask.title);
          setDescription(foundTask.description);
          setPriority(foundTask.priority);
          setStatus(foundTask.status);
          setAssignee(foundTask.assignedTo.toLowerCase().replace(" ", "-"));
          setDate(foundTask.dueDate);
        }
        setIsFetching(false);
      }, 800);
    };

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate task update process
    setTimeout(() => {
      setIsLoading(false);
      router.push("/assigned-tasks");
    }, 1500);
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading task...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!task && !isFetching) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold">Task not found</h2>
            <p className="text-muted-foreground">
              The task you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have permission to view it.
            </p>
            <Button onClick={() => router.push("/assigned-tasks")}>
              Go back to assigned tasks
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-3xl py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Edit Task</CardTitle>
                <CardDescription>
                  Update the details of this task
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter task title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter task description"
                      className="min-h-32"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={priority}
                        onValueChange={(value) =>
                          setPriority(value as "high" | "medium" | "low")
                        }
                        required
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={status}
                        onValueChange={(value) =>
                          setStatus(
                            value as "pending" | "in-progress" | "completed"
                          )
                        }
                        required
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date
                              ? format(new Date(date), "PPP")
                              : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date ? new Date(date) : undefined}
                            onSelect={(newDate) =>
                              setDate(newDate?.toISOString())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignee">Assign To</Label>
                    <Select
                      value={assignee}
                      onValueChange={setAssignee}
                      required
                    >
                      <SelectTrigger id="assignee">
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john-doe">John Doe</SelectItem>
                        <SelectItem value="emily-davis">Emily Davis</SelectItem>
                        <SelectItem value="sarah-johnson">
                          Sarah Johnson
                        </SelectItem>
                        <SelectItem value="robert-johnson">
                          Robert Johnson
                        </SelectItem>
                        <SelectItem value="michael-brown">
                          Michael Brown
                        </SelectItem>
                        <SelectItem value="alex-wilson">Alex Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/assigned-tasks")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Task"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
