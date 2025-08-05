const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET loaded:", JWT_SECRET ? "YES" : "NO");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Authorization header missing or malformed");
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token received:", token);

  // Allow dev-bypass-token to bypass real JWT validation
  if (token === "dev-bypass-token") {
    console.log("Bypass token detected: skipping JWT verification.");
    req.user = { id: "dev-user-id" }; // mock user id for dev bypass
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token decoded successfully:", decoded);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
