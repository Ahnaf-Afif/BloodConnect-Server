import express from "express";

import { contactsCollection } from "../../database/collections.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Email is not valid",
      });
    }

    if (cleanName.length > 80 || cleanMessage.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Contact message is too long",
      });
    }

    const contact = {
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      createdAt: new Date(),
    };

    const result = await contactsCollection().insertOne(contact);

    return res.status(201).json({
      success: true,
      message: "Message sent",
      data: {
        _id: result.insertedId,
        ...contact,
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
