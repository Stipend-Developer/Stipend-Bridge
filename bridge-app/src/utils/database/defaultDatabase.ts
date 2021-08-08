import { FireBase } from "./firebase/firebase";

export const newDefaultDatabase = <Transaction extends { id: string }>() =>
  new FireBase<Transaction>();
