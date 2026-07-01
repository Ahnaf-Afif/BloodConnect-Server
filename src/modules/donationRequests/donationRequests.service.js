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
    recipientName: data.recipientName.trim(),
    recipientDistrict: data.recipientDistrict.trim(),
    recipientUpazila: data.recipientUpazila.trim(),
    hospitalName: data.hospitalName.trim(),
    fullAddress: data.fullAddress.trim(),
    bloodGroup: data.bloodGroup.trim(),
    donationDate: data.donationDate.trim(),
    donationTime: data.donationTime.trim(),
    requestMessage: data.requestMessage.trim(),
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

export async function getDonationRequestById(id) {
  const requests = donationRequestsCollection();

  if (!ObjectId.isValid(id)) {
    return null;
  }

  return requests.findOne({ _id: new ObjectId(id) });
}

export async function getAllDonationRequests(query) {
  const requests = donationRequestsCollection();
  const { page, limit, skip } = buildPagination(query);
  const filter = {};

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

export async function updateDonationRequest(id, userId, role, data) {
  const requests = donationRequestsCollection();
  const request = await getDonationRequestById(id);

  if (!request) {
    return { error: "Donation request not found" };
  }

  if (role === "volunteer") {
    return { error: "Volunteers can only update request status" };
  }

  const isOwner = request.requesterId.toString() === userId;
  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    return { error: "You can not edit this request" };
  }

  if (request.donationStatus !== donationStatuses.pending && !isAdmin) {
    return { error: "Only pending requests can be edited" };
  }

  const updateData = {
    recipientName: data.recipientName.trim(),
    recipientDistrict: data.recipientDistrict.trim(),
    recipientUpazila: data.recipientUpazila.trim(),
    hospitalName: data.hospitalName.trim(),
    fullAddress: data.fullAddress.trim(),
    bloodGroup: data.bloodGroup.trim(),
    donationDate: data.donationDate.trim(),
    donationTime: data.donationTime.trim(),
    requestMessage: data.requestMessage.trim(),
  };

  await requests.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

  return { data: { ...request, ...updateData } };
}

export async function deleteDonationRequest(id, userId, role) {
  const requests = donationRequestsCollection();
  const request = await getDonationRequestById(id);

  if (!request) {
    return { error: "Donation request not found" };
  }

  if (role === "volunteer") {
    return { error: "Volunteers can only update request status" };
  }

  const isOwner = request.requesterId.toString() === userId;
  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    return { error: "You can not delete this request" };
  }

  await requests.deleteOne({ _id: new ObjectId(id) });

  return { success: true };
}

export async function updateDonationStatus(id, userId, role, status) {
  const requests = donationRequestsCollection();
  const request = await getDonationRequestById(id);

  if (!request) {
    return { error: "Donation request not found" };
  }

  const isOwner = request.requesterId.toString() === userId;
  const isAdmin = role === "admin";
  const isVolunteer = role === "volunteer";

  if (isVolunteer) {
    await requests.updateOne(
      { _id: new ObjectId(id) },
      { $set: { donationStatus: status } }
    );
    return { success: true };
  }

  if (!isOwner && !isAdmin) {
    return { error: "You can not update this request" };
  }

  if (
    request.donationStatus === donationStatuses.inprogress &&
    (status === donationStatuses.done || status === donationStatuses.canceled)
  ) {
    await requests.updateOne(
      { _id: new ObjectId(id) },
      { $set: { donationStatus: status } }
    );
    return { success: true };
  }

  if (isAdmin) {
    await requests.updateOne(
      { _id: new ObjectId(id) },
      { $set: { donationStatus: status } }
    );
    return { success: true };
  }

  return { error: "Status can not be changed" };
}

export async function donateToRequest(id, userId) {
  const requests = donationRequestsCollection();
  const users = usersCollection();
  const request = await getDonationRequestById(id);

  if (!request) {
    return { error: "Donation request not found" };
  }

  if (request.donationStatus !== donationStatuses.pending) {
    return { error: "This request is not available" };
  }

  const user = await users.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    return { error: "User not found" };
  }

  if (user.status === "blocked") {
    return { error: "Blocked user can not donate" };
  }

  if (request.requesterId.toString() === userId) {
    return { error: "You can not donate to your own request" };
  }

  const result = await requests.updateOne(
    {
      _id: new ObjectId(id),
      donationStatus: donationStatuses.pending,
    },
    {
      $set: {
        donationStatus: donationStatuses.inprogress,
        donorName: user.name,
        donorEmail: user.email,
      },
    }
  );

  if (result.modifiedCount === 0) {
    return { error: "Another donor already accepted this request" };
  }

  return { success: true };
}
