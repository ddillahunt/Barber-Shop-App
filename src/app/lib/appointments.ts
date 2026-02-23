import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, orderBy, where, Timestamp, onSnapshot, type Unsubscribe } from "firebase/firestore";
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
  notes?: string;
  completed?: boolean;
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

export async function getBookedTimes(date: string, barber?: string): Promise<string[]> {
  const q = query(appointmentsRef, where("date", "==", date));
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((doc) => doc.data());
  if (barber) {
    return docs.filter((d) => d.barber === barber).map((d) => d.time).filter(Boolean);
  }
  return docs.map((d) => d.time).filter(Boolean);
}

export async function isTimeSlotAvailable(date: string, time: string, barber: string): Promise<boolean> {
  const q = query(appointmentsRef, where("date", "==", date));
  const snapshot = await getDocs(q);
  return !snapshot.docs.some((doc) => {
    const d = doc.data();
    return d.time === time && d.barber === barber;
  });
}

export function subscribeToBookedTimes(
  date: string,
  barber: string | undefined,
  callback: (times: string[]) => void
): Unsubscribe {
  const q = query(appointmentsRef, where("date", "==", date));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((d) => d.data());
    if (barber) {
      callback(docs.filter((d) => d.barber === barber).map((d) => d.time as string).filter(Boolean));
    } else {
      callback(docs.map((d) => d.time as string).filter(Boolean));
    }
  }, (error) => {
    console.error("Booked times listener error:", error);
    callback([]);
  });
}

export async function getAppointments(): Promise<Appointment[]> {
  const q = query(appointmentsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[];
}

export function subscribeToAppointments(callback: (appointments: Appointment[]) => void): Unsubscribe {
  const q = query(appointmentsRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Appointment[]);
  });
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

export function subscribeToMessages(callback: (messages: Message[]) => void): Unsubscribe {
  const q = query(messagesRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[]);
  });
}
