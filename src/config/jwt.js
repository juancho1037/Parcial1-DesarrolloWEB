import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class JWT {
  static generateToken(payload, expiresIn = "1h") {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

export default JWT;
