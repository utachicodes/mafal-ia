#!/bin/bash

# WhatsApp Webhook Verification Script
# Usage: ./scripts/verify-webhook.sh [webhook_url] [verify_token]

WEBHOOK_URL=${1:-"http://localhost:3000/api/whatsapp"}
VERIFY_TOKEN=${2:-"mafal_verify_token_2024"}

echo "🔗 Testing WhatsApp Webhook Verification"
echo "========================================"
echo "Webhook URL: $WEBHOOK_URL"
echo "Verify Token: $VERIFY_TOKEN"
echo ""

# Test webhook verification
VERIFY_URL="${WEBHOOK_URL}?hub.mode=subscribe&hub.verify_token=${VERIFY_TOKEN}&hub.challenge=test_challenge_123"

echo "Testing webhook verification..."
echo "URL: $VERIFY_URL"
echo ""

# Make the request
RESPONSE=$(curl -s -w "\n%{http_code}" "$VERIFY_URL")

# Split response and status code
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

echo "Response:"
echo "HTTP Status: $HTTP_CODE"
echo "Body: $BODY"
echo ""

if [ "$HTTP_CODE" = "200" ] && [ "$BODY" = "test_challenge_123" ]; then
    echo "✅ Webhook verification successful!"
    echo "Your webhook is properly configured and ready to receive messages."
else
    echo "❌ Webhook verification failed!"
    echo "Please check:"
    echo "1. Your server is running and accessible"
    echo "2. The webhook URL is correct"
    echo "3. The verify token matches your configuration"
    echo "4. Your webhook endpoint is properly implemented"
fi