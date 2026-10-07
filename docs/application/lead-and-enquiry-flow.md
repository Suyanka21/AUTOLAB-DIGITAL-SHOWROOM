# Lead & Enquiry Flow Specification
**Document:** `docs/application/lead-and-enquiry-flow.md`  
**Authority:** Product Blueprint & Decision Freeze (Sections 8 & 14)  
**Target Consumer:** Frontend Developers & AutoLab Sales Operations  

---

## 1. The Sales Handoff Philosophy

The AutoLab Digital Showroom does not aim to replace personal client relationships with cold e-commerce carts. Instead, it serves as a powerful sales catalyst:
```
[ Digital 3D Experience ]
           │
           ▼
[ Customer Excitement & Configuration ]
           │
           ▼
[ Unique Reference Code (AL-SC-2026-XXXX) ]
           │
           ▼
[ Inbound Lead to AutoLab Atelier ] (WhatsApp or Showroom Booking)
           │
           ▼
[ Physical Vehicle Inspection & Tailored Quotation ]
           │
           ▼
[ Physical Craftsmanship & Transformation in Workshop ]
```

---

## 2. Channel 1: WhatsApp Direct Atelier Launch

WhatsApp is the dominant premium communication channel for automotive clients in Kenya and East Africa. The configurator enables one-tap direct messaging with full context pre-loaded:

### Technical Implementation
* **Destination:** AutoLab Official WhatsApp Business Number (configured via `NEXT_PUBLIC_AUTOLAB_WHATSAPP_NUMBER`).
* **Deep Link:** `https://wa.me/{NUMBER}?text={ENCODED_MESSAGE}`

### Standardized Message Template
```text
Hello AutoLab Atelier,

I have configured a bespoke interior for my vehicle in your Digital Showroom:

• Reference Code: AL-SC-2026-8A3F
• Vehicle Platform: Mercedes-Benz S-Class (V223 LWB)
• Primary Leather: Sienna Brown Nappa (Code 502A)
• Secondary Bolsters: Obsidian Black Nappa (Code 501A)
• Trim Finish: Anthracite Open-Pore Poplar Wood
• Accent Stitching: Champagne Gold Contrast (Diamond Quilt)
• Ambient Mood: Sunset Orange 253-LED Bloom

I would like to schedule a consultation at your showroom to inspect leather swatches and discuss transforming my vehicle.

My Name: [Client Name]
```

---

## 3. Channel 2: Showroom Consultation Booking Form

For clients who prefer scheduling an in-person appointment directly on the web app:

### Form Fields
1. **Full Name** (Required, min 2 chars)
2. **Phone Number / WhatsApp** (Required, validated Kenyan/International format)
3. **Email Address** (Optional)
4. **Preferred Consultation Mode:**
   * In-Person Showroom Visit (Nairobi Atelier)
   * WhatsApp Digital Swatch Consultation
   * Direct Phone Call
5. **Existing Vehicle Details (Optional):**
   * Model Year (e.g. 2022)
   * Current Interior Condition (Excellent / Good / Worn / Damaged)
6. **Consent Checkbox:** Affirmative consent to contact.

---

## 4. Sales Advisor Workflow

When an advisor receives an inquiry carrying a Reference Code:
1. The advisor enters the reference code into the lightweight administration tool (`/admin`) or reads the WhatsApp summary.
2. The advisor immediately knows the client's design vision, preferred leather tone, and desired veneer finish.
3. Before the client arrives, the advisor prepares physical samples:
   * Genuine Sienna Brown Nappa leather hide swatch;
   * Open-pore Poplar timber sample block;
   * Contrast Champagne Gold stitch pattern sample.
4. When the client enters the showroom, the conversation begins at an elite consultative level rather than starting from zero, dramatically accelerating quotation conversion.
