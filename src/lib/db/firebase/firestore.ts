/**
 * AutoLab Digital Showroom
 * Firebase Firestore Schema and Client Helpers
 *
 * Provides type-safe collection definitions for Configurations and Enquiries.
 */

import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, limit } from "firebase/firestore";
import { firestore } from "./client";
import { ConfigurationState, ConfigurationSummary } from "@/types/configuration";
import { AutoLabEnquiryPayload, EnquiryStatus } from "@/types/enquiry";

export interface FirebaseConfigurationDoc extends ConfigurationState {
  id: string;
  summary: ConfigurationSummary;
}

export interface FirebaseEnquiryDoc {
  id: string;
  referenceCode: string;
  customerName: string;
  phoneOrWhatsApp: string;
  email?: string;
  preferredChannel: string;
  customerNotes?: string;
  status: EnquiryStatus;
  receivedAt: string;
  configurationSummary: ConfigurationSummary;
}

export const configurationsCollection = collection(firestore, "configurations");
export const enquiriesCollection = collection(firestore, "enquiries");

export async function getConfigurationByRef(referenceCode: string): Promise<FirebaseConfigurationDoc | null> {
  const q = query(configurationsCollection, where("referenceCode", "==", referenceCode), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as FirebaseConfigurationDoc;
}

export async function saveConfiguration(config: ConfigurationState, summary: ConfigurationSummary): Promise<string> {
  const ref = doc(configurationsCollection, config.referenceCode);
  await setDoc(ref, {
    ...config,
    summary,
  });
  return config.referenceCode;
}
