import { decode, generate } from "./jwt";

import test from "ava";

test("jwt encode/decode", (t) => {
  const payload = { mati: true };

  const token = generate(payload);
  const salida = decode(token);
  delete salida.iat;

  t.deepEqual(payload, salida);
});
