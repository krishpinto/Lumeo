import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT as string);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { db, admin };
