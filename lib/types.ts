import { Timestamp } from "firebase/firestore";
export type TodoStateType = {
  title: string;
  note: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TodoFirestoreType = {
  title: string;
  note: string;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
