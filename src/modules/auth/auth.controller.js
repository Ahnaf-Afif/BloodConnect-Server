import { createUser } from "./auth.service.js";
import { validateRegisterData } from "./auth.validation.js";

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
