// hooks/useSocket.ts
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_SERVER!, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);
};
