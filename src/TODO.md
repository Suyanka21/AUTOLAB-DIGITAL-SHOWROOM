# AUTOLAB DIGITAL SHOWROOM
## Antigravity Production Preparation TODO

**Role:** Antigravity  
**Purpose:** Prepare and codify the AutoLab Digital Showroom repository for downstream production by Astra.

---

# 1. YOUR JOB

You are **not the final production agent for this project**.

Your job is to take:

1. The existing **agent-skills starter template**
2. The AutoLab **Product Blueprint & Decision Freeze**
3. The AutoLab **S-Class 3D Asset Brief**
4. The AutoLab **Research & Evidence Pack**

and turn them into a **fully organised, technically coherent, Astra-ready production repository**.

Your primary responsibility is:

> **CODIFY THE PRODUCT.**

Astra will later use your work to implement the application and produce the 3D asset through Blender.

Do not replace the product decisions with your own ideas.

Do not expand the scope.

Do not build a different product.

---

# 2. SOURCE OF TRUTH HIERARCHY

Treat the project sources in this order:

### Authority 1 — Product Blueprint & Decision Freeze

Defines:

- what the product is;
- why it exists;
- who it serves;
- V1 scope;
- product boundaries;
- commercial intent;
- customer journey;
- success definition;
- non-goals;
- expansion boundary.

### Authority 2 — S-Class 3D Asset Brief

Defines the research-derived requirements and evidence needed for the S-Class 3D asset.

### Authority 3 — Research & Evidence Pack

Provides the underlying research, references, evidence and source material.

### Authority 4 — Starter Template

Provides the engineering environment, agent skills, development rules, architecture conventions, documentation conventions, testing practices and implementation discipline.

### Authority 5 — Your own technical judgement

Use this only to translate the above into technical documentation and production structure.

If sources conflict:

**Do not silently resolve the conflict.**

Document the conflict and identify what requires human confirmation.

---

# 3. FIRST TASK — INSPECT THE STARTER TEMPLATE

Before creating project-specific architecture, thoroughly inspect the starter template.

Understand:

- repository structure;
- `AGENTS.md`;
- `.agents/`;
- installed skills;
- documentation conventions;
- development workflow;
- testing workflow;
- browser testing;
- frontend engineering rules;
- API rules;
- security rules;
- performance rules;
- code review rules;
- CI/CD rules;
- auditing rules;
- shipping rules;
- existing `/docs` conventions;
- existing asset conventions;
- existing configuration conventions.

The starter template is the **engineering foundation**.

Do not casually replace its architecture.

Do not remove its existing engineering safeguards.

Do not weaken its agent instructions.

Extend the template intelligently for AutoLab.

---

# 4. INGEST THE AUTOLAB DOCUMENTS

The `/docs` directory will contain:

- `AUTOLAB DIGITAL SHOWROOM - Product Blueprint and Decision Freeze`
- `AUTOLAB_S_CLASS_3D_ASSET_BRIEF.md`
- MERCEDES\_S\_CLASS\_REPORT.md

Read all three completely.

Do not work from filenames alone.

Extract and reconcile:

- product mission;
- customer;
- category;
- customer journey;
- V1 scope;
- exclusions;
- expansion boundary;
- configuration model;
- data model;
- 3D requirements;
- material requirements;
- asset requirements;
- technical constraints;
- unresolved decisions;
- evidence confidence;
- source references;
- assumptions;
- risks.

---

# 5. CREATE THE AUTOLAB TECHNICAL TRUTH LAYER

Create a clean documentation structure inside the repository using the conventions of the starter template.

The exact filenames may follow the template's existing documentation architecture, but the repository must contain clearly identifiable documentation for at least:

### Product

- Product Constitution
- Decision Freeze
- Product Scope
- Customer Journey
- Success Definition
- V1 Non-Goals
- Expansion Boundary

### 3D / Assets

- S-Class Reference Specification
- S-Class 3D Asset Specification
- Interior Component Map
- Material Specification
- Texture Requirements
- Asset Production Requirements
- 3D Viewer Requirements
- Asset Validation Requirements

### Configuration

- Configuration Model
- Configuration State
- Configuration Options
- Configuration Object
- Configuration Summary
- Future Vehicle Expansion Model

### Application

- Application Architecture
- Frontend Architecture
- Backend/Data Architecture
- 3D/Application Integration
- Lead / Enquiry Flow
- Lightweight Administration Requirements

### Quality

- Functional Acceptance Criteria
- 3D Acceptance Criteria
- Performance Requirements
- Browser/Device Requirements
- QA Strategy
- Production Readiness Checklist

Do not create unnecessary documentation merely to increase document count.

Every document should exist because Astra will need it.

---

# 6. CREATE A MACHINE-READABLE PRODUCTION PLAN

The repository must make it possible for Astra to understand:

> What are we building?

> Why are we building it?

> What must be built first?

> What must not be built?

> What is known?

> What is unknown?

> What requires human approval?

> What does the 3D asset need to contain?

> How does the 3D asset connect to the application?

> How will we know the implementation is correct?

Convert ambiguous natural-language requirements into explicit technical requirements wherever the source material supports doing so.

---

# 7. 3D ASSET PIPELINE

This distinction is critical.

### Antigravity does NOT own final 3D production.

Your responsibility is to **codify the 3D production requirements**.

Astra will later use Blender to actually produce the 3D asset.

Therefore document:

- target S-Class;
- required interior scope;
- component hierarchy;
- geometry priorities;
- material zones;
- texture requirements;
- camera/view requirements;
- interaction requirements;
- expected asset formats;
- optimisation requirements;
- naming conventions;
- scene structure;
- material naming;
- configuration-ready geometry;
- configuration-ready materials;
- performance requirements;
- validation criteria.

Where the S-Class Asset Brief identifies uncertainty, preserve that uncertainty.

Do not invent geometry.

Do not invent AutoLab material offerings.

Do not turn assumptions into facts.

---

# 8. DESIGN THE ASSET HANDOFF FOR ASTRA

The final repository should make the following workflow possible:

**Research**

↓

**S-Class Asset Brief**

↓

**Antigravity technical codification**

↓

**Blender production specification**

↓

**Astra 3D asset production**

↓

**3D validation**

↓

**Web optimisation**

↓

**Integration with Digital Showroom**

Astra should not have to reconstruct the requirements from the original research documents.

Your job is to remove that ambiguity.

---

# 9. CONFIGURATION ARCHITECTURE

Codify the configuration system around the frozen V1 experience.

The current conceptual flow is:

**Vehicle**

↓

**Material**

↓

**Colour**

↓

**Accent Thread**

↓

**Visual Configuration**

The architecture must allow future configuration dimensions without requiring a complete rebuild.

However:

**Future capability must not become V1 scope.**

Document the extension mechanism without implementing unnecessary future functionality.

---

# 10. FUTURE VEHICLE ARCHITECTURE

This is important.

The S-Class is the **first vehicle**, not the permanent architecture.

The same pipeline must eventually support additional AutoLab vehicles such as:

- Range Rover;
- Toyota Hilux;
- other premium/luxury vehicles;
- additional vehicles selected by AutoLab.

Therefore design the architecture around a **vehicle-asset abstraction**, rather than hard-coding the entire application around Mercedes-Benz.

The first implementation may contain only the S-Class.

The architecture should make future vehicle additions predictable.

Conceptually:

**Vehicle Definition**

→ 3D Asset

→ Interior Components

→ Material Zones

→ Configuration Options

→ Visual State

→ Configuration Summary

Each future vehicle should be able to enter through the same controlled pipeline.

---

# 11. DO NOT BUILD A GENERIC AUTOMOTIVE PLATFORM

Future extensibility does not mean building a giant automotive platform.

Do not introduce:

- vehicle databases;
- VIN systems;
- automotive specifications databases;
- vehicle marketplaces;
- generic car configurators;
- unnecessary APIs;
- unnecessary account systems;
- unnecessary CMS infrastructure.

The product remains:

> **AutoLab's premium digital interior showroom.**

---

# 12. APPLICATION ARCHITECTURE

Codify the application around the actual V1 experience.

At minimum, the architecture should clearly represent:

### Experience

Digital showroom entry and presentation.

### Vehicle

S-Class interior environment.

### Viewer

Interactive 3D experience.

### Configuration

Material, colour and accent-thread selections.

### Visual State

Relationship between configuration choices and the 3D representation.

### Summary

Structured representation of the customer's configuration.

### Enquiry

Transition from digital configuration to AutoLab engagement.

### Data

Only the persistence actually required by V1.

---

# 13. BACKEND PRINCIPLE

Keep the backend intentionally lean.

The system may need to support:

- configurations;
- configuration references;
- enquiries;
- customer/contact information where voluntarily supplied;
- basic operational analytics where justified.

Do not create enterprise infrastructure.

Do not create a full CRM.

Do not create a workshop-management system.

Do not create e-commerce.

Do not create automated quotation logic unless explicitly added to scope later.

---

# 14. HUMAN APPROVAL GATES

Clearly identify decisions that cannot be safely invented by an AI agent.

At minimum:

- exact S-Class generation/model;
- approved AutoLab material catalogue;
- approved colours;
- approved accent-thread options;
- exact configuration depth;
- AutoLab branding;
- approved customer contact destination;
- final 3D asset quality.

Create explicit TODOs or approval markers for unresolved items.

Do not hide unresolved decisions inside implementation assumptions.

---

# 15. EVIDENCE & LICENSING

The research contains reference material.

Distinguish between:

### Reference material

Used to understand the vehicle and construct the asset.

### Production asset

Material actually incorporated into the final commercial product.

Do not assume that an online image, video, CAD file, 3D model or other asset is commercially cleared merely because it is publicly accessible.

Where licensing is uncertain, mark it clearly.

The final Astra workflow should know which references are:

- safe/approved;
- reference-only;
- licensing uncertain;
- requiring human verification.

---

# 16. ACCEPTANCE CRITERIA

Create concrete acceptance criteria.

The final product should be testable against statements such as:

- customer can enter the Digital Showroom;
- customer can access the S-Class interior;
- customer can interact with the 3D environment;
- customer can change supported material options;
- customer can change supported colours;
- customer can change supported accent thread;
- visual state updates correctly;
- configuration state remains internally consistent;
- configuration summary reflects actual selections;
- enquiry flow carries the relevant configuration information;
- experience works on supported devices;
- 3D asset meets defined performance requirements;
- no unsupported AutoLab capability is presented as available.

Do not create acceptance criteria for features excluded from V1.

---

# 17. PERFORMANCE MUST BE PART OF THE SPEC

The 3D experience cannot be treated as an ordinary website asset.

Document requirements around:

- model size;
- texture size;
- loading;
- progressive loading where appropriate;
- memory;
- frame rate;
- mobile behaviour;
- desktop behaviour;
- interaction responsiveness;
- asset compression;
- WebGL limitations;
- fallback behaviour where required.

Exact numerical thresholds should only be introduced where technically justified by the project or starter-template standards.

Do not invent arbitrary performance numbers.

---

# 18. SECURITY & DATA

Follow the security practices already established by the starter template.

Document:

- data validation;
- input handling;
- enquiry protection;
- rate limiting where appropriate;
- secrets management;
- environment configuration;
- database security;
- access control;
- admin protection;
- privacy considerations.

Do not over-engineer security around functionality that does not exist.

---

# 19. DO NOT IMPLEMENT THE PRODUCT

At this stage:

**Do not begin full application production.**

Your primary deliverable is the **codified production environment for Astra**.

You may create:

- documentation;
- specifications;
- schemas;
- technical plans;
- asset structures;
- placeholder directories;
- configuration contracts;
- machine-readable definitions;
- implementation scaffolding where required by the starter template.

Do not spend the project budget or introduce external paid assets.

Do not purchase a 3D model.

Do not introduce third-party 3D assets merely because they appear convenient.

---

# 20. ZERO-PURCHASE 3D FEASIBILITY GATE

The project should initially proceed under a zero-purchase assumption.

Prepare the repository so Astra can attempt the S-Class asset using:

- approved research;
- approved references;
- Blender;
- procedural/modelling workflows;
- AI-assisted asset production.

Only after the resulting asset is evaluated should the project determine whether an external asset is genuinely necessary.

If an external asset eventually becomes necessary, document:

- why;
- what requirement cannot be met;
- what type of asset is required;
- licensing implications;
- commercial impact.

Do not make the purchase decision yourself.

---

# 21. ASTRA HANDOFF DOCUMENT

Create a clear final document for the downstream production agent.

It should answer:

### PROJECT

What is AutoLab Digital Showroom?

### MISSION

Why does it exist?

### V1

What exactly is being built?

### VEHICLE

What S-Class is being represented?

### 3D

What must the asset contain?

### CONFIGURATION

What can the customer change?

### APPLICATION

How does the experience work?

### DATA

What needs to be stored?

### LEAD

How does the customer reach AutoLab?

### CONSTRAINTS

What must not be built?

### UNKNOWN

What still requires confirmation?

### ACCEPTANCE

How do we know it works?

### NEXT ACTION

What should Astra do first?

This should be the clearest document in the repository for downstream implementation.

---

# 22. REPOSITORY ORGANISATION

Use the starter template's conventions.

Do not create arbitrary folders simply because this TODO lists examples.

The final repository should be:

- clean;
- understandable;
- documented;
- deterministic;
- free of duplicate specifications;
- free of abandoned experiments;
- free of contradictory instructions;
- ready for another AI agent to enter and work.

Every important decision should have one authoritative location.

---

# 23. SOURCE TRACEABILITY

Where practical, technical decisions derived from the research should be traceable back to their source.

For example:

**Requirement**

→ source document

→ evidence/reference

→ technical interpretation

→ implementation requirement

This is especially important for:

- S-Class geometry;
- material representation;
- AutoLab capabilities;
- configuration options;
- licensing;
- asset requirements.

---

# 24. FINAL SELF-AUDIT

Before handing the repository back, audit your own work.

Check:

### Product

- Does the documentation match the Decision Freeze?
- Did you accidentally expand V1?
- Did you introduce unsupported features?

### 3D

- Can Astra understand exactly what the S-Class asset needs to accomplish?
- Are geometry and material requirements clear?
- Are unknowns clearly marked?

### Architecture

- Can the S-Class be implemented without hard-coding the entire product around one vehicle?
- Can another vehicle be added through the same architecture?

### Engineering

- Did you preserve the starter template's engineering safeguards?
- Are testing and QA requirements clear?
- Are security and performance requirements represented?

### Astra readiness

- Could Astra enter this repository tomorrow and understand what to build?
- Is there a clear first implementation task?
- Are human approval gates obvious?
- Are there contradictions between documents?

If not, resolve the documentation before handoff.

---

# 25. GIT / REPOSITORY DELIVERY

When the repository is ready:

1. Ensure all required documentation is present.
2. Ensure the original source documents remain available where appropriate.
3. Ensure project-specific instructions are correctly integrated with the starter template.
4. Remove temporary files and unnecessary experiments.
5. Verify the repository structure.
6. Run the relevant documentation/configuration validation available in the starter template.
7. Commit the work.
8. Push the prepared project to the **AUTOLAB DIGITAL SHOWROOM** GitHub repository.

The repository should represent a deliberate production handoff, not a work-in-progress dump.

---

# 26. FINAL HANDOFF STATUS

At completion, provide a concise report containing:

### COMPLETED

What you created.

### DOCUMENTATION

Where the authoritative specifications live.

### 3D

Where the S-Class asset requirements live.

### ASTRA

What Astra should consume first.

### UNRESOLVED

What still requires human confirmation.

### RISKS

Any material technical or production risks discovered.

### REPOSITORY

Confirmation that the prepared state has been committed and pushed.

---

# FINAL PRINCIPLE

The objective is not to make the repository look impressive.

The objective is to make the repository **unambiguous**.

When Astra enters the repository, it should not have to ask:

> "What are we building?"

It should already know.

It should know:

**what AutoLab is building, why it is building it, what V1 contains, what the S-Class asset must do, how the configuration system works, what the architecture should support, what it must not build, what remains unknown, and how success will be tested.**

Your job is to create that clarity.

**Codify first.**

**Astra builds second.**