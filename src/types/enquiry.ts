/**
 * AutoLab Digital Showroom
 * Lead and Enquiry Flow Contracts
 *
 * Transfers customer digital configuration into AutoLab's sales consultation workflow.
 * Does not implement automated quotation or e-commerce checkout.
 */

import { ConfigurationSummary } from "./configuration";

export type EngagementChannel = "showroom_visit" | "whatsapp" | "phone" | "email";

export type EnquiryStatus = 
  | "new" 
  | "contacted" 
  | "showroom_scheduled" 
  | "quotation_pending" 
  | "in_progress" 
  | "closed";

export interface CustomerContactInput {
  fullName: string;
  phoneOrWhatsApp: string;
  email?: string;
  preferredChannel: EngagementChannel;
  customerNotes?: string;
  existingVehicleDetails?: {
    modelYear?: string;
    currentInteriorColor?: string;
    currentCondition?: "excellent" | "good" | "worn" | "damaged";
  };
}

export interface AutoLabEnquiryPayload {
  configurationReferenceCode: string;
  vehicleId: string;
  configurationSummary: ConfigurationSummary;
  customer: CustomerContactInput;
  consentToContact: boolean;
}

export interface EnquiryRecord extends AutoLabEnquiryPayload {
  id: string;
  status: EnquiryStatus;
  receivedAt: string;
  assignedAdvisor?: string;
  internalNotes?: string;
}
