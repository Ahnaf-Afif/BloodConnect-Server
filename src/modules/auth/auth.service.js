import {
  accountsCollection,
  usersCollection,
} from "../../../database/collections.js";
import { getAuth } from "../../config/auth.js";

export async function createUser(data) {
  const users = usersCollection();
  const email = data.email.toLowerCase();
  const oldUser = await users.findOne({ email });

  if (oldUser) {
    return null;
  }

  await getAuth().api.signUpEmail({
    body: {
      name: data.name,
      email,
      password: data.password,
      image: data.avatar,
      bloodGroup: data.bloodGroup,
      district: data.district,
      upazila: data.upazila,
    },
  });

  const user = await users.findOne({ email });
  return removePrivateFields(user);
}

function removePrivateFields(user) {
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
  try {
    await getAuth().api.signInEmail({
      body: {
        email,
        password: data.password,
      },
    });
  } catch {
    return null;
  }

  const user = await users.findOne({ email });
  return removePrivateFields(user);
}

export async function migrateOldUsers() {
  const users = usersCollection();
  const accounts = accountsCollection();
  const oldUsers = await users.find({ password: { $type: "string" } }).toArray();

  for (const user of oldUsers) {
    const date = user.createdAt || new Date();

    await accounts.updateOne(
      {
        providerId: "credential",
        accountId: user._id.toString(),
      },
      {
        $setOnInsert: {
          accountId: user._id.toString(),
          providerId: "credential",
          userId: user._id,
          password: user.password,
          createdAt: date,
          updatedAt: date,
        },
      },
      { upsert: true }
    );

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerified: false,
          updatedAt: date,
        },
        $unset: {
          password: "",
        },
      }
    );
  }

  if (oldUsers.length > 0) {
    console.log(`${oldUsers.length} old account(s) moved to Better Auth`);
  }
}
