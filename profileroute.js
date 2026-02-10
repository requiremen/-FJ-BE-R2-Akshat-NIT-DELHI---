app.get("/profile", authMiddleware, async function(req, res) {
    console.log("Accessing profile with userId:", req.userId);
    try {
        const user = await Register.findById(req.userId);
        console.log("Found user:", user);


        if (!user) {
            return res.status(404).json({ msg: "User not found", userId: req.userId });
        }
        res.json({
            Username: user.Username,
            Useremail: user.Useremail
        });

    } catch (e) {
        res.status(500).json({ msg: "Server error" });
    }
});
