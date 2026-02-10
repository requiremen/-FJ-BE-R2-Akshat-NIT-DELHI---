// writing the middleware of the register backend
const jwt = require("jsonwebtoken");
const {registerSchema} = require("./zod")


const middleware = function(req,res,next){
    const body = ({ 
        Username : req.body.Username,
        Useremail : req.body.Useremail ? req.body.Useremail.trim().toLowerCase() : req.body.Useremail,
        Password : req.body.Password ? req.body.Password.trim() : req.body.Password
    })
    const parsingbody = registerSchema.safeParse(body);
    if(!parsingbody.success){
        res.status(400).send({
            msg : "invalid data"
        })
        return;
      } 
      req.validatebody = parsingbody.data;
      
        next();
    
}

const JWT_SECRET = "MY_SECRET_KEY";
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ msg: "No token provided or invalid format" });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decodedValue = jwt.verify(token, JWT_SECRET);
        if (decodedValue.userId) {
            req.userId = decodedValue.userId;
        } else if (decodedValue.id) {
            req.userId = decodedValue.id;
        } else {
             return res.status(403).json({ msg: "Invalid token payload" });
        }
        next();
    } catch (e) {
        return res.status(403).json({ msg: "Authentication failed" });
    }
};

module.exports = {
    middleware : middleware,
    authMiddleware : authMiddleware
}
