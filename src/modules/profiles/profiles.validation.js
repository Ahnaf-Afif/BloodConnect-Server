import { bloodGroups } from "../../constants/bloodGroups.js";

export function validateProfileUpdate(data) {
  const requiredFields = ["name", "bloodGroup", "district", "upazila"];

  for (const field of requiredFields) {
    if (typeof data[field] !== "string" || !data[field].trim()) {
      return `${field} is required`;
    }
  }

  if (!bloodGroups.includes(data.bloodGroup.trim())) {
    return "Blood group is not valid";
  }

  if (data.name.trim().length > 80) {
    return "Name is too long";
  }

  return null;
}
