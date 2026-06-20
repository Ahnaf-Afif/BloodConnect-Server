import { ObjectId } from "mongodb";

import {
  donationRequestsCollection,
  usersCollection,
} from "../../../database/collections.js";
import { donationStatuses } from "../../constants/donationStatuses.js";

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
