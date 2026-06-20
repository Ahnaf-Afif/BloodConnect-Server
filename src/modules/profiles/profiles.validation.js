import { bloodGroups } from "../../constants/bloodGroups.js";

export function validateProfileUpdate(data) {
  if (data.bloodGroup && !bloodGroups.includes(data.bloodGroup)) {
    return "Blood group is not valid";
  }

  return null;
}
