const JWT_SECRET = "MY_SECRET_KEY";
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ msg: "No token provided or invalid format" });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decodedValue = jwt.verify(token, JWT_SECRET);
        if (decodedValue.userId) {
            req.userId = decodedValue.userId;
        } else if (decodedValue.id) {
            req.userId = decodedValue.id;
        } else {
             return res.status(403).json({ msg: "Invalid token payload" });
        }
        next();
    } catch (e) {
        return res.status(403).json({ msg: "Authentication failed" });
    }
};
