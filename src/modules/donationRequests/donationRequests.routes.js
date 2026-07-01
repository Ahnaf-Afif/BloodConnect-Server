import express from "express";

import { verifyJwt } from "../../middlewares/verifyJwt.js";
import { verifyRole } from "../../middlewares/verifyRole.js";
import { roles } from "../../constants/roles.js";
import {
  addDonationRequest,
  changeDonationStatus,
  confirmDonation,
  editDonationRequest,
  getAllRequests,
  getDonationRequestDetails,
  getMyRequests,
  getPublicDonationRequests,
  removeDonationRequest,
} from "./donationRequests.controller.js";

const router = express.Router();

router.get("/", getPublicDonationRequests);
router.get(
  "/all",
  verifyJwt,
  verifyRole(roles.admin, roles.volunteer),
  getAllRequests
);
router.get(
  "/my-requests",
  verifyJwt,
  verifyRole(roles.donor),
  getMyRequests
);
router.post(
  "/",
  verifyJwt,
  verifyRole(roles.donor),
  addDonationRequest
);
router.get("/:id", verifyJwt, getDonationRequestDetails);
router.patch(
  "/:id",
  verifyJwt,
  verifyRole(roles.donor, roles.admin),
  editDonationRequest
);
router.delete(
  "/:id",
  verifyJwt,
  verifyRole(roles.donor, roles.admin),
  removeDonationRequest
);
router.patch("/:id/status", verifyJwt, changeDonationStatus);
router.patch("/:id/donate", verifyJwt, confirmDonation);

export default router;
