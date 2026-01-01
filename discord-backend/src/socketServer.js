const authSocketMiddleware = require("./middlewares/authSocketMiddleware");
const addNewUserHandler = require("./socketHandlers/addNewUserHandler");
const disconnectUserHandler = require("./socketHandlers/disconnectUserHandler");
const { setSocketInstance, getOnlineUsers } = require("./serverStore");

const registerServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  setSocketInstance(io);
  io.use(authSocketMiddleware);

  const emitOnlineUsers = () => {
    const onlineUsers = getOnlineUsers();
    console.log("online-users", onlineUsers);
    io.emit("online-users", { onlineUsers });
  };

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);
    addNewUserHandler(socket, io);
    emitOnlineUsers();
    socket.on("disconnect", () => {
      disconnectUserHandler(socket, io);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, 8000);
};

module.exports = registerServer;
