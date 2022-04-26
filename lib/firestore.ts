import admin from "firebase-admin";

var serviceAccount = JSON.parse(process.env.FIRABASE_CONNECTION);

if (admin.apps.length == 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const firestore = admin.firestore();
