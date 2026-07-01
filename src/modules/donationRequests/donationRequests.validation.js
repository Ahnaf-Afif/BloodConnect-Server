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
    if (typeof data[field] !== "string" || !data[field].trim()) {
      return `${field} is required`;
    }
  }

  if (!bloodGroups.includes(data.bloodGroup.trim())) {
    return "Blood group is not valid";
  }

  const longFields = ["fullAddress", "requestMessage"];
  const shortFields = [
    "recipientName",
    "recipientDistrict",
    "recipientUpazila",
    "hospitalName",
  ];

  if (shortFields.some((field) => data[field].trim().length > 120)) {
    return "A request field is too long";
  }

  if (longFields.some((field) => data[field].trim().length > 1000)) {
    return "Address or message is too long";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.donationDate)) {
    return "Donation date is not valid";
  }

  if (!/^\d{2}:\d{2}$/.test(data.donationTime)) {
    return "Donation time is not valid";
  }

  return null;
}
