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
    if (typeof data[field] !== "string" || !data[field].trim()) {
      return `${field} is required`;
    }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(data.email.trim())) {
    return "Email is not valid";
  }

  if (!bloodGroups.includes(data.bloodGroup.trim())) {
    return "Blood group is not valid";
  }

  if (data.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (data.name.trim().length > 80) {
    return "Name is too long";
  }

  return null;
}

export function validateLoginData(data) {
  if (typeof data.email !== "string" || !data.email.trim()) {
    return "email is required";
  }

  if (typeof data.password !== "string" || !data.password) {
    return "password is required";
  }

  return null;
}
