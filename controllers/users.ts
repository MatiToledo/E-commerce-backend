import { User } from "models/user";

export async function getUserData(id: string) {
  const userData = User.getData(id);
  return userData;
}
