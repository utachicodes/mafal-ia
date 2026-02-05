
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env');
console.log('Env path:', envPath);
console.log('Env exists:', fs.existsSync(envPath));

const envConfig = dotenv.parse(fs.readFileSync(envPath));
console.log('Loaded keys:', Object.keys(envConfig));
console.log('DIRECT_URL present:', !!envConfig.DIRECT_URL);

// Also check process.env after config()
dotenv.config();
console.log('process.env.DIRECT_URL present:', !!process.env.DIRECT_URL);
