#!/usr/bin/env bash
# =============================================================================
# LearnMate AI — One-Click Deploy Script
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh                          # GitHub push + Vercel deploy
#   ./deploy.sh --render                 # GitHub push + Render (Docker) deploy
# =============================================================================
set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}[INFO]${RESET} $*"; }
success() { echo -e "${GREEN}[OK]${RESET}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET} $*"; }
error()   { echo -e "${RED}[ERR]${RESET}  $*"; exit 1; }

# ── Config ─────────────────────────────────────────────────────────────────
REPO_NAME="${REPO_NAME:-learnmate-ai}"
GITHUB_ORG="${GITHUB_ORG:-}"          # leave blank to use personal account
DEPLOY_TARGET="${1:-}"

echo -e "${BOLD}"
echo "  ██╗     ███████╗ █████╗ ██████╗ ███╗   ██╗███╗   ███╗ █████╗ ████████╗███████╗"
echo "  ██║     ██╔════╝██╔══██╗██╔══██╗████╗  ██║████╗ ████║██╔══██╗╚══██╔══╝██╔════╝"
echo "  ██║     █████╗  ███████║██████╔╝██╔██╗ ██║██╔████╔██║███████║   ██║   █████╗  "
echo "  ██║     ██╔══╝  ██╔══██║██╔══██╗██║╚██╗██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝  "
echo "  ███████╗███████╗██║  ██║██║  ██║██║ ╚████║██║ ╚═╝ ██║██║  ██║   ██║   ███████╗"
echo "  ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝"
echo -e "${RESET}"
echo -e "${CYAN}  AI — Desi SDE Pathway Orchestrator${RESET}"
echo ""

# ── 1. Check required tools ─────────────────────────────────────────────────
info "Checking required tools…"
for cmd in node npm git; do
  command -v "$cmd" &>/dev/null || error "$cmd is not installed. Install it first."
done

# ── 2. Copy .env.example → .env.local if needed ────────────────────────────
if [[ ! -f .env.local ]]; then
  if [[ -f .env.example ]]; then
    cp .env.example .env.local
    warn ".env.local created from .env.example — fill in IBM_WATSONX_API_KEY before deploying!"
  fi
else
  success ".env.local already exists."
fi

# ── 3. Install dependencies ─────────────────────────────────────────────────
info "Installing npm dependencies…"
npm ci --prefer-offline || npm install

# ── 4. Build check ──────────────────────────────────────────────────────────
info "Running Next.js production build…"
npm run build
success "Build passed!"

# ── 5. Git init & first commit ──────────────────────────────────────────────
if [[ ! -d .git ]]; then
  info "Initializing git repository…"
  git init -b main
  # Rename gitignore.txt → .gitignore
  [[ -f gitignore.txt ]] && mv gitignore.txt .gitignore
  git add -A
  git commit -m "feat: initial LearnMate AI commit — Desi SDE Pathway Orchestrator 🚀"
  success "Git repository initialized."
else
  info "Git repo already initialized. Staging changes…"
  [[ -f gitignore.txt ]] && mv gitignore.txt .gitignore
  git add -A
  git diff --cached --quiet || git commit -m "chore: update LearnMate AI — $(date '+%Y-%m-%d %H:%M')"
  success "Changes committed."
fi

# ── 6. GitHub remote setup ──────────────────────────────────────────────────
if command -v gh &>/dev/null; then
  if ! git remote get-url origin &>/dev/null; then
    info "Creating GitHub repository '${REPO_NAME}' via GitHub CLI…"
    if [[ -n "$GITHUB_ORG" ]]; then
      gh repo create "${GITHUB_ORG}/${REPO_NAME}" --public --source=. --remote=origin --push
    else
      gh repo create "${REPO_NAME}" --public --source=. --remote=origin --push
    fi
    success "Repository pushed to GitHub!"
  else
    info "Remote 'origin' already set. Pushing to main…"
    git push origin main --force-with-lease
    success "Pushed to GitHub."
  fi
else
  warn "GitHub CLI (gh) not found. Skipping GitHub automation."
  warn "Install it: https://cli.github.com/ and re-run, or push manually:"
  warn "  git remote add origin https://github.com/YOUR_USER/${REPO_NAME}.git"
  warn "  git push -u origin main"
fi

# ── 7. Deploy ───────────────────────────────────────────────────────────────
if [[ "$DEPLOY_TARGET" == "--render" ]]; then
  # Render deployment via render.yaml blueprint
  info "Render deployment mode selected."
  info "Render auto-deploys from GitHub. Ensure your Render service is connected."
  info "Set env vars in Render dashboard:"
  info "  IBM_WATSONX_API_KEY = <your key>"
  info "  IBM_PROJECT_ID      = bd20be8b-bbee-4a91-a1c7-4aaf7f995879"
  success "Push to GitHub main branch will trigger Render auto-deploy!"

else
  # Default: Vercel
  if command -v vercel &>/dev/null; then
    info "Deploying to Vercel (production)…"
    # Set Vercel secrets
    info "Setting Vercel environment variables…"
    if [[ -n "${IBM_WATSONX_API_KEY:-}" ]]; then
      echo "$IBM_WATSONX_API_KEY" | vercel env add IBM_WATSONX_API_KEY production --force 2>/dev/null || true
    fi
    echo "bd20be8b-bbee-4a91-a1c7-4aaf7f995879" | vercel env add IBM_PROJECT_ID production --force 2>/dev/null || true

    vercel --prod --yes
    success "🎉 Deployed to Vercel! Check your dashboard for the live URL."
  else
    warn "Vercel CLI not found. Install it: npm i -g vercel"
    warn "Then run: vercel --prod"
    info "Or use Render: ./deploy.sh --render"
  fi
fi

echo ""
echo -e "${BOLD}${GREEN}══════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}  LearnMate AI deploy complete! DSA phodenge! 💪${RESET}"
echo -e "${BOLD}${GREEN}══════════════════════════════════════════════════${RESET}"
