import {
  createDonationRequest,
  deleteDonationRequest,
  donateToRequest,
  getAllDonationRequests,
  getDonationRequestById,
  getMyDonationRequests,
  getPendingDonationRequests,
  updateDonationRequest,
  updateDonationStatus,
} from "./donationRequests.service.js";
import { donationStatuses } from "../../constants/donationStatuses.js";
import { validateDonationRequest } from "./donationRequests.validation.js";

function hasInvalidStatus(status) {
  return status && !Object.values(donationStatuses).includes(status);
}

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

export async function getPublicDonationRequests(req, res) {
  try {
    const result = await getPendingDonationRequests(req.query);

    return res.json({
      success: true,
      message: "Pending donation requests loaded",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getMyRequests(req, res) {
  try {
    if (hasInvalidStatus(req.query.status)) {
      return res.status(400).json({
        success: false,
        message: "Status filter is not valid",
      });
    }

    const result = await getMyDonationRequests(req.user.userId, req.query);

    return res.json({
      success: true,
      message: "My donation requests loaded",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllRequests(req, res) {
  try {
    if (hasInvalidStatus(req.query.status)) {
      return res.status(400).json({
        success: false,
        message: "Status filter is not valid",
      });
    }

    const result = await getAllDonationRequests(req.query);

    return res.json({
      success: true,
      message: "All donation requests loaded",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getDonationRequestDetails(req, res) {
  try {
    const request = await getDonationRequestById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Donation request not found",
      });
    }

    return res.json({
      success: true,
      message: "Donation request loaded",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function editDonationRequest(req, res) {
  try {
    const errorMessage = validateDonationRequest(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const result = await updateDonationRequest(
      req.params.id,
      req.user.userId,
      req.user.role,
      req.body
    );

    if (result.error) {
      return res.status(403).json({
        success: false,
        message: result.error,
      });
    }

    return res.json({
      success: true,
      message: "Donation request updated",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function removeDonationRequest(req, res) {
  try {
    const result = await deleteDonationRequest(
      req.params.id,
      req.user.userId,
      req.user.role
    );

    if (result.error) {
      return res.status(403).json({
        success: false,
        message: result.error,
      });
    }

    return res.json({
      success: true,
      message: "Donation request deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function changeDonationStatus(req, res) {
  try {
    const { status } = req.body;
    const allowedStatuses = Object.values(donationStatuses);

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status is not valid",
      });
    }

    const result = await updateDonationStatus(
      req.params.id,
      req.user.userId,
      req.user.role,
      status
    );

    if (result.error) {
      return res.status(403).json({
        success: false,
        message: result.error,
      });
    }

    return res.json({
      success: true,
      message: "Status updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function confirmDonation(req, res) {
  try {
    const result = await donateToRequest(req.params.id, req.user.userId);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    return res.json({
      success: true,
      message: "Donation confirmed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
