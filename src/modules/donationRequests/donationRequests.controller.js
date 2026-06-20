import { createDonationRequest } from "./donationRequests.service.js";
import { validateDonationRequest } from "./donationRequests.validation.js";

export async function addDonationRequest(req, res) {
  try {
    const errorMessage = validateDonationRequest(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const result = await createDonationRequest(req.user.userId, req.body);

    if (result.error) {
      return res.status(403).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Donation request created",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
