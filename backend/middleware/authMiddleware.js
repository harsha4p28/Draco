const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}; 

module.exports = authMiddleware;
