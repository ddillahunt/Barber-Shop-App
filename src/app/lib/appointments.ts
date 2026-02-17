import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface Appointment {
  id?: string;
  name: string;
  email: string;
  phone: string;
  barber: string;
  service: string;
  date: string;
  time: string;
  createdAt: Timestamp;
  source: "en" | "es";
}

const appointmentsRef = collection(db, "appointments");

export async function saveAppointment(data: Omit<Appointment, "id" | "createdAt">) {
  return addDoc(appointmentsRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function deleteAppointment(id: string) {
  return deleteDoc(doc(db, "appointments", id));
}

export async function getAppointments(): Promise<Appointment[]> {
  const q = query(appointmentsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[];
}
