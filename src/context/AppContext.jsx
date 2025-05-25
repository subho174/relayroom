"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useFetchUser from "../components/fetchUser";

const AppContext = createContext();

export function AppProvider({ children }) {
  const user = useFetchUser();
  const [socket, setSocket] = useState(null);
  const [allUsers, setallUsers] = useState([]);
  const [hadPastChatsWith, sethadPastChatsWith] = useState([]);
  const [isPanelOpen, setisPanelOpen] = useState(true);
  const [isSmallScreen, setisSmallScreen] = useState(window.innerWidth < 640);
  const [receiverName, setreceiverName] = useState();
  const [receiverId, setreceiverId] = useState();
  const [chatId, setchatId] = useState();
  const [messages, setmessages] = useState([]);
  const [isMsgFetching, setisMsgFetching] = useState(false);

  // useEffect(() => {
  //   const connectSocket = async () => {
  //     if (!user) return;
  //     const res = await fetch("/api/get-token");
  //     const data = await res.json();

  //     if (!data.token) {
  //       console.error("Token not received");
  //       return;
  //     }

  //     const socket = io("http://localhost:3000", {
  //       path: "/api/socket",
  //       query: { user: user.username },
  //       extraHeaders: {
  //         authorization: `Bearer ${data.token}`,
  //       },
  //     });

  //     socket.on("connect", () => {
  //       console.log("Socket connected", socket);
  //       setSocket(socket);
  //     });

  //     socket.on("connect_error", (err) => {
  //       console.error("Socket connection error:", err.message);
  //     });
  //   };

  //   connectSocket();
  // }, [user]);
  useEffect(() => {
    const connectSocket = async () => {
      if (!user) return;

      const res = await fetch("/api/get-token");
      const data = await res.json();

      if (!data.token) {
        console.error("Token not received");
        return;
      }

      const newSocket = io("https://relayroom.onrender.com", {
        path: "/socket.io", // default
        query: { user: user.username || user.name },
        extraHeaders: {
          authorization: `Bearer ${data.token}`,
        },
      });

      newSocket.on("connect", () => {
        console.log("Socket connected", newSocket.id);
        setSocket(newSocket);
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      // return () => {
      //   newSocket.disconnect();
      // };
    };

    connectSocket();
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setisSmallScreen(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AppContext.Provider
      value={{
        socket,
        isSmallScreen,
        isPanelOpen,
        setisPanelOpen,
        allUsers,
        setallUsers,
        hadPastChatsWith,
        sethadPastChatsWith,
        receiverName,
        setreceiverName,
        receiverId,
        setreceiverId,
        chatId,
        setchatId,
        messages,
        setmessages,
        isMsgFetching,
        setisMsgFetching,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
