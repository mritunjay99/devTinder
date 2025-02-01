const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    //handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName + " joined room:" + roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      ({ firstName, userId, targetUserId, newMessage }) => {
        const roomId = [userId, targetUserId].sort().join("_");
        console.log(
          firstName + " sent message:" + newMessage + " to room:" + roomId
        );
        io.to(roomId).emit("messageReceived", { firstName, newMessage });
      }
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = initializeSocket;
