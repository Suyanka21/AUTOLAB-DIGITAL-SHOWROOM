# Lightweight Administration Requirements
**Document:** `docs/application/lightweight-admin-requirements.md`  
**Authority:** Product Blueprint & Decision Freeze (Section 17)  
**Target Consumer:** Full-Stack Developers & Operations  

---

## 1. Administrative Scope & Purpose

The administration interface is an **internal operational tool for AutoLab advisors**, not an enterprise CRM or ERP system. Its single purpose is to provide immediate operational visibility into client inquiries, saved configurations, and material catalog availability.

---

## 2. Core Functional Capabilities

### 2.1 Inbound Enquiry Dashboard (`/admin/enquiries`)
* **Lead Stream:** Real-time table displaying recent customer consultation inquiries.
* **Fields Displayed:** Customer Name, Phone/WhatsApp, Reference Code, Preferred Channel, Date/Time, and Status.
* **Status Transitions:**
  * `new` ➔ `contacted` ➔ `showroom_scheduled` ➔ `quotation_pending` ➔ `closed`.
* **Internal Advisor Notes:** Simple text field for advisors to record follow-up notes (e.g., *"Client arriving Saturday 11 AM; requested Sienna Brown swatch"*).

### 2.2 Configuration Reference Lookup (`/admin/lookup`)
* **Instant Search:** Quick search bar allowing advisors to input any Reference Code (e.g. `AL-SC-2026-8A3F`) to view the exact 3D configuration summary, selected hides, and visual composition.

### 2.3 Material Catalog Availability Toggles (`/admin/catalog`)
* **Availability Management:** Ability to flag specific leather hides, thread colors, or veneer finishes as `In Stock`, `Low Stock`, or `Temporarily Unavailable`.
* Prevents clients from designing interiors with hides AutoLab currently cannot source.

### 2.4 Operational Analytics Dashboard (`/admin/analytics`)
* **Summary Metrics:**
  * Total configurations created this month.
  * Inbound consultation conversion rate (Configurations ➔ Enquiries).
  * Top primary leather colors configured (e.g. 52% Sienna Brown, 28% Black Nappa, 20% Cognac Tan).
  * Top trim finishes selected (e.g. 64% Open-Pore Poplar, 36% Forged Carbon).

---

## 3. Explicit Administrative Non-Goals

The administrative tool will **NOT** include:
* Multi-department staff scheduling or clock-in management.
* Workshop technician bay assignment or task tracking.
* Automated invoice generation or accounting ledger synchronization.
* Complex role-based permission hierarchies beyond simple Advisor and Admin access.
