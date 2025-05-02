"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@taskShivManager/components/DashBoard/NavBar"
import { TaskCard, type Task } from "@taskShivManager/components/DashBoard/Task_Card"
import { Button } from "@taskShivManager/components/ui/button"
import { Input } from "@taskShivManager/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description:
      "Write a detailed project proposal for the new client including timeline, budget, and resource allocation. Make sure to include all the requirements discussed in the meeting.",
    priority: "high",
    status: "pending",
    assignedTo: "John Doe",
    createdBy: "Admin",
    dueDate: new Date(2025, 4, 15),
  },
  {
    id: "2",
    title: "Review design mockups",
    description: "Review the design mockups for the landing page and provide feedback to the design team.",
    priority: "medium",
    status: "in-progress",
    assignedTo: "John Doe",
    createdBy: "Sarah Johnson",
    dueDate: new Date(2025, 4, 10),
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Update the API documentation with the new endpoints and parameters.",
    priority: "low",
    status: "completed",
    assignedTo: "John Doe",
    createdBy: "Michael Brown",
    dueDate: new Date(2025, 4, 5),
  },
  {
    id: "4",
    title: "Fix navigation bug",
    description:
      "Fix the navigation bug in the mobile view where the dropdown menu doesn't close after clicking an item.",
    priority: "high",
    status: "pending",
    assignedTo: "John Doe",
    createdBy: "Emily Davis",
    dueDate: new Date(2025, 4, 20),
  },
  {
    id: "5",
    title: "Prepare client presentation",
    description: "Create slides for the upcoming client presentation highlighting project milestones and achievements.",
    priority: "medium",
    status: "pending",
    assignedTo: "John Doe",
    createdBy: "Alex Wilson",
    dueDate: new Date(2025, 4, 25),
  },
]

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFilter, setCurrentFilter] = useState("all")

  const handleFilterChange = (priority: string) => {
    setCurrentFilter(priority)
    filterTasks(priority, searchQuery)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterTasks(currentFilter, query)
  }

  const filterTasks = (priority: string, query: string) => {
    let filtered = [...tasks]

    // Filter by priority
    if (priority !== "all") {
      filtered = filtered.filter((task) => task.priority === priority)
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description.toLowerCase().includes(query.toLowerCase()),
      )
    }

    setFilteredTasks(filtered)
  }

  const handleStatusChange = (id: string, status: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: status as "pending" | "in-progress" | "completed" } : task,
    )
    setTasks(updatedTasks)
    filterTasks(currentFilter, searchQuery)
  }

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)
    filterTasks(currentFilter, searchQuery)
  }

  useEffect(() => {
    filterTasks(currentFilter, searchQuery)
  }, [tasks])

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
                  <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} />
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
  )
}
