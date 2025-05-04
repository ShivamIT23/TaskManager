"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@taskShivManager/components/DashBoard/NavBar";
import { TaskCard } from "@taskShivManager/components/DashBoard/Task_Card";
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
import { useTaskStore } from "@taskShivManager/store/taskStore";
import { useUserList } from "@taskShivManager/store/userList";
import { fetchAssignedTasks } from "@taskShivManager/lib/fetchTasks";

// Interface tasks (tasks given to the current user)
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

export default function AssignedTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const { assignedTask } = useTaskStore();
  const { users, fetchUsers } = useUserList();

  useEffect(() => {
    setTasks(assignedTask);
  }, [assignedTask]);

  const handlePriorityFilterChange = (priority: string) => {
    setPriorityFilter(priority);
    filterTasks(priority, assigneeFilter, searchQuery);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUsers(token);
  }, []);

  const handleAssigneeFilterChange = (assignee: string) => {
    setAssigneeFilter(assignee);
    filterTasks(priorityFilter, assignee, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterTasks(priorityFilter, assigneeFilter, query);
  };

  const filterTasks = (priority: string, assignee: string, query: string) => {
    let filtered = tasks ? [...tasks] : [];

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
    filterTasks(priorityFilter, assigneeFilter, searchQuery);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task._id !== id);
    setTasks(updatedTasks);
    filterTasks(priorityFilter, assigneeFilter, searchQuery);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchTasks = async () => {
        try {
          const res = await fetchAssignedTasks(token);
          if (Array.isArray(res)) {
            setTasks(res as Task[]);
          } else {
            console.log(res);
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setTasks([]);
        }
      };
      fetchTasks();
    }
  }, []);

  useEffect(() => {
    filterTasks(priorityFilter, assigneeFilter, searchQuery);
  }, [tasks]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onFilterChange={handlePriorityFilterChange} />
      <main className="flex-1">
        <div className="container py-6 mx-auto">
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
                {users.length > 0 && (
                  <SelectContent className="bg-white">
                    {users.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>
            </div>
          </motion.div>

          <AnimatePresence>
            {filteredTasks.length > 0 ? (
              <motion.div
                key={23}
                className="grid gap-4 h-fit w-full sm:grid-cols-2 lg:grid-cols-3"
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
                    showEditButton={true}
                    showAssign={true}
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
