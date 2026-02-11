//login route
const JWT_SECRET = "MY_SECRET_KEY";
app.post("/login",loginmiddleware,async function(req,res){
    const { Useremail, Password } = req.body;
try{
    const user = await Register.findOne({
        Useremail : Useremail,
        Password : Password
    });
    if(!user){
        res.status(400).send({
            msg : "invalid email or password"


        })
    }
const token  = jwt.sign({
    id : user._id,
},JWT_SECRET);
 res.json({
    msg: 'login successful',
    token: token
 })
}catch(err){
    res.status(500).send({
        msg : "internal server error"
    })
}


})
app.listen(3000,function(){
    console.log("server is running on port 3000");
})
