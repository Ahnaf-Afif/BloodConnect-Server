import {
  accountsCollection,
  donationRequestsCollection,
  fundsCollection,
  sessionsCollection,
  usersCollection,
} from "./collections.js";

export async function createIndexes() {
  await usersCollection().createIndex({ email: 1 }, { unique: true });
  await usersCollection().createIndex({ status: 1 });
  await usersCollection().createIndex({ bloodGroup: 1, district: 1, upazila: 1 });

  await accountsCollection().createIndex(
    { providerId: 1, accountId: 1 },
    { unique: true }
  );
  await accountsCollection().createIndex({ userId: 1 });
  await sessionsCollection().createIndex({ token: 1 }, { unique: true });
  await sessionsCollection().createIndex({ userId: 1 });

  await donationRequestsCollection().createIndex({ requesterEmail: 1 });
  await donationRequestsCollection().createIndex({ donationStatus: 1 });
  await donationRequestsCollection().createIndex({ bloodGroup: 1 });
  await donationRequestsCollection().createIndex({ createdAt: -1 });

  await fundsCollection().createIndex({ createdAt: -1 });
  await fundsCollection().createIndex(
    { stripeSessionId: 1 },
    { unique: true, sparse: true }
  );

  console.log("Database indexes ready");
}
