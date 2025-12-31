const authSocketMiddleware = require("./middlewares/authSocketMiddleware");
const addNewUserHandler = require("./socketHandlers/addNewUserHandler");
const disconnectUserHandler = require("./socketHandlers/disconnectUserHandler");
const { setSocketInstance } = require("./serverStore");

const registerServer = (server)=>{
    const io = require("socket.io")(server , {
        cors : { 
            origin : "*",
            methods : ["GET" , "POST"]
        }
    })

    setSocketInstance(io);
    io.use(authSocketMiddleware)

    io.on("connection" , (socket)=>{
        console.log("New client connected" , socket.id);
        addNewUserHandler(socket , io);
        socket.on("disconnect" , ()=>{
            disconnectUserHandler(socket , io);
        })
    })
}


module.exports = registerServer;