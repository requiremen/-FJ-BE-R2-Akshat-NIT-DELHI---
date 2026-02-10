const mongoose = require("mongoose");

console.log("Attempting to connect...");
mongoose.connect("mongodb+srv://231220006_db_user:0wwdedIYobR3LHeq@cluster0.t0f6t7g.mongodb.net/personaltracker")
    .then(() => {
        console.log("Connected to MongoDB successfully!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });
