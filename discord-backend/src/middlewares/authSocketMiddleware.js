const jwt = require('jsonwebtoken');


const validateSocketToken = (socket , next) =>{
    let token = socket.handshake.auth?.token;
    try{
        const decodedData = jwt.verify(token , process.env.JWT_SECRET);
        socket.user = decodedData;
    } catch(err){
        return next(new Error("Invalid Token"));
    }
    next();
}


module.exports = validateSocketToken;

