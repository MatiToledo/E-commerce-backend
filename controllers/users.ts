import { User } from "models/user";

export async function getUserData(id: string) {
  const userData = User.getData(id);
  return userData;
}

export async function modifyData(data, id: string) {
  const user = await User.modifyData(data, id);
  return user;
}
