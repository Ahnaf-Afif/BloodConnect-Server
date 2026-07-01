import { ObjectId } from "mongodb";

import { usersCollection } from "../../../database/collections.js";

function cleanProfile(user) {
  if (!user) {
    return null;
  }

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

export async function getProfile(userId) {
  const users = usersCollection();
  const user = await users.findOne({ _id: new ObjectId(userId) });

  return cleanProfile(user);
}

export async function updateProfile(userId, data) {
  const users = usersCollection();

  const updateData = {
    name: data.name.trim(),
    bloodGroup: data.bloodGroup.trim(),
    district: data.district.trim(),
    upazila: data.upazila.trim(),
    updatedAt: new Date(),
  };

  if (typeof data.avatar === "string" && data.avatar) {
    updateData.avatar = data.avatar;
  }

  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: updateData,
    }
  );

  return getProfile(userId);
}
