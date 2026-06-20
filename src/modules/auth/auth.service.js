import bcrypt from "bcryptjs";

import { usersCollection } from "../../../database/collections.js";
import { roles } from "../../constants/roles.js";

export async function createUser(data) {
  const users = usersCollection();
  const email = data.email.toLowerCase();
  const oldUser = await users.findOne({ email });

  if (oldUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = {
    name: data.name,
    email,
    avatar: data.avatar,
    bloodGroup: data.bloodGroup,
    district: data.district,
    upazila: data.upazila,
    password: hashedPassword,
    role: roles.donor,
    status: "active",
    createdAt: new Date(),
  };

  const result = await users.insertOne(newUser);

  return {
    _id: result.insertedId,
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
    bloodGroup: newUser.bloodGroup,
    district: newUser.district,
    upazila: newUser.upazila,
    role: newUser.role,
    status: newUser.status,
    createdAt: newUser.createdAt,
  };
}

function removePassword(user) {
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

export async function loginUser(data) {
  const users = usersCollection();
  const email = data.email.toLowerCase();
  const user = await users.findOne({ email });

  if (!user) {
    return null;
  }

  const isPasswordMatched = await bcrypt.compare(data.password, user.password);

  if (!isPasswordMatched) {
    return null;
  }

  return removePassword(user);
}
