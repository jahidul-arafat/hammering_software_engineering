import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const VAULT_ADDR = process.env.VAULT_ADDR;
const VAULT_TOKEN = process.env.VAULT_TOKEN;
const SECRET_PATH = process.env.SECRET_PATH;

/**
 * Function to fetch secret from HashiCorp Vault
 */
async function fetchSecret() {
    try {
        const response = await axios.get(`${VAULT_ADDR}/v1/${SECRET_PATH}`, {
            headers: { 'X-Vault-Token': VAULT_TOKEN }
        });
        console.log('Secret Data:', response.data.data);
    } catch (error) {
        console.error('Error fetching secret:', error);
    }
}

/**
 * Main function to interact with user before fetching secrets
 */
async function main() {
    console.log("I am JAZ, your TABot to guide you to setup. Type 'NEXT' to continue...");
    console.log("Type 'NEXT' to continue... (or press Ctrl+C to exit): ");

    process.stdin.on('data', async (data) => {

        const input = data.toString().trim().toUpperCase();
        if (input === 'NEXT') {
            console.log("Fetching secrets from Vault...");
            await fetchSecret();
            process.exit(0);
        } else {
            console.log("Invalid input. Type 'NEXT' to continue.");
        }
    });
}

// Start the program
main();
