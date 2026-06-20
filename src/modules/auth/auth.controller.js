import { createUser, loginUser } from "./auth.service.js";
import { validateLoginData, validateRegisterData } from "./auth.validation.js";
import { env } from "../../config/env.js";
import { signJwt } from "../../utils/signJwt.js";

export async function registerUser(req, res) {
  try {
    const errorMessage = validateRegisterData(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const user = await createUser(req.body);

    if (!user) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const errorMessage = validateLoginData(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const user = await loginUser(req.body);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked",
      });
    }

    const token = signJwt(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export function getMe(req, res) {
  return res.json({
    success: true,
    message: "Private route access allowed",
    data: req.user,
  });
}
