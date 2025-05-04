"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { Badge } from "@taskShivManager/components/ui/badge";
import { Button } from "@taskShivManager/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@taskShivManager/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@taskShivManager/components/ui/dropdown-menu";
import Link from "next/link";

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  assignedTo: string;
  createdBy: string;
  dueDate: string;
}

interface TaskCardProps {
  task: Task;
  onStatusChange?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  showEditButton?: boolean;
  showAssign?: boolean;
}

export function TaskCard({
  task,
  onStatusChange,
  onDelete,
  showEditButton,
  showAssign = false,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityColor = {
    high: "text-red-500 bg-red-100",
    medium: "text-amber-500 bg-amber-100",
    low: "text-green-500 bg-green-100",
  };

  const statusColor = {
    pending: "text-slate-500 bg-slate-100",
    "in-progress": "text-blue-500 bg-blue-100",
    completed: "text-green-500 bg-green-100",
  };

  const priorityIcon = {
    high: <AlertCircle className="h-4 w-4" />,
    medium: <Clock className="h-4 w-4" />,
    low: <CheckCircle className="h-4 w-4" />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="w-full h-full py-[2vh]"
    >
      <Card className="w-full h-full flex flex-col justify-evenly">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">{task.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={priorityColor[task.priority]}
                >
                  <span className="flex items-center gap-1">
                    {priorityIcon[task.priority]}
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </span>
                </Badge>
                <Badge variant="outline" className={statusColor[task.status]}>
                  {task.status.charAt(0).toUpperCase() +
                    task.status.slice(1).replace("-", " ")}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-full ">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="bg-white">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete && onDelete(task._id)}
                  className="text-red-600 bg-white"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {isExpanded
                ? task.description
                : `${task.description.substring(0, 100)}${
                    task.description.length > 100 ? "..." : ""
                  }`}
            </div>
            {task.description.length > 100 && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show less" : "Read more"}
              </Button>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-muted-foreground">
              {showAssign && (
                <div>
                  <span className="font-medium">Assigned to: </span>
                  {task.assignedTo}
                </div>
              )}
              <div>
                <span className="font-medium">Due:</span>{" "}
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-0">
          <div className="text-xs text-muted-foreground">
            Created by {task.createdBy}
          </div>
          <div className="flex gap-2">
            {task.status !== "completed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onStatusChange &&
                  onStatusChange(
                    task._id,
                    task.status === "pending" ? "in-progress" : "completed"
                  )
                }
              >
                {task.status === "pending" ? "Start Task" : "Complete"}
              </Button>
            )}
            {showEditButton && (
              <Link href={`/edit-task/${task._id}`}>
                <Button size="sm" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
