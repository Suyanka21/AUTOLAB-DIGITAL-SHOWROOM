# Hosting, Ownership & Handover (draft for GATE-09)

The existing docs describe a deployment but name no host, no account owner and no running-cost payer. This draft fills that gap. Everything here is a PROPOSAL for the owner and AutoLab to confirm.

## 1. Constraints to respect
- A free hobby tier on a hosting platform is usually restricted to non-commercial use. Vercel's free Hobby plan is such a plan, so a paid client site needs a paid plan or a different host. Re-check the host's current terms before choosing.
- A GLB of several MB must be cached hard (immutable cache headers, hashed file names) and served from a CDN or object storage.
- Visitors will often be on mobile data in Kenya: the low-LOD first load matters for cost and speed.

## 2. Options to evaluate (decide at GATE-09)
| Layer | Option | To verify before choosing |
| :--- | :--- | :--- |
| App hosting | Vercel Pro | Monthly cost, bandwidth limits, region latency from Nairobi |
| App hosting | Another host that permits commercial use | Next.js 16 support, build limits, asset size limits |
| Database | Supabase | Nearest available region; cross-border transfer implications (see the privacy document) |
| Large assets | Object storage plus CDN, or the host's own static asset delivery | Per-file size limits, egress cost |

## 3. Ownership rule
Accounts for the domain, hosting, database, analytics and the GitHub repository belong to AutoLab (or are transferred to AutoLab at handover). The developer is a collaborator. Credentials live in a password manager, not in chat, email or the repo.

## 4. Running costs (fill in)
| Item | Paid by | Monthly estimate | Notes |
| :--- | :--- | :--- | :--- |
| Domain | | | |
| App hosting | | | |
| Database | | | |
| Monitoring | | | |

The decision freeze allows KES 35,000 for AI, tooling and infrastructure. Treat that as development-period cost. Ongoing hosting is AutoLab's cost unless the contract says otherwise.

## 5. Handover checklist
- [ ] Repository transferred or shared with AutoLab as owner
- [ ] `.env.example` complete; production values held by AutoLab
- [ ] Uptime monitoring on the site and the enquiry endpoint
- [ ] Database backups enabled and a restore tested once
- [ ] Rollback procedure written and tried once
- [ ] One-page runbook: how to rotate the WhatsApp number, update the catalogue, read enquiries
- [ ] Agreed support window and contact
