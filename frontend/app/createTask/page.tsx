"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateTaskPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate task creation process
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
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
                    <Input id="title" placeholder="Enter task title" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter task description"
                      className="min-h-32 resize-none"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="space-y-2 col-span-1">
                      <Label htmlFor="priority">Priority</Label>
                      <Select required>
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
                    <div className="space-y-2">
                      <Label htmlFor="assignee">Assign To</Label>
                      <Select required>
                        <SelectTrigger id="assignee">
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="john-doe">John Doe</SelectItem>
                          <SelectItem value="jane-smith">Jane Smith</SelectItem>
                          <SelectItem value="robert-johnson">
                            Robert Johnson
                          </SelectItem>
                          <SelectItem value="emily-davis">
                            Emily Davis
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Popover >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
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
