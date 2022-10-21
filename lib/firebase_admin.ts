import admin from "firebase-admin";
import { initializeApp, getApp, getApps, ServiceAccount } from "firebase-admin/app";
import serviceAccount from "./firebase_adminsdk.json";

const app = !getApps().length
  ? initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: "https://todo-nextjs-b29ae.firebaseio.com",
    })
  : getApp();

export default app;
