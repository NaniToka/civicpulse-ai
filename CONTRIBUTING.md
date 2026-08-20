# Contributing to CivicPulse AI

Thank you for your interest in contributing to **CivicPulse AI**! CivicPulse AI is an open-source Digital Public Good built to transform citizen feedback into evidence-driven public infrastructure priorities.

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.10+
- **Node.js**: v18+ (Node 22 recommended)
- **Docker**: (Optional, for containerized local testing)

### Local Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NaniToka/civicpulse-ai.git
   cd civicpulse-ai
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🧪 Testing & Code Quality Guidelines

Before submitting a Pull Request, please ensure all verification checks pass:

### Backend Checks
```bash
cd backend
.venv/bin/pytest           # Run Pytest suite
.venv/bin/ruff check .    # Run Ruff linter
```

### Frontend Checks
```bash
cd frontend
npm run lint              # Run ESLint
npx tsc --noEmit          # Verify TypeScript type compilation
npm run build             # Verify Vite production build
```

### Automated Monorepo Script
```bash
./scripts/verify_project.sh
```

---

## 📌 Commit Message Conventions

We follow Conventional Commits:
- `feat:` New features or capabilities
- `fix:` Bug fixes or security patches
- `docs:` Documentation updates
- `test:` Adding or updating unit tests
- `chore:` Maintenance, Docker updates, or dependency management

---

## 🛡️ Security & Privacy

Do not commit API keys, `.env` files, or private credentials. See [SECURITY.md](SECURITY.md) for our security reporting procedure.
