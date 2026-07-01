import { getDB } from "../src/config/db.js";

export const collectionNames = {
  users: "users",
  accounts: "accounts",
  sessions: "sessions",
  donationRequests: "donationRequests",
  funds: "funds",
  contacts: "contacts",
};

export function usersCollection() {
  return getDB().collection(collectionNames.users);
}

export function accountsCollection() {
  return getDB().collection(collectionNames.accounts);
}

export function sessionsCollection() {
  return getDB().collection(collectionNames.sessions);
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
