const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URL || "mongodb+srv://231220006_db_user:0wwdedIYobR3LHeq@cluster0.t0f6t7g.mongodb.net/personaltracker";

mongoose.connect(mongoUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
const registerSchema = new mongoose.Schema({
    Username : String,
    Useremail : String,
    Password : {
        type: String,
        required: false // Optional for Google Auth users
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    preferredCurrency: {
        type: String,
        default: 'INR'
    }
})
const transactionSchema  = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "resgisterdata",
        required : true
    },
    type : {
        type : String,
        enum : ["income","expense"],
        required : true
    },
    category : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        required : true 
    },
    currency: {
        type: String,
        default: 'INR'
    },
    receiptUrl: String,
    description : String,
    date : {
        type : Date,
        default : Date.now
    }


})

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "resgisterdata",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

const transaction = mongoose.model("transactiondata",transactionSchema)
const Register = mongoose.model("resgisterdata",registerSchema)
const Budget = mongoose.model("budgetdata", budgetSchema)

module.exports = {
    Register: Register,
    transaction:transaction,
    Budget: Budget
}
