import { Auth } from "models/auth";
import { User } from "models/user";
import addMinutes from "date-fns/addMinutes";
import gen from "random-seed";
import { sendgridEmail } from "lib/sendgrid";

var seed = process.env.SED_SECRET;
var random = gen.create(seed);

export async function findOrCreateAuth(data) {
  const cleanEmail = data.email.trim().toLowerCase();
  const auth = await Auth.findByEmail(cleanEmail);
  if (auth) {
    return auth;
  } else {
    const newUser = await User.createNewUser({
      email: cleanEmail,
      address: data.address,
    });
    const newAuth = await Auth.createNewAuth({
      userId: newUser.id,
      email: cleanEmail,
      code: "",
      expired: new Date(),
    });
    return newAuth;
  }
}

export async function findEmailAndCode(email: string, code: number) {
  const auth = await Auth.findEmailAndCode(email, code);
  return auth;
}

export async function modifyAuthEmail(email: string, id: string) {
  const auth = await Auth.modifyAuthEmail(email, id);
  return auth;
}

export async function sendCode(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  const auth = await findOrCreateAuth({ email: cleanEmail });
  const code = random.intBetween(10000, 99999);
  const now = new Date();
  const twentyMinFromNow = addMinutes(now, 20);
  auth.data.code = code;
  auth.data.expired = twentyMinFromNow;
  await auth.push();

  const msg = {
    to: email,
    from: "toledo.nicolas.matias@gmail.com",
    subject: `Código de inicio de sesion`,
    text: `Su código para inicar sesion es: ${code}`,
  };

  await sendgridEmail(msg);

  return auth;
}
