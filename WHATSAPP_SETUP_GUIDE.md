# WhatsApp Business API Setup Guide

This guide will help you set up a real WhatsApp Business API integration using Meta's official API, just like wazzap.ai.

## Prerequisites

1. A Meta for Developers account
2. A verified business (or personal account for testing)
3. A phone number that can receive SMS/calls for verification
4. Your application deployed with a public URL (for webhook)

## Step 1: Create a Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/apps/)
2. Click "Create App"
3. Choose "Business" as the app type
4. Fill in your app details:
   - App Name: Your restaurant name or app name
   - App Contact Email: Your email
   - Business Account: Select or create a business account

## Step 2: Add WhatsApp Product

1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set up"
3. You'll see the WhatsApp configuration page

## Step 3: Get Your Credentials

### Access Token
1. In the WhatsApp product page, go to "API Setup"
2. Under "Temporary access token", click "Generate Token"
3. Copy this token (it expires in 24 hours, you'll need a permanent one later)

### App Secret
1. Go to "App Settings" → "Basic"
2. Under "App Secret", click "Show"
3. Copy the App Secret

### Phone Number ID
1. In the WhatsApp product page, go to "API Setup"
2. Under "Phone number", you'll see your Phone Number ID
3. Copy this ID

## Step 4: Configure Your Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials in `.env`:
   ```env
   WHATSAPP_ACCESS_TOKEN=your_access_token_here
   WHATSAPP_APP_SECRET=your_app_secret_here
   WHATSAPP_VERIFY_TOKEN=mafal_verify_token_2024
   GOOGLE_GENKIT_API_KEY=your_google_ai_api_key
   ```

## Step 5: Set Up Webhook

1. In your app's WhatsApp product page, go to "Configuration"
2. Set the webhook URL to: `https://yourdomain.com/api/whatsapp`
3. Set the verify token to: `mafal_verify_token_2024`
4. Subscribe to the `messages` field
5. Click "Verify and Save"

## Step 6: Test Your Integration

1. Start your application:
   ```bash
   npm run dev
   ```

2. Go to `/whatsapp/quick-connect` in your app
3. Enter your Meta credentials
4. Click "Test Connection" to verify everything works
5. Select a restaurant and configure it

## Step 7: Get a Permanent Access Token

The temporary token expires in 24 hours. To get a permanent one:

1. Go to "WhatsApp" → "API Setup"
2. Under "Permanent access token", click "Generate Token"
3. Follow the steps to verify your business
4. Replace the temporary token in your `.env` file

## Step 8: Add a Phone Number

1. In the WhatsApp product page, go to "Phone Numbers"
2. Click "Add phone number"
3. Enter your business phone number
4. Verify it via SMS or call
5. Note the Phone Number ID for this number

## Step 9: Configure Your Restaurant

1. In your app, go to the restaurant settings
2. Enter the Phone Number ID from step 8
3. The system will automatically use this for WhatsApp messages

## Testing Your Integration

1. Send a message to your WhatsApp Business number
2. You should receive an automated response from your AI assistant
3. Test ordering functionality by asking for menu items
4. Test location sharing for delivery estimates

## Troubleshooting

### Common Issues

1. **Webhook verification fails**
   - Make sure your app is publicly accessible
   - Check that the verify token matches exactly
   - Ensure your server is running

2. **Messages not being received**
   - Verify the phone number is added to your Meta app
   - Check that the webhook is properly configured
   - Look at your server logs for errors

3. **Access token errors**
   - Make sure you're using the correct token
   - Check if the token has expired
   - Verify the token has the right permissions

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## Production Considerations

1. **Security**
   - Never commit your `.env` file to version control
   - Use environment variables in production
   - Rotate your access tokens regularly

2. **Scaling**
   - Consider using a message queue for high volume
   - Implement rate limiting
   - Monitor API usage and costs

3. **Monitoring**
   - Set up logging for all WhatsApp interactions
   - Monitor webhook delivery success rates
   - Track message response times

## API Limits

- **Rate Limits**: 1000 messages per day (free tier)
- **Message Types**: Text, location, media messages
- **Webhook**: Must respond within 20 seconds
- **Phone Numbers**: 1 per app (free tier)

## Support

- [Meta WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [WhatsApp Business API Pricing](https://developers.facebook.com/docs/whatsapp/pricing)
- [Community Support](https://developers.facebook.com/community/)

## Next Steps

Once your basic integration is working:

1. Add menu management for your restaurant
2. Implement order tracking
3. Add payment integration
4. Set up analytics and reporting
5. Customize the AI responses for your brand

Your WhatsApp Business API integration is now ready to handle real customer conversations!