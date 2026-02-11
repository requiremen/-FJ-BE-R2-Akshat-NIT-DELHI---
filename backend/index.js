const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { OAuth2Client } = require('google-auth-library');

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("API is running");
});

const {middleware,authMiddleware} = require("./middleware")
const {Register, transaction: Transaction, Budget} = require("./db")
const { sendBudgetAlert } = require("./emailService");
const zod = require("zod");


app.post("/register",middleware, async function(req,res){
    const { Username, Useremail, Password } = req.validatebody;
    try{
        const existingUser = await Register.findOne({ Useremail });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

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



const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_KEY";

app.post("/auth/google", async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email, sub } = ticket.getPayload();

        let user = await Register.findOne({ Useremail: email });

        if (!user) {
            // Create new user if not exists
            user = await Register.create({
                Username: name,
                Useremail: email,
                googleId: sub
            });
        } else if (!user.googleId) {
            // Link googleId to existing user if not linked
            user.googleId = sub;
            await user.save();
        }

        const jwtToken = jwt.sign({
            id: user._id,
        }, JWT_SECRET);

        res.json({
            msg: 'Google login successful',
            token: jwtToken
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ msg: "Google authentication failed" });
    }
});

app.post("/login",async function(req,res){
    const { Useremail, Password } = req.body;
    
    // Normalize input
    const normalizedEmail = Useremail ? Useremail.trim().toLowerCase() : "";
    const normalizedPassword = Password ? Password.trim() : "";

try{
    const user = await Register.findOne({
        Useremail : normalizedEmail,
        Password : normalizedPassword
    });
    
    if(!user){
        return res.status(400).send({
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

app.get("/profile", authMiddleware, async function(req, res) {
    try {
        const user = await Register.findById(req.userId);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json({
            Username: user.Username,
            Useremail: user.Useremail
        });

    } catch (e) {
        res.status(500).json({ msg: "Server error" });
    }
});

app.get("/transaction/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findOne({ _id: id, userId: req.userId });

        if (!transaction) {
            return res.status(404).json({ msg: "Transaction not found" });
        }

        res.json(transaction);
    } catch (error) {
        console.error("Get Transaction Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

app.post("/transaction", authMiddleware, async (req, res) => {
    try {
        console.log("Received transaction request:", req.body);
        const { type, category, amount, description, date, currency } = req.body;
        
        // Basic validation
        if (!type || !category || amount === undefined || amount === null || isNaN(Number(amount))) {
            console.log("Validation failed:", { type, category, amount });
            return res.status(400).json({ msg: "Please provide type, category and a valid amount" });
        }

        // Handle decimal precision (round to 2 decimals)
        const simpleamount = Math.round(Number(amount) * 100) / 100;

        const newTransaction = await Transaction.create({
            userId: req.userId,
            type,
            category,
            amount: simpleamount,
            currency: currency || 'INR',
            description,
            date: date || Date.now()
        });

        // Check for budget overrun if it's an expense
        if (type === 'expense') {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            // Get user info for email
            const user = await Register.findById(req.userId);
            
            // Get budget for this category
            const budget = await Budget.findOne({ userId: req.userId, category });
            
            if (budget && user) {
                // Calculate total spent in this category for the current month
                const transactions = await Transaction.find({
                    userId: req.userId,
                    category,
                    type: 'expense',
                    date: {
                        $gte: new Date(currentYear, currentMonth, 1),
                        $lt: new Date(currentYear, currentMonth + 1, 0)
                    }
                });
                
                const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);
                
                if (totalSpent > budget.amount) {
                    // Send notification
                    await sendBudgetAlert(
                        user.Useremail, 
                        user.Username, 
                        category, 
                        totalSpent, 
                        budget.amount,
                        currency || 'INR'
                    );
                }
            }
        }

        res.status(201).json({
            msg: "Transaction added successfully",
            transaction: newTransaction
        });
    } catch (error) {
        console.error("Transaction Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

app.put("/transaction/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { type, category, amount, description, date } = req.body;

        const transaction = await Transaction.findOne({ _id: id, userId: req.userId });
        if (!transaction) {
            return res.status(404).json({ msg: "Transaction not found" });
        }

        if (type) transaction.type = type;
        if (category) transaction.category = category;
        if (amount !== undefined) transaction.amount = Math.round(Number(amount) * 100) / 100;
        if (description !== undefined) transaction.description = description;
        if (date) transaction.date = date;

        await transaction.save();

        res.json({
            msg: "Transaction updated successfully",
            transaction
        });
    } catch (error) {
        console.error("Update Transaction Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

app.delete("/transaction/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Transaction.deleteOne({ _id: id, userId: req.userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "Transaction not found" });
        }

        res.json({ msg: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Delete Transaction Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

// Budget Endpoints
app.post("/budget", authMiddleware, async (req, res) => {
    try {
        const { category, amount } = req.body;
        if (!category || !amount) {
            return res.status(400).json({ msg: "Category and amount are required" });
        }

        // Upsert budget (update if exists, insert if not)
        const budget = await Budget.findOneAndUpdate(
            { userId: req.userId, category },
            { amount: Math.round(Number(amount) * 100) / 100 },
            { new: true, upsert: true }
        );

        res.json({ msg: "Budget set successfully", budget });
    } catch (error) {
        console.error("Set Budget Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

app.get("/budget", authMiddleware, async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.userId });
        res.json(budgets);
    } catch (error) {
        console.error("Get Budget Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

app.delete("/budget/:id", authMiddleware, async (req, res) => {
    try {
        await Budget.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        res.json({ msg: "Budget deleted successfully" });
    } catch (error) {
        console.error("Delete Budget Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

app.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
        
        // Calculate totals with precision handling
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);
            
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
            
        const balance = totalIncome - totalExpense;
        
        // Prepare data for charts
        // 1. Monthly Income vs Expense (Last 6 months)
        const monthlyData = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            const monthTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
            });
            
            const income = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((acc, curr) => acc + curr.amount, 0);
            const expense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((acc, curr) => acc + curr.amount, 0);
                
            monthlyData.push({
                name: monthName,
                income: Math.round(income),
                expense: Math.round(expense)
            });
        }

        // 2. Expense Breakdown by Category
        const expenseCategories = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
            });
            
        const categoryData = Object.keys(expenseCategories).map(cat => ({
            name: cat,
            value: Math.round(expenseCategories[cat] * 100) / 100
        }));

        // Round final results
        res.json({
            totalIncome: Math.round(totalIncome * 100) / 100,
            totalExpense: Math.round(totalExpense * 100) / 100,
            balance: Math.round(balance * 100) / 100,
            recentTransactions: transactions.slice(0, 5),
            monthlyData,
            categoryData
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log(`server is running on port ${PORT}`);
})
