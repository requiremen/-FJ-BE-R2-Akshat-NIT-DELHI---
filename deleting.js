app.delete("/category/:categoryName", authMiddleware, async (req, res) => {
    const { categoryName } = req.params;

    try {
        
        await Transaction.updateMany(
            { userId: req.userId, category: categoryName },
            { category: "Uncategorized" }
        );

        res.json({ msg: `Category '${categoryName}' removed. Transactions moved to Uncategorized.` });
    } catch (e) {
        res.status(500).json({ msg: "Failed to update transactions during category deletion" });
    }
});
