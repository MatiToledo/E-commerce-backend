import { firestore } from "../lib/firestore";
import isAfter from "date-fns/isAfter";

const collection = firestore.collection("auth");

export class Auth {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }
  ////////////////////////////////////////////////////////////////////////
  static async createNewAuth(data) {
    const newAuthSnap = await collection.add(data);
    const newAuth = new Auth(newAuthSnap.id);
    newAuth.data = data;
    return newAuth;
  }
  ////////////////////////////////////////////////////////////////////////
  static async findByEmail(email: string) {
    const search = await collection.where("email", "==", email).get();
    if (search.docs.length) {
      const first = search.docs[0];
      const authFound = new Auth(first.id);
      authFound.data = first.data();
      return authFound;
    } else {
      return null;
    }
  }
  ////////////////////////////////////////////////////////////////////////
  static async findEmailAndCode(email: string, code: number) {
    const cleanEmail = email.trim().toLowerCase();
    const search = await collection
      .where("email", "==", cleanEmail)
      .where("code", "==", code)
      .get();

    if (search.empty) {
      console.error("email y code no coinciden");
      return null;
    } else {
      const snap = search.docs[0];
      const auth = new Auth(snap.id);
      auth.data = snap.data();
      return auth;
    }
  }
  ////////////////////////////////////////////////////////////////////////
  isCodeExpired() {
    const now = new Date();
    const expired = this.data.expired.toDate();
    return isAfter(now, expired);
  }
  ////////////////////////////////////////////////////////////////////////
  async invalidateCode() {
    this.data.code = "";
    await this.push();
  }
  ////////////////////////////////////////////////////////////////////////
  static async modifyAuthEmail(email: string, userId: string) {
    const cleanEmail = email.trim().toLowerCase();
    const search = await collection.where("userId", "==", userId).get();
    if (search.empty) {
      console.error("No hay un auth con ese userId");
      return null;
    } else {
      const snap = search.docs[0];
      const auth = new Auth(snap.id);
      auth.data = snap.data();
      auth.data.email = cleanEmail;
      await auth.push();
      return auth;
    }
  }
}
