# 🚀 Quick Start - WhatsApp Business API

Get your WhatsApp Business API integration working in minutes!

## 1. Get Meta Credentials

1. Go to [Meta for Developers](https://developers.facebook.com/apps/)
2. Create a new app → Choose "Business"
3. Add WhatsApp product
4. Get your credentials:
   - **Access Token**: From API Setup → Generate Token
   - **App Secret**: From App Settings → Basic
   - **Phone Number ID**: From API Setup → Phone number

## 2. Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Add your credentials:
```env
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_APP_SECRET=your_app_secret_here
WHATSAPP_VERIFY_TOKEN=mafal_verify_token_2024
GOOGLE_GENKIT_API_KEY=your_google_ai_api_key
```

## 3. Start Your App

```bash
npm run dev
```

## 4. Test Connection

```bash
# Test your WhatsApp API connection
npm run test:whatsapp

# Test webhook verification
./scripts/verify-webhook.sh
```

## 5. Configure Webhook

1. Go to your Meta app → WhatsApp → Configuration
2. Set webhook URL: `https://yourdomain.com/api/whatsapp`
3. Set verify token: `mafal_verify_token_2024`
4. Subscribe to `messages` field
5. Click "Verify and Save"

## 6. Set Up Restaurant

1. Go to `/whatsapp/quick-connect` in your app
2. Enter your Meta credentials
3. Click "Test Connection"
4. Select a restaurant and configure it

## 7. Test with Real Messages

Send a WhatsApp message to your business number and watch the magic happen! 🎉

## Troubleshooting

- **Webhook fails**: Make sure your app is publicly accessible
- **No messages received**: Check phone number is added to Meta app
- **API errors**: Verify your access token is correct and not expired

## Need Help?

- 📖 Full setup guide: [WHATSAPP_SETUP_GUIDE.md](./WHATSAPP_SETUP_GUIDE.md)
- 🧪 Test script: `npm run test:whatsapp`
- 🔗 Webhook test: `./scripts/verify-webhook.sh`

Your WhatsApp Business API is now ready to handle real customer conversations!