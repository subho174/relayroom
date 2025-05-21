"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Clock3, CheckCheck, Check } from "lucide-react";
import ChatSkeleton from "./ChatSkeleton";
import { useAppContext } from "../../../context/AppContext";
import { getModifiedTime } from "../../../components/getTime";
import { toast } from "sonner";

const ChatInterFaceClient = ({ users }) => {
  const {
    socket,
    allUsers,
    receiverId,
    receiverName,
    chatId,
    messages,
    setmessages,
    isSmallScreen,
    isPanelOpen,
    sethadPastChatsWith,
    Toast,
    isMsgFetching,
  } = useAppContext();

  useEffect(() => {
    users.forEach(({ _id, username }) => {
      allUsers.push({ _id, username });
    });
  }, []);
  console.log(receiverName);

  const [isMsgSent, setisMsgSent] = useState(true);

  const bottomRef = useRef(null);
  const [message, setmessage] = useState("");
  const [file, setfile] = useState("");
  // const inputRef = useRef(null);
  const receiverIdRef = useRef(receiverId);

  useEffect(() => {
    receiverIdRef.current = receiverId; // Update the ref whenever receiverId changes
  }, [receiverId]);

  useEffect(() => {
    if (!socket) return;
    socket.on(
      "chat",
      ({ messageId, senderId, message, isViewed, postedAt }) => {
        const receivedMessage = {
          messageId,
          text: message,
          type: "received",
          isViewed,
          postedAt,
        };
        console.log("message for you");

        sethadPastChatsWith((prev) =>
          prev.map((chat) =>
            chat._id === senderId
              ? { ...chat, lastMsg: message, postedAt }
              : chat
          )
        );
        if (senderId === receiverIdRef.current) {
          setmessages((prev) => [...prev, receivedMessage]);
          axios
            .patch("/api/chat", { chatId })
            .then((res) => {
              console.log(res);
              socket.emit("message-viewed", { receiver: receiverName });
            })
            .catch((e) => {
              console.error(e);
            });
        } else {
          sethadPastChatsWith((prev) =>
            prev.map((chat) =>
              chat._id === senderId
                ? { ...chat, totalUnseenMsgs: chat.totalUnseenMsgs + 1 }
                : chat
            )
          );
          // Toast.fire({
          //   icon: "info",
          //   title: "New Message",
          // });
          toast.info("New Message", {
            position: "top-right",
          });
        }
      }
    );
    socket.on("message-viewed", () => {
      axios
        .get("/api/chat", { params: { receiverId: receiverIdRef.current } })
        .then((res) => {
          console.log(res);
          setmessages([]);
          if (res.data.message === "Old Chat found") {
            res.data.data.messages.forEach((m) => {
              setmessages((prev) => [
                ...prev,
                {
                  messageId: m._id,
                  text: m.message,
                  type:
                    m.senderId === receiverIdRef.current ? "received" : "sent",
                  isViewed: m.isViewed,
                  postedAt: getModifiedTime(m.postedAt),
                },
              ]);
            });
          }
        })
        .catch((err) => console.log(err));
    });

    return () => {
      socket.off("chat");
      socket.off("message-viewed");
    };
  }, [chatId]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newConnection", (props) => {
      console.log(props);
    });
    return () => {
      socket.off("newConnection");
    };
  }, [socket]);

  const submit = (e) => {
    e.preventDefault();
    setisMsgSent(false);
    const newMessage = {
      text: message,
      type: "sent",
    };
    setmessages((prev) => [...prev, newMessage]);
    axios
      .post("/api/chat", { receiverId, message, file })
      .then((res) => {
        console.log(res);
        setisMsgSent(true);
        let { _id, senderId, isViewed, postedAt } = res.data.data.finalMessage;
        postedAt = getModifiedTime(postedAt);
        socket.emit("chat", {
          messageId: _id,
          senderId,
          message,
          receiver: receiverName,
          isViewed,
          postedAt,
        });
        setmessages((msg) => [
          ...msg.slice(0, -1),
          { ...msg.at(-1), messageId: _id, senderId, isViewed, postedAt },
        ]);
        sethadPastChatsWith((prev) =>
          prev.map((chat) =>
            chat._id === receiverId
              ? { ...chat, lastMsg: message, postedAt }
              : chat
          )
        );
        setmessage("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div
      className={`bg-[#1f1f1f] ${
        isSmallScreen ? (isPanelOpen ? "hidden" : "w-[100vw]") : ""
      } sm:w-[65vw] xl:w-[75vw] text-white`}
    >
      <div className=" h-[100vh] flex flex-col justify-between">
        {receiverId ? (
          <>
            <header className="w-full fixed top-0 border-b-1 border-gray-300">
              <div className="flex p-[15px_20px] gap-2 items-center">
                <p className="h-8 w-8 flex justify-center items-center rounded-[50%] text-black bg-[#fbaf03]">
                  {receiverName ? receiverName[0].toUpperCase() : "U"}
                </p>
                <p className="text-xl">
                  {receiverName ? receiverName : "User"}
                </p>
              </div>
            </header>
            <section className="chat-box mt-16 flex flex-col gap-y-3 h-full p-[25px] lg:p-[10px_80px] xl:p-[10px_140px] overflow-y-auto">
              {messages.length > 0 ? (
                messages.map((m, index) => {
                  return (
                    <div
                      key={index}
                      ref={index === messages.length - 1 ? bottomRef : null}
                      className={
                        m.type === "sent"
                          ? "flex flex-col items-end"
                          : "flex items-start"
                      }
                    >
                      <div
                        className={`flex flex-col gap-1 min-w-[140px] max-w-[280px] ${
                          // m.type !== "sent" ? "bg-zinc-200" : "bg-primary-300"
                          m.type !== "sent" ? "bg-white" : "bg-[#fbaf03]"
                        } rounded-e-xl rounded-es-xl text-[#1c1c1c]`}
                      >
                        <div className="flex flex-col gap-2 leading-1.5 px-4 py-2 border-gray-200">
                          <p className="text-base font-normal"> {m.text}</p>
                          <span className="text-[11px] text-end font-normal">
                            {m.postedAt}
                          </span>
                        </div>
                      </div>
                      {m.type === "sent" &&
                        (m.isViewed ? (
                          <CheckCheck className="w-5 h-5 mt-1" />
                        ) : m.messageId ? (
                          <Check className="w-5 h-5 mt-1" />
                        ) : !isMsgSent ? (
                          <Clock3 className="w-5 h-5 mt-1" />
                        ) : (
                          <Check className="w-5 h-5 mt-1" />
                        ))}
                    </div>
                  );
                })
              ) : isMsgFetching ? (
                <>
                  <div className="flex justify-end">
                    <ChatSkeleton />
                  </div>
                  <div className="flex justify-start">
                    <ChatSkeleton />
                  </div>
                  <div className="flex justify-end">
                    <ChatSkeleton />
                  </div>
                  <div className="flex justify-start">
                    <ChatSkeleton />
                  </div>
                </>
              ) : (
                "No Old Messages"
              )}
              {/* <div ref={bottomRef} /> */}
            </section>
            {/* </section> */}
            <footer className="mb-4 p-[25px] pt-0 lg:p-[0px_80px_10px_80px] xl:p-[0px_140px_10px_140px]">
              <form onSubmit={submit}>
                <label htmlFor="chat" className="sr-only">
                  Your message
                </label>
                <div className="flex items-center px-3 py-5 rounded-lg border-1 border-[#ffa100]">
                  {/* <label htmlFor="file-attachment" className="style">
                    <i className="fa-solid fa-paperclip"></i>
                  </label>
                  <input type="file" id="file-attachment" className="hidden" />
                  <label htmlFor="file-image" className="style">
                    <i className="fa-solid fa-image text-xl"></i>
                  </label>
                  <input
                    type="file"
                    // id="file-image"
                    // accept="image/*"
                    id="file-attachment"
                    className="hidden"
                    onChange={(e) => {
                      setfile(e.target.files[0]);
                    }}
                  /> */}
                  <textarea
                    id="chat"
                    rows="1"
                    name="message"
                    className="block mx-4 p-2.5 w-full text-sm bg-black rounded-lg border-b-2 border-b-[#ffa100] outline-none"
                    placeholder="Your message..."
                    onChange={(e) => setmessage(e.target.value)}
                    value={message}
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="inline-flex justify-center p-2 rounded-full cursor-pointer hover:bg-[#fbaf03]"
                  >
                    <svg
                      className="w-5 h-5 rotate-90 rtl:-rotate-90"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                    <span className="sr-only">Send message</span>
                  </button>
                </div>
              </form>
            </footer>
          </>
        ) : (
          <div className="h-full justify-items-center content-center">
            <i className="fa-solid fa-comments text-2xl"></i>
            <p className="font-medium text-2xl mt-2">Start Chat</p>
            <p className="w-[80%] md:w-[60%] lg:w-[40%] text-center text-[18px] mt-4">
              Start a conversation by selecting a contact or creating a new
              chat. Your messages will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterFaceClient;
