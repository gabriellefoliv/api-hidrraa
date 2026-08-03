import fs from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env');

// Check if file exists
if (!fs.existsSync(envPath)) {
    console.error("❌ .env file not found!");
    process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');

// New values
const newVars = `
HEDERA_TOKEN_ID=0.0.7615329
APORTE_TOKEN_CONTRACT_ADDRESS=0.0.7615325
`;

// Append if not present (simple check)
if (!content.includes('APORTE_TOKEN_CONTRACT_ADDRESS=0.0.7615325')) {
    fs.appendFileSync(envPath, newVars);
    console.log("✅ Appended new vars to .env");
} else {
    console.log("ℹ️ Vars already present in .env");
}
