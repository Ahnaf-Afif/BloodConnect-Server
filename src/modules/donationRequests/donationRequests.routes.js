import express from "express";

import { verifyJwt } from "../../middlewares/verifyJwt.js";
import {
  addDonationRequest,
  getDonationRequestDetails,
  getMyRequests,
  getPublicDonationRequests,
} from "./donationRequests.controller.js";

const router = express.Router();

router.get("/", getPublicDonationRequests);
router.get("/my-requests", verifyJwt, getMyRequests);
router.get("/:id", verifyJwt, getDonationRequestDetails);
router.post("/", verifyJwt, addDonationRequest);

export default router;
