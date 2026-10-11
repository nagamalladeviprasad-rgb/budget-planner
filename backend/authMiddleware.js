const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Please log in first.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user payload to req.user (standard Express convention)
    req.user = decoded;
    // Keep req.userId if your codebase specifically relies on it
    req.userId = decoded.userId || decoded.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Login token has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      message: "Invalid login token. Please log in again.",
    });
  }
}

module.exports = authMiddleware;
