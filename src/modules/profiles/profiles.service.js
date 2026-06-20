import { ObjectId } from "mongodb";

import { usersCollection } from "../../../database/collections.js";

function hidePassword(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

export async function getProfile(userId) {
  const users = usersCollection();
  const user = await users.findOne({ _id: new ObjectId(userId) });

  return hidePassword(user);
}

export async function updateProfile(userId, data) {
  const users = usersCollection();

  const updateData = {
    name: data.name,
    avatar: data.avatar,
    bloodGroup: data.bloodGroup,
    district: data.district,
    upazila: data.upazila,
    updatedAt: new Date(),
  };

  Object.keys(updateData).forEach((key) => {
    if (!updateData[key]) {
      delete updateData[key];
    }
  });

  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: updateData,
    }
  );

  return getProfile(userId);
}
