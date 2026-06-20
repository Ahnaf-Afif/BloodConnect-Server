import { createUser, loginUser } from "./auth.service.js";
import { validateLoginData, validateRegisterData } from "./auth.validation.js";

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

    return res.json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
