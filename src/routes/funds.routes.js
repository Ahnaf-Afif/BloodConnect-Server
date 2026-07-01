import express from "express";
import { ObjectId } from "mongodb";

import {
  fundsCollection,
  usersCollection,
} from "../../database/collections.js";
import { env } from "../config/env.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = express.Router();

router.get("/", verifyJwt, async (req, res) => {
  try {
    const items = await fundsCollection()
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({
      success: true,
      message: "Funds loaded",
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/checkout", verifyJwt, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    if (!env.stripeSecret) {
      return res.status(400).json({
        success: false,
        message: "Stripe is not configured",
      });
    }

    const body = new URLSearchParams({
      mode: "payment",
      "payment_method_types[0]": "card",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][product_data][name]": "BloodConnect Fund",
      "line_items[0][price_data][unit_amount]": String(amount * 100),
      "line_items[0][quantity]": "1",
      success_url: `${env.clientUrl}/funding?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientUrl}/funding?canceled=true`,
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.stripeSecret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const session = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: session.error?.message || "Stripe error",
      });
    }

    return res.json({
      success: true,
      message: "Checkout session created",
      data: { url: session.url },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/confirm", verifyJwt, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Stripe session id is required",
      });
    }

    if (!env.stripeSecret) {
      return res.status(400).json({
        success: false,
        message: "Stripe is not configured",
      });
    }

    const oldFund = await fundsCollection().findOne({
      stripeSessionId: sessionId,
    });

    if (oldFund) {
      return res.json({
        success: true,
        message: "Fund already saved",
        data: oldFund,
      });
    }

    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${env.stripeSecret}`,
        },
      }
    );
    const session = await response.json();

    if (!response.ok || session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment is not completed",
      });
    }

    const user = await usersCollection().findOne({
      _id: new ObjectId(req.user.userId),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const fund = {
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      amount: session.amount_total / 100,
      stripeSessionId: session.id,
      createdAt: new Date(),
    };

    const result = await fundsCollection().insertOne(fund);

    return res.status(201).json({
      success: true,
      message: "Fund saved",
      data: {
        _id: result.insertedId,
        ...fund,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
