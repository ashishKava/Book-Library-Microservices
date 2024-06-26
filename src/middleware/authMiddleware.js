import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../model/user.js";

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: "Invalid token." });
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

export default authenticateToken;
