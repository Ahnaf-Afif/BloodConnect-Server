import { ObjectId } from "mongodb";

import {
  donationRequestsCollection,
  usersCollection,
} from "../../../database/collections.js";
import { donationStatuses } from "../../constants/donationStatuses.js";
import { buildPagination } from "../../utils/buildPagination.js";

export async function createDonationRequest(userId, data) {
  const users = usersCollection();
  const requests = donationRequestsCollection();
  const user = await users.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    return { error: "User not found" };
  }

  if (user.status === "blocked") {
    return { error: "Blocked user can not create request" };
  }

  const requestData = {
    requesterId: user._id,
    requesterName: user.name,
    requesterEmail: user.email,
    recipientName: data.recipientName,
    recipientDistrict: data.recipientDistrict,
    recipientUpazila: data.recipientUpazila,
    hospitalName: data.hospitalName,
    fullAddress: data.fullAddress,
    bloodGroup: data.bloodGroup,
    donationDate: data.donationDate,
    donationTime: data.donationTime,
    requestMessage: data.requestMessage,
    donationStatus: donationStatuses.pending,
    donorName: "",
    donorEmail: "",
    createdAt: new Date(),
  };

  const result = await requests.insertOne(requestData);

  return {
    data: {
      _id: result.insertedId,
      ...requestData,
    },
  };
}

export async function getPendingDonationRequests(query) {
  const requests = donationRequestsCollection();
  const { page, limit, skip } = buildPagination(query);
  const filter = { donationStatus: donationStatuses.pending };

  const items = await requests
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await requests.countDocuments(filter);

  return {
    items,
    page,
    limit,
    total,
  };
}

export async function getMyDonationRequests(userId, query) {
  const requests = donationRequestsCollection();
  const { page, limit, skip } = buildPagination(query);
  const filter = {
    requesterId: new ObjectId(userId),
  };

  if (query.status) {
    filter.donationStatus = query.status;
  }

  const items = await requests
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await requests.countDocuments(filter);

  return {
    items,
    page,
    limit,
    total,
  };
}
