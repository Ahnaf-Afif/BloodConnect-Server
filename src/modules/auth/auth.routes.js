import express from "express";

import { getMe, login, logout, registerUser } from "./auth.controller.js";
import { verifyJwt } from "../../middlewares/verifyJwt.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyJwt, getMe);

export default router;
