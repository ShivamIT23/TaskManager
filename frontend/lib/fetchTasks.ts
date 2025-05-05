"use server";
import { useTaskStore } from "../store/taskStore";

export const fetchGivenTasks = async (token: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/tasks/assigned-to-me`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Add this line
        },
      }
    );
    console.log(res);

    if (!res.ok) {
      const text = await res.text();
      if (text == `{"message":"No tasks assigned to you"}`) {
        return text;
      } else {
        throw new Error(`Failed to fetch given tasks: ${text}`);
      }
    }

    const data = await res.json();
    useTaskStore.getState().setGivenTask(data);
    console.log(data);
    return data;
  } catch (err) {
    console.error("Failed to fetch assigned tasks", err);
  }
};

export async function createTask(
  token: string,
  task: {
    title: string;
    description: string;
    dueDate: Date;
    priority: string;
    status: string;
    assignedToName: string;
  }
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/tasks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create task");
  }

  return res.json();
}

export const fetchAssignedTasks = async (token: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/tasks/assigned-by-me`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Add this line
        },
      }
    );
    console.log(res);
    if (!res.ok) {
      const text = await res.text();
      if (text == `{"message":"You haven't assigned any tasks yet"}`) {
        return text;
      }
      throw new Error(`Failed to fetch assigned tasks: ${text}`);
    }

    const data = await res.json();
    useTaskStore.getState().setAssignedTasks(data);
    return data;
  } catch (err) {
    console.error("Failed to fetch assigned tasks", err);
  }
};

export const fetchNotifications = async () => {
  try {
    const res = await fetch("/api/notifications/my"); // adjust route
    const data = await res.json();
    useTaskStore.getState().setNotifications(data);
  } catch (err) {
    console.error("Failed to fetch notifications", err);
  }
};

export const approvePendingAction = async (taskId: string, token: string) => {
  try {
    const res = await fetch(`/api/tasks/${taskId}/approve`, {
      method: "POST",
    });
    const updatedTask = await res.json();
    // Optionally refetch tasks or update Zustand state manually
    fetchAssignedTasks(token);
    return updatedTask;
  } catch (err) {
    console.error("Error approving action", err);
  }
};

export const rejectPendingAction = async (taskId: string, token: string) => {
  try {
    const res = await fetch(`/api/tasks/${taskId}/reject`, {
      method: "POST",
    });
    const updatedTask = await res.json();
    fetchAssignedTasks(token);

    return updatedTask;
  } catch (err) {
    console.error("Error rejecting action", err);
  }
};

export const markNotificationSeen = async (notificationId: string) => {
  try {
    const res = await fetch(`/api/notifications/${notificationId}/seen`, {
      method: "PATCH",
    });

    fetchNotifications();
    return res;

    // Optionally update notification state
  } catch (err) {
    console.error("Error marking notification seen", err);
  }
};
