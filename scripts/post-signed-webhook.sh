#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   DOMAIN="mafal-ia.vercel.app" APP_SECRET="your_app_secret" BODY_FILE="./wa.json" ./scripts/post-signed-webhook.sh

DOMAIN=${DOMAIN:-}
APP_SECRET=${APP_SECRET:-}
BODY_FILE=${BODY_FILE:-./wa.json}

if [[ -z "${DOMAIN}" || -z "${APP_SECRET}" ]]; then
  echo "Usage: DOMAIN=your.domain APP_SECRET=your_secret BODY_FILE=./wa.json ./scripts/post-signed-webhook.sh" >&2
  exit 1
fi

if [[ ! -f "${BODY_FILE}" ]]; then
  echo "Body file not found: ${BODY_FILE}" >&2
  exit 1
fi

SIG="sha256=$(cat "${BODY_FILE}" | openssl sha256 -hmac "${APP_SECRET}" -binary | xxd -p -c 256)"

curl -i -X POST "https://${DOMAIN}/api/whatsapp" \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: ${SIG}" \
  --data-binary @"${BODY_FILE}"

