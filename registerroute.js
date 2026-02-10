app.post("/register",middleware, async function(req,res){
    //ok so for now i will be using try and catch block to handle my errors
    const { Username, Useremail, Password } = req.validatebody;
    try{
         await Register.create({
            Username : Username,
            Useremail : Useremail,
            Password : Password
        })
        res.status(200).send({
            msg : "user created successfully",
            
        })
    }catch(err){
        res.status(500).send({
            msg : "internal server error",
            

        })
    }
   
})
// this is the register route which uses zod and middleware for further verification logic and rightnow the backend is functioning on the database 
//- mongoDB
// futher i will be tweaking it to postgres
