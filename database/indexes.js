import {
  donationRequestsCollection,
  fundsCollection,
  usersCollection,
} from "./collections.js";

export async function createIndexes() {
  await usersCollection().createIndex({ email: 1 }, { unique: true });
  await usersCollection().createIndex({ status: 1 });
  await usersCollection().createIndex({ bloodGroup: 1, district: 1, upazila: 1 });

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
