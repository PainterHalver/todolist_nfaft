import { Timestamp } from "firebase/firestore";

export type Todo = {
  title: string;
  note: string;
  completed: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
