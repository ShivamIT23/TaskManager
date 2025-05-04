"use client";

import { useEffect } from "react";
import { useSocketStore } from "@taskShivManager/store/socketStore";

export const SocketProvider = () => {
  const socket = useSocketStore((state) => state.socket);
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || socket) return;

    connect(token);

    return () => {
      disconnect();
    };
  }, []);

  return null; // Just for side effects
};
