import { firestore } from "../lib/firestore";

//HACER TIPERO DE ORDER DATA (TYPE)
type orderData = {
  createdAt: Date;
  productName: string;
  userId: string;
  productId: string;
  additionalInfo?: object;
  status: string;
};

const collection = firestore.collection("orders");
export class Order {
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
  static async createNewOrder(data: orderData) {
    const newOrderSnap = await collection.add(data);
    const newOrder = new Order(newOrderSnap.id);
    newOrder.data = data;
    return newOrder;
  }
  ////////////////////////////////////////////////////////////////////////////
  static async getOrdersByUserId(userId: string) {
    const search = await collection.where("userId", "==", userId).get();
    if (search.empty) {
      return "Este usuario no tiene ordenes";
      return null;
    } else {
      const orders = [];
      for (const o of search.docs) {
        const order = new Order(o.id);
        order.data = o.data();
        orders.push(order.data);
      }
      return orders;
    }
  }
  ////////////////////////////////////////////////////////////////////////////
  static async getOrderById(orderId: string) {
    const order = await collection.doc(orderId).get();
    return order.data();
  }
  ////////////////////////////////////////////////////////////////////////////
  async updateAirtableId(id) {
    this.data.airtableId = id;
    await this.push();
  }
}
