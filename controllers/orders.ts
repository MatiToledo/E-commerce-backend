import { getProducById } from "controllers/products";
import { createPreference } from "lib/mercadopago";
import { ObjectEncodingOptions } from "fs";
import { Order } from "models/order";

type createOrderRes = {
  url: string;
};

type orderData = {
  userId: string;
  productId: string;
  additionalInfo?: {
    quantity: number;
    color: string;
    address: string;
  };
};

export async function createOrderAndPreference(data: orderData) {
  const product: any = await getProducById(data.productId);

  if (!product) {
    throw "El producto no existe";
  }

  product.quantity = data.additionalInfo.quantity;

  const order = await Order.createNewOrder({ status: "pending", ...data });

  const pref = await createPreference({
    items: [product],
    back_urls: {
      succes: "https://estofueunexito",
      pending: "https://estoestapendiente",
    },
    external_reference: order.id,
    notification_url:
      "https://webhook.site/eeb020f9-d60b-49eb-9aac-b40bb930ed24",
  });
  console.log(order);

  return {
    url: pref.init_point,
    orderId: order.id,
  };
}

export async function getOrdersByUserId(userId: string) {
  const orders = await Order.getOrdersByUserId(userId);
  return orders;
}

export async function getOrderById(orderId: string) {
  const order = await Order.getOrderById(orderId);
  return order;
}
