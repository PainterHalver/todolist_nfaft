import admin from "firebase-admin";
import { getApp, getApps, initializeApp, ServiceAccount } from "firebase-admin/app";

// import serviceAccount from "./firebase_adminsdk.json";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!) as ServiceAccount;

const app = !getApps().length
  ? initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://todo-nextjs-b29ae.firebaseio.com",
    })
  : getApp();

export default app;
