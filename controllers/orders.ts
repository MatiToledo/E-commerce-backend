import { getProducById } from "controllers/products";
import { createPreference } from "lib/mercadopago";
import { Order } from "models/order";
import { airtableBase } from "lib/airtable";
import { orderIndex } from "lib/algolia";
import { getUserData } from "controllers/users";
import sgMail from "@sendgrid/mail";
import { getMerchantOrder } from "lib/mercadopago";

type createOrderRes = {
  url: string;
};

type orderData = {
  userId: string;
  productId: string;
  additionalInfo?: {
    quantity: number;
    color?: string;
    address?: string;
  };
};

export async function createOrderAndPreference(data: orderData) {
  const product: any = await getProducById(data.productId);

  if (!product) {
    throw "El producto no existe";
  }

  product.quantity = data.additionalInfo.quantity;

  const order = await Order.createNewOrder({
    createdAt: new Date(),
    status: "pending",
    productName: product.Name,
    ...data,
  });

  airtableBase("Orders").create([
    {
      fields: {
        name: product.Name,
        createdAt: order.data.createdAt,
        id: order.id,
        status: "pending",
        product: product.Code,
        quantity: data.additionalInfo.quantity,
        price: product.unit_price,
        address: order.data.additionalInfo.address,
        userId: order.data.userId,
      },
    },
  ]);

  const pref = await createPreference({
    items: [product],
    back_urls: {
      succes: "https://estofueunexito",
      pending: "https://estoestapendiente",
    },
    external_reference: order.id,
    notification_url: "https://desafio-m9.vercel.app/api/ipn/mercadopago",
  });

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

export async function syncOrders() {
  try {
    airtableBase("Orders")
      .select({
        pageSize: 10,
      })
      .eachPage(
        async function (records, fetchNextPage) {
          const objects = records.map((r) => {
            return {
              objectID: r.fields.id,
              ...r.fields,
            };
          });
          await orderIndex.saveObjects(objects);
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.log(err);
            return;
          }
          return true;
        }
      );
    return true;
  } catch (error) {
    return error;
  }
}

export async function listenMerchantOrder(id, topic) {
  if (topic == "merchant_order") {
    const order: any = await getMerchantOrder(id);
    if (order.order_status == "paid") {
      try {
        const orderId = order.external_reference;
        const myOrder = new Order(orderId);
        await myOrder.pull();
        myOrder.data.status = "closed";
        myOrder.data.externalOrder = order;
        await myOrder.push();

        airtableBase("Orders").update(myOrder.id, {
          status: "paid",
        });

        const user = await getUserData(myOrder.data.userId);

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
          to: user.email,
          from: "toledo.nicolas.matias@gmail.com",
          subject: `Tu pago fue confirmado`,
          text: `Se confirmo con exito el pago de ${myOrder.data.productName}. 
        
          Se entregara en ${myOrder.data.additionalInfo.address}.`,
        };
        sgMail
          .send(msg)
          .then(() => {
            return true;
          })
          .catch((error) => {
            return error;
          });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }
}
