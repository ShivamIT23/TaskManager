import { create } from "zustand";
import { io, Socket } from "socket.io-client";

export interface SocketStore {
  socket: Socket | null;
  connect: (token: string) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,

  connect: (token: string) => {
    const existingSocket = get().socket;

    // Only create a new socket if there's no existing socket or the existing one is disconnected
    if (existingSocket && existingSocket.connected) {
      return; // Don't reconnect if already connected
    }

    // Create a new socket only when needed
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_SERVER!, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });

    socket.on("notification", (data) => {
      console.log("📨 Notification received:", data);
    });

    // Update the state only when the socket is actually created
    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
