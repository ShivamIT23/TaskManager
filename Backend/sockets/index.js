// sockets/index.js
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const userSockets = new Map();

function setupSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"]
    }
  });

  // Middleware for JWT token authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.userId;
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    userSockets.set(userId, socket.id);
    console.log(`🟢 User connected: ${userId}`);

    socket.on("disconnect", () => {
      userSockets.delete(userId);
      console.log(`❌ User disconnected: ${userId}`);
    });
  });

  // Make available to your app
  app.set("io", io);
  app.set("userSockets", userSockets);
}

module.exports = setupSocket;
