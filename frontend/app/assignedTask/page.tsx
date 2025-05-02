"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@taskShivManager/components/DashBoard/NavBar";
import {
  TaskCard,
  type Task,
} from "@taskShivManager/components/DashBoard/Task_Card";
import { Button } from "@taskShivManager/components/ui/button";
import { Input } from "@taskShivManager/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@taskShivManager/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

// Mock data for assigned tasks (tasks created by the current user)
const mockAssignedTasks: Task[] = [
  {
    id: "6",
    title: "Create marketing materials",
    description:
      "Design and create marketing materials for the new product launch including brochures, social media graphics, and email templates.",
    priority: "high",
    status: "in-progress",
    assignedTo: "Emily Davis",
    createdBy: "John Doe",
    dueDate: new Date(2025, 4, 18),
  },
  {
    id: "7",
    title: "Conduct user research",
    description:
      "Interview 5-10 users to gather feedback on the new feature prototype and compile findings into a report.",
    priority: "medium",
    status: "pending",
    assignedTo: "Sarah Johnson",
    createdBy: "John Doe",
    dueDate: new Date(2025, 4, 22),
  },
  {
    id: "8",
    title: "Optimize database queries",
    description:
      "Review and optimize the current database queries to improve application performance. Focus on the most resource-intensive operations.",
    priority: "medium",
    status: "pending",
    assignedTo: "Michael Brown",
    createdBy: "John Doe",
    dueDate: new Date(2025, 4, 25),
  },
  {
    id: "9",
    title: "Set up analytics dashboard",
    description:
      "Configure and set up an analytics dashboard to track key performance metrics for the application.",
    priority: "low",
    status: "completed",
    assignedTo: "Alex Wilson",
    createdBy: "John Doe",
    dueDate: new Date(2025, 4, 12),
  },
  {
    id: "10",
    title: "Write API documentation",
    description:
      "Create comprehensive documentation for the new API endpoints including request/response formats, authentication requirements, and example usage.",
    priority: "high",
    status: "pending",
    assignedTo: "Robert Johnson",
    createdBy: "John Doe",
    dueDate: new Date(2025, 4, 30),
  },
];

// Mock team members for the assignee filter
const teamMembers = [
  { id: "all", name: "All Team Members" },
  { id: "emily-davis", name: "Emily Davis" },
  { id: "sarah-johnson", name: "Sarah Johnson" },
  { id: "michael-brown", name: "Michael Brown" },
  { id: "alex-wilson", name: "Alex Wilson" },
  { id: "robert-johnson", name: "Robert Johnson" },
];

export default function AssignedTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockAssignedTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockAssignedTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const handlePriorityFilterChange = (priority: string) => {
    setPriorityFilter(priority);
    filterTasks(priority, assigneeFilter, searchQuery);
  };

  const handleAssigneeFilterChange = (assignee: string) => {
    setAssigneeFilter(assignee);
    filterTasks(priorityFilter, assignee, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterTasks(priorityFilter, assigneeFilter, query);
  };

  const filterTasks = (priority: string, assignee: string, query: string) => {
    let filtered = [...tasks];

    // Filter by priority
    if (priority !== "all") {
      filtered = filtered.filter((task) => task.priority === priority);
    }

    // Filter by assignee
    if (assignee !== "all") {
      filtered = filtered.filter((task) => {
        const assigneeName = task.assignedTo.toLowerCase().replace(" ", "-");
        return assigneeName === assignee;
      });
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleStatusChange = (id: string, status: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, status: status as "pending" | "in-progress" | "completed" }
        : task
    );
    setTasks(updatedTasks);
    filterTasks(priorityFilter, assigneeFilter, searchQuery);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    filterTasks(priorityFilter, assigneeFilter, searchQuery);
  };

  useEffect(() => {
    filterTasks(priorityFilter, assigneeFilter, searchQuery);
  }, [tasks]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onFilterChange={handlePriorityFilterChange} />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <motion.h1
              className="text-2xl font-bold tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Tasks I&apos;ve Assigned
            </motion.h1>
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Link href="/createTask">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by assignee:</span>
              </div>
              <Select
                value={assigneeFilter}
                onValueChange={handleAssigneeFilterChange}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <AnimatePresence>
            {filteredTasks.length > 0 ? (
              <motion.div
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                    showEditButton={true}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="mb-2 text-lg font-medium">No tasks found</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  {searchQuery
                    ? "No tasks match your search criteria. Try a different search term."
                    : priorityFilter !== "all" || assigneeFilter !== "all"
                    ? "No tasks match your filter criteria. Try different filters."
                    : "You haven't assigned any tasks yet. Create your first task to get started."}
                </p>
                <Link href="/create-task">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
