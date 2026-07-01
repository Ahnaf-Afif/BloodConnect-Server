import express from "express";

import { contactsCollection } from "../../database/collections.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const contact = {
      name,
      email,
      message,
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
