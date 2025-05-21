import { Server } from "socket.io";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

const ioHandler = async (req, res) => {
  if (!res.socket.server.io) {
    console.log("Starting Socket.io server...");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        // origin: process.env.NEXT_PUBLIC_CLIENT_URL,
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    const userSocketMap = {};
    io.use(async (socket, next) => {
      try {
        // const token = await getToken({
        //   req: socket.request,
        //   secret: process.env.NEXTAUTH_SECRET,
        //   raw: true,
        // });
        const token = await getToken({
          req: {
            headers: {
              cookie: socket.request.headers.cookie || "",
              authorization: socket.handshake.headers.authorization,
            },
          },
          secret: process.env.NEXTAUTH_SECRET,
        });
        // const token = socket.handshake.headers.authorization.replace('Bearer ', '')

        // if (!token) return next(new Error("Unauthorized"));
        // const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);

        // console.log(decoded);
        socket.user = token;
        next();
      } catch (err) {
        next(new Error("Authentication failed"));
        // socket.disconnect(true);
        // console.error("Socket authentication failed:", err.message);
        // socket.emit("auth_error", {
        //   message: "Unauthorized: Please login again",
        // });
        // socket.disconnect(true);
      }
    });

    io.on("connection", (socket) => {
      try {
        console.log("User connected:", socket.user);
        const user = socket.handshake.query.user;
        userSocketMap[user] = socket.id;
        console.log(userSocketMap);

        socket.on(
          "chat",
          ({ messageId, senderId, message, receiver, isViewed, postedAt }) => {
            // console.log(userId);
            console.log(receiver);
            console.log(userSocketMap);

            const receiverId = userSocketMap[receiver];
            console.log(receiverId);
            if (receiverId)
              socket.to(receiverId).emit("chat", {
                messageId,
                senderId,
                message,
                isViewed,
                postedAt,
              });
            else console.log(`${receiver} not connected now`);
            // console.log(userId, receiverId, userSocketMap);
          }
        );

        socket.on("message-viewed", ({ receiver }) => {
          console.log(receiver);
          const receiverId = userSocketMap[receiver];
          console.log(receiverId);
          if (receiverId) socket.to(receiverId).emit("message-viewed");
          else console.log(`${receiver} not connected now`);
        });

        socket.on("disconnect", () => {
          if (user && userSocketMap[user]) {
            delete userSocketMap[user];
            console.log(userSocketMap);
          }
          console.log("User disconnected:", socket.user);
        });
      } catch (error) {
        console.error(error);
      }
    });

    res.socket.server.io = io;
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
