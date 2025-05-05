"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { createTask } from "@taskShivManager/lib/fetchTasks";
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
import { useUserList } from "@taskShivManager/store/userList";

export default function CreateTaskPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { users, fetchUsers } = useUserList();
  const [taskData, setTaskData] = useState<{
    title: string;
    description: string;
    dueDate: Date | undefined;
    priority: string;
    status: string;
    assignedToName: string;
  }>({
    title: "",
    description: "",
    dueDate: new Date(),
    priority: "",
    status: "",
    assignedToName: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUsers(token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, priority, status, assignedToName, dueDate } =
      taskData;

    if (
      !title ||
      !description ||
      !priority ||
      !status ||
      !assignedToName ||
      !dueDate
    ) {
      alert("Please fill out all fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    setIsLoading(true);

    try {
      if(!taskData.dueDate) return;
      await createTask(token, { ...taskData, dueDate: taskData.dueDate as Date });
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-6">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Create New Task</CardTitle>
                <CardDescription>
                  Create a new task and assign it to a team member
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      value={taskData.title}
                      onChange={(e) =>
                        setTaskData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      id="title"
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      value={taskData.description}
                      onChange={(e) =>
                        setTaskData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      id="description"
                      placeholder="Enter task description"
                      className="min-h-32 resize-none"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-5">
                    <div className="space-y-2 col-span-1">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={taskData.priority}
                        onValueChange={(value) =>
                          setTaskData((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 col-span-1">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={taskData.status}
                        onValueChange={(value) =>
                          setTaskData((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">
                            In-progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 col-span-1">
                      <Label htmlFor="assignee">Assign To</Label>
                      <Select
                        value={taskData.assignedToName}
                        onValueChange={(value) =>
                          setTaskData((prev) => ({
                            ...prev,
                            assignedToName: value,
                          }))
                        }
                      >
                        <SelectTrigger id="assignee">
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {users.length > 0 &&
                            users.map((user) => (
                              <SelectItem key={user._id} value={user.username}>
                                {user.username}
                              </SelectItem>
                            ))}
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
                              !taskData.dueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {taskData.dueDate
                              ? format(taskData.dueDate, "PPP")
                              : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white">
                          <Calendar
                            mode="single"
                            selected={taskData.dueDate}
                            onSelect={(date) =>
                              setTaskData((prev) => ({
                                ...prev,
                                dueDate: date,
                              }))
                            }
                            initialFocus
                            showOutsideDays={false}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Task"
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
