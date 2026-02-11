app.post("/transaction", authMiddleware , async function(req,res){
    const { type, category, amount, description} = req.body;
    // ab hum edge case handle karenge decimal precison ke liye 
    const cleanamount  = Math.round(amount * 100) / 100;
    const trascationpayload = await transaction.create({
    userId : req.userId,
    type : type,
    category : category,
    amount : cleanamount,
    description : description
})
res.json({
    msg : "transaction created successfully",
    id : trascationpayload._id
})

})
