const connectUsers = new Map();
let io = null;

const addNewConnectUser = (socketId, userId) => {
  connectUsers.set(socketId, { userId });
  console.log("new user connected");
  console.log(connectUsers);
};

const removeConnectUser = (socketId) => {
  connectUsers.delete(socketId);
  console.log("user disconnected");
  console.log(connectUsers);
};

const getActiveConnections = (userId) => {
  const activeConnections = [];
  connectUsers.forEach((value, key) => {
    if (value.userId === userId) {
      activeConnections.push(key);
    }
  });

  return activeConnections;
};

const getOnlineUsers = () => {
  const onlineUsers = [];
  connectUsers.forEach(({ userId }, socketId) => {
    onlineUsers.push({ socketId, userId });
  });
  return onlineUsers;
};

const setSocketInstance = (ioInstance) => {
  io = ioInstance;
};

const getSocketInstance = () => {
  return io;
};

module.exports = {
  addNewConnectUser,
  removeConnectUser,
  getActiveConnections,
  setSocketInstance,
  getSocketInstance,
  getOnlineUsers,
};
