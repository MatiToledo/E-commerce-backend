import type { NextApiRequest, NextApiResponse } from "next";

import { Order } from "models/order";
import { getMerchantOrder } from "lib/mercadopago";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  if (topic == "merchant_order") {
    const order: any = await getMerchantOrder(id);
    console.log({ order });
    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      myOrder.data.externalOrder = order;
      await myOrder.push();
      //AGREGAR FECHAS EN ORDER
      // sendEmail()
    }
  }
  res.send("ok");
}
