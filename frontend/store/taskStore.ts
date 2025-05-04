import {create} from 'zustand';

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium"|"low";
  status: "pending" | "in-progress" | "completed";
  createdBy: string;
  assignedTo: string;
  pendingAction?: {
    action: 'update' | 'delete' | null;
    requestedBy?: string;
    updateData?: object;
    approved?: boolean;
  };
}

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: string;
  taskId: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskStore {
  givenTask: Task[];
  assignedTask: Task[];
  notifications: Notification[];

  setGivenTask: (task: Task[]) => void;
  setAssignedTasks: (tasks: Task[]) => void;
  setNotifications: (notifications: Notification[]) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  givenTask: [],
  assignedTask: [],
  notifications: [],

  setGivenTask: (task) => set({ givenTask: task }),
  setAssignedTasks: (tasks) => set({ assignedTask: tasks }),
  setNotifications: (notifications) => set({ notifications }),
}));
