import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, orderBy, where, Timestamp } from "firebase/firestore";
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

export async function updateAppointment(id: string, data: Partial<Omit<Appointment, "id" | "createdAt">>) {
  return updateDoc(doc(db, "appointments", id), data);
}

export async function getBookedTimes(date: string): Promise<string[]> {
  const q = query(appointmentsRef, where("date", "==", date));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data().time).filter(Boolean);
}

export async function getAppointments(): Promise<Appointment[]> {
  const q = query(appointmentsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[];
}

// Messages
export interface Message {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Timestamp;
  source: "en" | "es";
}

const messagesRef = collection(db, "messages");

export async function saveMessage(data: Omit<Message, "id" | "createdAt">) {
  return addDoc(messagesRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function deleteMessage(id: string) {
  return deleteDoc(doc(db, "messages", id));
}

export async function getMessages(): Promise<Message[]> {
  const q = query(messagesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Message[];
}
