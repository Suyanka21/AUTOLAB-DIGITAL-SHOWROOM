# Backend & Data Architecture
**Document:** `docs/application/backend-and-data-architecture.md`  
**Authority:** Product Blueprint & Decision Freeze (Sections 13 & 16)  
**Target Consumer:** Backend Engineers, Full-Stack Developers & Astra  

---

## 1. Architectural Philosophy: The Lean Backend Principle

The AutoLab Digital Showroom adheres strictly to the **Lean Backend Principle**:
> *"Store configurations and leads, not the entire automotive industry."*

We intentionally do not construct enterprise-scale ERP systems, multi-tier CRM software, or vehicle inventory databases. The backend exists solely to persist customer configurations, transmit qualified leads, track lightweight operational metrics, and provide administrative visibility for showroom advisors.

---

## 2. Pluggable Database Providers

The starter template provides switchable database configurations toggled via `DATABASE_PROVIDER` in `.env.local`:
* **Option A: Supabase + Drizzle ORM (Recommended)** — PostgreSQL serverless database with type-safe schema definitions and Row-Level Security (RLS).
* **Option B: Firebase Firestore + Drizzle** — Google Cloud Firestore document database for zero-config prototyping.

---

## 3. Data Schema & Entities

### 3.1 `configurations` Table
Stores client interior configurations generated in the 3D atelier:
* `id`: UUID (Primary Key)
* `reference_code`: String (Unique, e.g. `AL-SC-2026-A8F2`)
* `vehicle_id`: String (e.g. `mercedes-s-class-v223`)
* `selections`: JSONB (Complete zone-to-material selection mapping)
* `summary`: JSONB (Precomputed human-readable summary object)
* `created_at`: Timestamp (Default: `NOW()`)
* `updated_at`: Timestamp

### 3.2 `enquiries` Table
Stores inbound sales consultation leads and voluntary contact details:
* `id`: UUID (Primary Key)
* `configuration_id`: UUID (Foreign Key references `configurations.id`)
* `reference_code`: String (Indexed for rapid showroom lookup)
* `customer_name`: String
* `phone_or_whatsapp`: String
* `email`: String (Optional)
* `preferred_channel`: Enum (`whatsapp`, `showroom_visit`, `phone`, `email`)
* `customer_notes`: Text (Optional)
* `existing_vehicle_condition`: String (`excellent`, `good`, `worn`, `damaged`)
* `status`: Enum (`new`, `contacted`, `showroom_scheduled`, `quotation_pending`, `closed`)
* `assigned_advisor`: String (Optional)
* `internal_notes`: Text (Optional)
* `created_at`: Timestamp

### 3.3 `analytics_events` Table
Lightweight operational telemetry:
* `id`: UUID (Primary Key)
* `event_name`: String (`showroom_entered`, `material_swapped`, `preset_changed`, `enquiry_submitted`)
* `vehicle_id`: String
* `reference_code`: String (Optional)
* `metadata`: JSONB
* `created_at`: Timestamp

---

## 4. API Endpoints & Server Actions

| Route / Action | Method | Description | Security & Rate Limiting |
| :--- | :--- | :--- | :--- |
| `POST /api/configurations` | `POST` | Saves a newly generated configuration object. | Rate limited: 30 requests / min / IP. Zod validated. |
| `GET /api/configurations/[ref]` | `GET` | Fetches configuration summary for a showroom advisor or returning client. | Public read-only cached route. |
| `POST /api/enquiries` | `POST` | Submits a customer consultation lead with contact details. | Rate limited: 5 requests / min / IP. Anti-spam honeypot. |
| `GET /api/admin/enquiries` | `GET` | Administrative feed of inbound leads and configurations. | Protected by HTTP-only admin session / API key. |

---

## 5. Security & Data Protection Controls

1. **Input Validation:** Every payload is strictly validated via Zod schemas (`src/types/`) before interacting with the database.
2. **Voluntary Data Collection:** The showroom only collects contact details when explicitly submitted by the client with affirmative consent (`consentToContact: true`).
3. **Secrets Management:** Database connection strings, Supabase service keys, and WhatsApp API keys reside strictly in `.env.local` and environment secrets. No credentials are baked into client bundles.
