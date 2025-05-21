"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSocketstore } from "../store/store";

const SocketProvider = () => {
  const setSocket = useSocketstore((state) => state.setSocket);
  const { data: session } = useSession();

  const socket = useMemo(() => {
    if (!session?.user?.name) return null;

    return io("http://localhost:3000", {
      query: { userId: session.user.name },
      withCredentials: true,
    });
  }, [session]);

  useEffect(() => {
    if (socket) {
      setSocket(socket);

      return () => {
        socket.disconnect();
        setSocket(null);
      };
    }
  }, [socket, setSocket]);

  return null;
};

export default SocketProvider;
