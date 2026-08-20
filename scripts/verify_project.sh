#!/usr/bin/env bash
set -e

echo "=================================================="
echo "  CivicPulse AI System Foundation Verification"
echo "=================================================="

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "-> 1. Inspecting Monorepo Files..."
[ -f "README.md" ] && echo "  [OK] README.md exists"
[ -f "LICENSE" ] && echo "  [OK] LICENSE exists"
[ -f ".gitignore" ] && echo "  [OK] .gitignore exists"
[ -f ".env.example" ] && echo "  [OK] .env.example exists"
[ -f "data/seed/regions.json" ] && echo "  [OK] Seed datasets exist"

echo ""
echo "-> 2. Verifying Backend Suite..."
if [ -d "backend" ]; then
    cd "$PROJECT_ROOT/backend"
    if [ -f ".venv/bin/activate" ]; then
        source .venv/bin/activate
    fi
    python3 -m pytest
    cd "$PROJECT_ROOT"
    echo "  [OK] Backend pytest suite passed"
else
    echo "  [WARN] Backend directory missing!"
    exit 1
fi

echo ""
echo "-> 3. Verifying Frontend Suite..."
if [ -d "frontend" ]; then
    cd "$PROJECT_ROOT/frontend"
    npm run build
    cd "$PROJECT_ROOT"
    echo "  [OK] Frontend build succeeded"
else
    echo "  [WARN] Frontend directory missing!"
    exit 1
fi

echo ""
echo "-> 4. Checking Git Status..."
git status --short

echo ""
echo "=================================================="
echo "  All Foundation Verification Checks Succeeded!  "
echo "=================================================="
