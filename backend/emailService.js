const nodemailer = require("nodemailer");

// Create reusable transporter object using the default SMTP transport
// For real use, replace with SendGrid, Mailgun, or Gmail with App Password
const transporter = nodemailer.createTransport({
    service: 'gmail', // or use host/port for other providers
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBudgetAlert = async (email, username, category, spent, budget, currency) => {
    try {
        // If credentials aren't set, log and skip (prevents crash in dev)
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log("Email credentials missing. Skipping notification.");
            console.log(`[MOCK EMAIL] To: ${email} | Subject: Budget Alert: ${category} | Msg: You've exceeded your budget!`);
            return;
        }

        const info = await transporter.sendMail({
            from: '"Expense Tracker" <noreply@expensetracker.com>', // sender address
            to: email, // list of receivers
            subject: `⚠️ Budget Alert: You've exceeded your ${category} budget!`, // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #e11d48;">Budget Alert</h2>
                    <p>Hi ${username},</p>
                    <p>You have exceeded your budget for <strong>${category}</strong>.</p>
                    <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Budget:</strong> ${currency} ${budget}</p>
                        <p style="margin: 5px 0;"><strong>Total Spent:</strong> ${currency} ${spent}</p>
                        <p style="margin: 5px 0; color: #e11d48;"><strong>Over by:</strong> ${currency} ${(spent - budget).toFixed(2)}</p>
                    </div>
                    <p>Log in to your dashboard to review your expenses.</p>
                </div>
            `,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = { sendBudgetAlert };
