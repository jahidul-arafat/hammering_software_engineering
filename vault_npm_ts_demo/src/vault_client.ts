import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

console.log("VAULT_ADDR:", process.env.VAULT_ADDR);
console.log("VAULT_TOKEN:", process.env.VAULT_TOKEN ? "Token exists" : "No token found");
console.log("SECRET_PATH:", process.env.SECRET_PATH);

const VAULT_ADDR = process.env.VAULT_ADDR || '';
const VAULT_TOKEN = process.env.VAULT_TOKEN || '';
const SECRET_PATH = process.env.SECRET_PATH || '';

if (!VAULT_ADDR || !VAULT_TOKEN || !SECRET_PATH) {
    console.error("Missing environment variables. Please check your .env file.");
    process.exit(1);
}

async function fetchSecret() {
    try {
        const url = `${VAULT_ADDR}/v1/${SECRET_PATH}`;
        console.log("Fetching from URL:", url);

        const response = await axios.get(url, {
            headers: { 'X-Vault-Token': VAULT_TOKEN }
        });
        console.log('Secret Data:', response.data.data);
    } catch (error) {
        console.error('Error fetching secret:', error);
    }
}

fetchSecret();
