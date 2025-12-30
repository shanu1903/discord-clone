const jwt = require('jsonwebtoken');

const validateToken = (req , res , next)=>{
    let token = req.body.token || req.query.token || req.headers['authorization'];
    if(!token){
        return res.status(403).send("A token is required for authentication");
    }
    try{
        token = token.replace(/^Bearer\s+/, "");
        const decorded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decorded;
    }catch(err){
        return res.status(401).send("Invalid Token");
    }
    next();
}

module.exports = validateToken;