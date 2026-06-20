import express from "express";

import { verifyJwt } from "../../middlewares/verifyJwt.js";
import { getMyProfile, updateMyProfile } from "./profiles.controller.js";

const router = express.Router();

router.get("/me", verifyJwt, getMyProfile);
router.patch("/me", verifyJwt, updateMyProfile);

export default router;
