// writing the middleware of the register backend
const jwt = require("jsonwebtoken");
const {registerSshema} = require("./zod")
const middleware = function(req,res,next){
    const body = ({ 
        Username : req.body.Username,
        Useremail : req.body.Useremail,
        Password : req.body.Password
    })
    const parsingbody = registerSshema.safeParse(body);
    if(!parsingbody.success){
        res.status(400).send({
            msg : "invalid data"
        })
        return;
      } 
      req.validatebody = parsingbody.data;
      
        next();
    
}
module.exports = {
    middleware : middleware
    
}
