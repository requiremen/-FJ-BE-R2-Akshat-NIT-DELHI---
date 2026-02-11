app.put("/transaction/:id", authMiddleware , async function(req,res){
    const {amount, category, description} = req.body;
    const cleanAmount = amount ? Math.round(amount * 100) / 100 : undefined;
    const update = await transaction.findOneAndUpdate(
        {userId : req.userId},// security check kar rahe hai yahan pe
        {amount : cleanAmount, category: category, description : description},
        {new : true}
    )
if(!update){
    res.status(400).send({
        msg : "transaction not found"
    })
    return;
}res.json({
    msg : "transaction updated successfully",
    transaction : update
})
