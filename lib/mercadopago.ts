import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_TOKEN,
});

export async function getMerchantOrder(id) {
  const res = await mercadopago.merchant_orders.get(id);
  return res.body;
}

export async function createPreference(data = {}) {
  const res = await mercadopago.preferences.create(data);
  return res.body;
}
