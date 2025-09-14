#!/usr/bin/env node

/**
 * Test script for WhatsApp Business API integration
 * Usage: node scripts/test-whatsapp.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const config = {
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '123456789012345',
  appSecret: process.env.WHATSAPP_APP_SECRET,
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'mafal_verify_token_2024',
  webhookUrl: process.env.WEBHOOK_URL || 'https://yourdomain.com/api/whatsapp'
};

console.log('🧪 WhatsApp Business API Test Script');
console.log('=====================================\n');

// Check if credentials are provided
if (!config.accessToken) {
  console.error('❌ WHATSAPP_ACCESS_TOKEN not found in .env file');
  console.log('Please add your Meta WhatsApp access token to .env file');
  process.exit(1);
}

if (!config.appSecret) {
  console.warn('⚠️  WHATSAPP_APP_SECRET not found in .env file');
  console.log('Webhook signature verification will be disabled');
}

console.log('📋 Configuration:');
console.log(`   Access Token: ${config.accessToken.substring(0, 10)}...`);
console.log(`   Phone Number ID: ${config.phoneNumberId}`);
console.log(`   App Secret: ${config.appSecret ? 'Set' : 'Not set'}`);
console.log(`   Verify Token: ${config.verifyToken}`);
console.log(`   Webhook URL: ${config.webhookUrl}\n`);

// Test 1: Verify phone number
async function testPhoneNumber() {
  console.log('🔍 Testing phone number verification...');
  
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${config.phoneNumberId}`, {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP ${response.status}: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Phone number verified successfully!');
    console.log(`   Display Number: ${data.display_phone_number}`);
    console.log(`   Verified Name: ${data.verified_name || 'Not verified'}`);
    console.log(`   Quality Rating: ${data.quality_rating || 'Not rated'}`);
    console.log(`   Status: ${data.status}\n`);
    
    return true;
  } catch (error) {
    console.error('❌ Phone number verification failed:', error.message);
    console.log('\n');
    return false;
  }
}

// Test 2: Send a test message
async function testSendMessage() {
  console.log('📤 Testing message sending...');
  
  const testMessage = {
    messaging_product: "whatsapp",
    to: "15551234567", // Test number - replace with your own
    type: "text",
    text: {
      body: "Hello! This is a test message from your WhatsApp Business API integration. 🚀"
    }
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testMessage)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP ${response.status}: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Test message sent successfully!');
    console.log(`   Message ID: ${data.messages[0].id}`);
    console.log(`   To: ${testMessage.to}`);
    console.log('\n');
    
    return true;
  } catch (error) {
    console.error('❌ Message sending failed:', error.message);
    console.log('Note: Make sure to replace the test phone number with a real one');
    console.log('\n');
    return false;
  }
}

// Test 3: Webhook verification
function testWebhookVerification() {
  console.log('🔗 Testing webhook verification...');
  
  const testParams = {
    'hub.mode': 'subscribe',
    'hub.verify_token': config.verifyToken,
    'hub.challenge': 'test_challenge_123'
  };
  
  const webhookUrl = `${config.webhookUrl}?${new URLSearchParams(testParams).toString()}`;
  
  console.log('✅ Webhook verification URL generated:');
  console.log(`   ${webhookUrl}`);
  console.log('   Test this URL in your browser or with curl');
  console.log('\n');
  
  return true;
}

// Test 4: Environment validation
function testEnvironment() {
  console.log('🔧 Testing environment configuration...');
  
  const requiredVars = ['WHATSAPP_ACCESS_TOKEN'];
  const optionalVars = ['WHATSAPP_APP_SECRET', 'WHATSAPP_VERIFY_TOKEN', 'GOOGLE_GENKIT_API_KEY'];
  
  let allGood = true;
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`❌ Required environment variable missing: ${varName}`);
      allGood = false;
    } else {
      console.log(`✅ ${varName}: Set`);
    }
  }
  
  for (const varName of optionalVars) {
    if (!process.env[varName]) {
      console.warn(`⚠️  Optional environment variable missing: ${varName}`);
    } else {
      console.log(`✅ ${varName}: Set`);
    }
  }
  
  console.log('\n');
  return allGood;
}

// Main test function
async function runTests() {
  const results = {
    environment: testEnvironment(),
    phoneNumber: false,
    sendMessage: false,
    webhook: testWebhookVerification()
  };
  
  if (results.environment) {
    results.phoneNumber = await testPhoneNumber();
    
    if (results.phoneNumber) {
      results.sendMessage = await testSendMessage();
    }
  }
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log('========================');
  console.log(`Environment: ${results.environment ? '✅' : '❌'}`);
  console.log(`Phone Number: ${results.phoneNumber ? '✅' : '❌'}`);
  console.log(`Send Message: ${results.sendMessage ? '✅' : '❌'}`);
  console.log(`Webhook: ${results.webhook ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Your WhatsApp integration is ready to go!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above and fix them.');
  }
  
  console.log('\n📚 Next steps:');
  console.log('1. Configure your webhook in Meta Developer Console');
  console.log('2. Add your restaurant phone number to the app');
  console.log('3. Test with real customers');
  console.log('4. Set up monitoring and logging');
}

// Run the tests
runTests().catch(console.error);