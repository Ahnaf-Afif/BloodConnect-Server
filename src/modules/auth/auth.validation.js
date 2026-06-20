import { bloodGroups } from "../../constants/bloodGroups.js";

export function validateRegisterData(data) {
  const requiredFields = [
    "name",
    "email",
    "avatar",
    "bloodGroup",
    "district",
    "upazila",
    "password",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }

  if (!bloodGroups.includes(data.bloodGroup)) {
    return "Blood group is not valid";
  }

  if (data.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
}

export function validateLoginData(data) {
  if (!data.email) {
    return "email is required";
  }

  if (!data.password) {
    return "password is required";
  }

  return null;
}
