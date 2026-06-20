import { getProfile, updateProfile } from "./profiles.service.js";
import { validateProfileUpdate } from "./profiles.validation.js";

export async function getMyProfile(req, res) {
  try {
    const profile = await getProfile(req.user.userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile loaded",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateMyProfile(req, res) {
  try {
    const errorMessage = validateProfileUpdate(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const profile = await updateProfile(req.user.userId, req.body);

    return res.json({
      success: true,
      message: "Profile updated",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
