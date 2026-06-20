import { bloodGroups } from "../../constants/bloodGroups.js";

export function validateDonationRequest(data) {
  const requiredFields = [
    "recipientName",
    "recipientDistrict",
    "recipientUpazila",
    "hospitalName",
    "fullAddress",
    "bloodGroup",
    "donationDate",
    "donationTime",
    "requestMessage",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }

  if (!bloodGroups.includes(data.bloodGroup)) {
    return "Blood group is not valid";
  }

  return null;
}
