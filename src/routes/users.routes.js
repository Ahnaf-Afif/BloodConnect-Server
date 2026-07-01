import express from "express";
import { ObjectId } from "mongodb";

import {
  donationRequestsCollection,
  fundsCollection,
  usersCollection,
} from "../../database/collections.js";
import { roles } from "../constants/roles.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { buildPagination } from "../utils/buildPagination.js";

const router = express.Router();

function cleanUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bloodGroup: user.bloodGroup,
    district: user.district,
    upazila: user.upazila,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
}

router.get("/search", async (req, res) => {
  try {
    const hasSearch =
      req.query.bloodGroup || req.query.district || req.query.upazila;

    if (!hasSearch) {
      return res.json({
        success: true,
        message: "Choose search options",
        data: [],
      });
    }

    const filter = {
      role: roles.donor,
      status: "active",
    };

    if (req.query.bloodGroup) {
      filter.bloodGroup = req.query.bloodGroup.trim();
    }

    if (req.query.district) {
      filter.district = req.query.district.trim();
    }

    if (req.query.upazila) {
      filter.upazila = req.query.upazila.trim();
    }

    const items = await usersCollection().find(filter).toArray();

    return res.json({
      success: true,
      message: "Donors loaded",
      data: items.map(cleanUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get(
  "/stats",
  verifyJwt,
  verifyRole(roles.admin, roles.volunteer),
  async (req, res) => {
    try {
      const totalUsers = await usersCollection().countDocuments({
        role: roles.donor,
      });
      const requestGroups = await donationRequestsCollection()
        .aggregate([
          {
            $group: {
              _id: "$donationStatus",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();
      const fundingResult = await fundsCollection()
        .aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ])
        .toArray();

      const requestStats = {
        pending: 0,
        inprogress: 0,
        done: 0,
        canceled: 0,
      };

      requestGroups.forEach((item) => {
        requestStats[item._id] = item.count;
      });

      const totalRequests = requestGroups.reduce(
        (total, item) => total + item.count,
        0
      );
      const totalFunding = fundingResult[0]?.total || 0;

      return res.json({
        success: true,
        message: "Stats loaded",
        data: {
          totalUsers,
          totalRequests,
          totalFunding,
          requestStats,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.get("/", verifyJwt, verifyRole(roles.admin), async (req, res) => {
  try {
    const { page, limit, skip } = buildPagination(req.query);
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const users = usersCollection();
    const items = await users
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await users.countDocuments(filter);

    return res.json({
      success: true,
      message: "Users loaded",
      data: {
        items: items.map(cleanUser),
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

async function updateUser(req, res, update, message) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "User id is not valid",
      });
    }

    if (
      req.user.userId === req.params.id &&
      update.status === "blocked"
    ) {
      return res.status(400).json({
        success: false,
        message: "You can not block your own account",
      });
    }

    const result = await usersCollection().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

router.patch("/:id/block", verifyJwt, verifyRole(roles.admin), (req, res) =>
  updateUser(req, res, { status: "blocked" }, "User blocked")
);

router.patch("/:id/unblock", verifyJwt, verifyRole(roles.admin), (req, res) =>
  updateUser(req, res, { status: "active" }, "User unblocked")
);

router.patch(
  "/:id/make-volunteer",
  verifyJwt,
  verifyRole(roles.admin),
  (req, res) =>
    updateUser(req, res, { role: roles.volunteer }, "User is now volunteer")
);

router.patch("/:id/make-admin", verifyJwt, verifyRole(roles.admin), (req, res) =>
  updateUser(req, res, { role: roles.admin }, "User is now admin")
);

export default router;
