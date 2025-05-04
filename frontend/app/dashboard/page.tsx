"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@taskShivManager/components/DashBoard/NavBar";
import { TaskCard } from "@taskShivManager/components/DashBoard/Task_Card";
import { Button } from "@taskShivManager/components/ui/button";
import { Input } from "@taskShivManager/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useTaskStore } from "@taskShivManager/store/taskStore";
import { fetchGivenTasks } from "@taskShivManager/lib/fetchTasks";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  createdBy: string;
  assignedTo: string;
  pendingAction?: {
    action: "update" | "delete" | null;
    requestedBy?: string;
    updateData?: object;
    approved?: boolean;
  };
}

// Mock data for tasks

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");

  const { givenTask } = useTaskStore();

  useEffect(() => {
    setTasks(givenTask);
  }, [givenTask]);

  const handleFilterChange = (priority: string) => {
    setCurrentFilter(priority);
    filterTasks(priority, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterTasks(currentFilter, query);
  };

  const filterTasks = (priority: string, query: string) => {
    let filtered = tasks ? [...tasks] : [];

    // Filter by priority
    if (priority !== "all") {
      filtered = filtered.filter((task) => task.priority === priority);
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Sort tasks so completed tasks appear at the end
    filtered.sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;
      return 0;
    });

    setFilteredTasks(filtered);
  };

  const handleStatusChange = (id: string, status: string) => {
    const updatedTasks = tasks.map((task) =>
      task._id === id
        ? { ...task, status: status as "pending" | "in-progress" | "completed" }
        : task
    );
    setTasks(updatedTasks);
    filterTasks(currentFilter, searchQuery);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task._id !== id);
    setTasks(updatedTasks);
    filterTasks(currentFilter, searchQuery);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchTasks = async () => {
        const res = await fetchGivenTasks(token);
        if (Array.isArray(res)) {
          setTasks(res as Task[]);
        } else {
          console.log(res);
        }
      };
      fetchTasks();
    }
  }, []);

  useEffect(() => {
    filterTasks(currentFilter, searchQuery);
  }, [tasks]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onFilterChange={handleFilterChange} />
      <main className="flex-1">
        <div className="container py-6 mx-auto">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <motion.h1
              className="text-2xl font-bold tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              My Tasks
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

          <AnimatePresence>
            {filteredTasks.length > 0 ? (
              <motion.div
                className="grid gap-4 h-fit w-full sm:grid-cols-2 lg:grid-cols-3 "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
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
                    : currentFilter !== "all"
                    ? `No ${currentFilter} priority tasks found. Try a different filter.`
                    : "You don't have any tasks yet. Create your first task to get started."}
                </p>
                <Link href="/createTask">
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
