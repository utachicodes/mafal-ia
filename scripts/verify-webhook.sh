#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   DOMAIN="mafal-ia.vercel.app" VERIFY_TOKEN="your_token" ./scripts/verify-webhook.sh
# Optional: CHALLENGE (default: 123456)

DOMAIN=${DOMAIN:-}
VERIFY_TOKEN=${VERIFY_TOKEN:-}
CHALLENGE=${CHALLENGE:-123456}

if [[ -z "${DOMAIN}" || -z "${VERIFY_TOKEN}" ]]; then
  echo "Usage: DOMAIN=your.domain VERIFY_TOKEN=your_token ./scripts/verify-webhook.sh" >&2
  exit 1
fi

curl -i -G "https://${DOMAIN}/api/whatsapp" \
  --data-urlencode "hub.mode=subscribe" \
  --data-urlencode "hub.verify_token=${VERIFY_TOKEN}" \
  --data-urlencode "hub.challenge=${CHALLENGE}"

