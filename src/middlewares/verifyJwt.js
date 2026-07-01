import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { env } from "../config/env.js";
import { usersCollection } from "../../database/collections.js";

export async function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const token = req.cookies?.token || headerToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (!ObjectId.isValid(decoded.userId)) {
      throw new Error("Invalid user id");
    }

    const user = await usersCollection().findOne({
      _id: new ObjectId(decoded.userId),
    });

    if (!user || user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked or unavailable",
      });
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}
