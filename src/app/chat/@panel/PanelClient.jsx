"use client";

import axios from "axios";
import { useEffect, useState, useContext, useMemo } from "react";
import PanelSkeleton from "./PanelSkeleton";
import useFetchUser from "../../../components/fetchUser";
import { useAppContext } from "../../../context/AppContext";
import { getModifiedTime } from "../../../components/getTime";

const PanelClient = ({ pastChats }) => {
  const userData = useFetchUser();
  const {
    socket,
    allUsers,
    setchatId,
    setmessages,
    setreceiverId,
    setreceiverName,
    isPanelOpen,
    isSmallScreen,
    setisPanelOpen,
    hadPastChatsWith,
    sethadPastChatsWith,
    setisMsgFetching,
  } = useAppContext();

  // console.log(pastChats);
  // console.log(userData);
  const [userToFind, setuserToFind] = useState("");
  let chatId;
  const matchedUsers = useMemo(() => {
    if (!userToFind) return [];
    return allUsers.filter((user) => user.username.includes(userToFind));
  }, [userToFind]);

  useEffect(() => {
    if (pastChats && userData && pastChats.length != 0) {
      pastChats.forEach((chat) => {
        let chattedwith = chat.members.filter((m) => {
          return m._id !== userData._id;
        });
        let unseenMsgs = chat.messages.filter((m) => {
          return m.isViewed === false && m.senderId != userData._id;
        });
        chattedwith = [
          {
            ...chattedwith[0],
            lastMsg: chat.messages.at(-1).message,
            postedAt: getModifiedTime(chat.messages.at(-1).postedAt),
            totalUnseenMsgs: unseenMsgs.length,
          },
        ];
        sethadPastChatsWith((prev) => [...prev, ...chattedwith]);
      });
    }
  }, [userData]);

  const startChat = async (user) => {
    // console.log(user);
    setisPanelOpen(false);
    setmessages([]);
    setreceiverName(user.username);
    setreceiverId(user._id);
    setisMsgFetching(true);
    sethadPastChatsWith((prev) =>
      prev.map((chat) =>
        chat._id === user._id ? { ...chat, totalUnseenMsgs: 0 } : chat
      )
    );

    await axios
      .get("/api/chat", { params: { receiverId: user._id } })
      .then((res) => {
        console.log(res);

        // TODO:
        // setup middleware
        // complete startChat;
        chatId = res.data.data._id;
        setchatId(chatId);

        if (res.data.message === "Old Chat found") {
          res.data.data.messages.forEach((m) => {
            setmessages((prev) => [
              ...prev,
              {
                messageId: m._id,
                text: m.message,
                type: m.senderId === user._id ? "received" : "sent",
                isViewed: m.isViewed,
                postedAt: getModifiedTime(m.postedAt),
              },
            ]);
          });
        }
      })
      .catch((err) => console.log(err));
    setisMsgFetching(false);
    await axios
      .patch("/api/chat", { chatId })
      .then((res) => {
        console.log(res);
        socket.emit("message-viewed", { receiver: user.username });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div
      className={`flex flex-col text-white bg-[#131313] justify-between ${
        isSmallScreen
          ? isPanelOpen
            ? "w-[100vw]"
            : "hidden"
          : "sm:w-[35vw] md:w-[60vw] xl:w-[30vw]"
      }`}
    >
      {/* <Component1 /> */}
      {/* Search Bar */}
      <div className="p-[4px_16px] mb-4 text-white">
        <div
          className={`h-12 content-center ml-3 ${
            isSmallScreen ? "" : "justify-items-center"
          }`}
        >
          <p className="text-3xl font-bold">RelayRoom</p>
        </div>
        <form className="flex items-center mt-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
              className="bg-black border-b-2 border-b-[#ffa100] text-sm rounded-lg block w-full ps-10 p-2.5"
              onChange={(e) => setuserToFind(e.target.value)}
              placeholder="Search global users"
              required
            />
          </div>
        </form>
      </div>
      {/* Chat History and Search Results */}
      <div className="historyPanel h-full overflow-y-auto p-[2px_20px] border-t-1 border-gray-300 pt-4">
        <div className="flex flex-col gap-2">
          {userToFind ? (
            matchedUsers.length > 0 ? (
              matchedUsers.map((user, i) => (
                <div className="div1" key={i} onClick={() => startChat(user)}>
                  <div className="div2">{user.username[0].toUpperCase()}</div>
                  <p className="">{user.username}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-2xl">No user found</p>
            )
          ) : hadPastChatsWith.length > 0 ? (
            <>
              <p className="medium text-xl ml-4 mb-2">Past Chats</p>
              {hadPastChatsWith.map((user, i) => (
                <div
                  className={`div1 ${
                    // user.username === receiverToSend ? "bg-gray-800" : ""
                    user.totalUnseenMsgs > 0 ? "bg-gray-800" : ""
                  }`}
                  key={i}
                  onClick={() => startChat(user)}
                >
                  <div className="div2">{user.username[0].toUpperCase()}</div>
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <p className="text-xl">{user.username}</p>
                      {user.totalUnseenMsgs > 0 ? (
                        <p className="bg-[#ffa100] rounded-full px-3 py-1">
                          {user.totalUnseenMsgs}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-[1.0625rem]">
                        {user.lastMsg.length > 20
                          ? `${user.lastMsg.slice(0, 19)}...`
                          : `${user.lastMsg}`}
                      </p>
                      <span className="text-sm">{user.postedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : pastChats.length == 0 ? (
            <>
              <p className="medium text-xl ml-4 mb-2">Past Chats</p>
              <p className="text-center text-2xl">No Chat found</p>
            </>
          ) : (
            <div className="flex flex-col gap-y-3">
              <PanelSkeleton />
              <PanelSkeleton />
              <PanelSkeleton />
              <PanelSkeleton />
              <PanelSkeleton />
              <PanelSkeleton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelClient;
