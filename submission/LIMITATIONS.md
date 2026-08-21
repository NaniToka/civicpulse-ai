# Prototype Limitations & Technical Constraints

## Honest Engineering Disclosure
To demonstrate engineering maturity and transparency for hackathon evaluation, this document explicitly lists the current technical limitations and boundaries of CivicPulse AI v0.5.0 (Release Candidate).

---

## Technical & Architectural Limitations

1. **Synthetic Demonstration Data**:
   All seed datasets (`data/seed/*.json`) contain synthetic demonstration data created for prototyping purposes. All entities are explicitly marked with `"is_synthetic": true` / `"is_demo": true`. No live government databases are connected in this prototype release.

2. **Prototype Storage Layer**:
   The current application maintains state in memory via Python data structures (`_in_memory_requests`). Persistent database backends (such as PostgreSQL / PostGIS) represent the next phase of the production roadmap.

3. **Browser SpeechRecognition Dependency**:
   Voice input relies on client browser `SpeechRecognition` Web APIs (supported in Chrome/Edge) or typed text fallback. Audio binaries are parsed client-side and not saved as persistent raw audio files on the server.

4. **Language Evaluation Scope**:
   Native script heuristics and Gemini prompt boundaries have been evaluated across 7 primary languages (Telugu, Hindi, Marathi, Bengali, Portuguese, Zulu, English). Equal translation accuracy across all regional dialects is not guaranteed.

5. **In-Memory Rate Limiting**:
   API rate limiting uses an in-memory sliding-window IP filter (`RateLimitMiddleware`). Distributed production environments will require Redis-backed API gateway rate limiting.

6. **Prototype Deployment Scope**:
   The application is deployed in a single container cluster configuration for demonstration purposes. It does not currently feature multi-region failover or Kubernetes horizontal pod autoscaling.
