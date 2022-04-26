import { firestore } from "../lib/firestore";

const collection = firestore.collection("users");

export class User {
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
  ////////////////////////////////////////////////////////////////////////////
  static async createNewUser(data) {
    const newUserSnap = await collection.add(data);
    const newUser = new User(newUserSnap.id);
    newUser.data = data;
    return newUser;
  }
  ////////////////////////////////////////////////////////////////////////////
  static async getData(userId: string) {
    const user = await collection.doc(userId).get();
    return user.data();
  }
  ////////////////////////////////////////////////////////////////////////////
  static async modifyData(data, userId) {
    try {
      const user = await collection.doc(userId).update(data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
