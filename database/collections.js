import { getDB } from "../src/config/db.js";

export const collectionNames = {
  users: "users",
  donationRequests: "donationRequests",
  funds: "funds",
  contacts: "contacts",
};

export function usersCollection() {
  return getDB().collection(collectionNames.users);
}

export function donationRequestsCollection() {
  return getDB().collection(collectionNames.donationRequests);
}

export function fundsCollection() {
  return getDB().collection(collectionNames.funds);
}

export function contactsCollection() {
  return getDB().collection(collectionNames.contacts);
}
