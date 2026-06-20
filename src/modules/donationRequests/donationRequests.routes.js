import express from "express";

import { verifyJwt } from "../../middlewares/verifyJwt.js";
import { addDonationRequest } from "./donationRequests.controller.js";

const router = express.Router();

router.post("/", verifyJwt, addDonationRequest);

export default router;
