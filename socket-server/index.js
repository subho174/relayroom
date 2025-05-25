import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import { getToken } from "next-auth/jwt";

dotenv.config();
const PORT = process.env.PORT || 10000;

const httpServer = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Socket server is alive");
  } else {
    res.writeHead(404);
    res.end();
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: ["https://relayroom.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

io.use(async (socket, next) => {
  try {
    const token = await getToken({
      req: {
        headers: {
          cookie: socket.request.headers.cookie || "",
          authorization: socket.handshake.headers.authorization,
        },
      },
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) return next(new Error("Unauthorized"));
    socket.user = token;
    next();
  } catch (err) {
    console.error("Auth failed:", err.message);
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  const user = socket.handshake.query.user;
  userSocketMap[user] = socket.id;
  console.log("User connected:", user);

  socket.on(
    "chat",
    ({ messageId, senderId, message, receiver, isViewed, postedAt }) => {
      const receiverId = userSocketMap[receiver];
      if (receiverId) {
        socket.to(receiverId).emit("chat", {
          messageId,
          senderId,
          message,
          isViewed,
          postedAt,
        });
      } else {
        console.log(`${receiver} not connected now`);
      }
    }
  );

  socket.on("message-viewed", ({ receiver }) => {
    const receiverId = userSocketMap[receiver];
    if (receiverId) socket.to(receiverId).emit("message-viewed");
  });

  socket.on("disconnect", () => {
    if (user && userSocketMap[user]) delete userSocketMap[user];
    console.log("User disconnected:", user);
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket server running on port ${PORT}`);
});
