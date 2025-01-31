// Express edition; will start a server at localhost:3000
// fetched secret will be displayed in a formatted JSON at localhost:6710/fetch-secret
// Designed By Jahidul Arafat

import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

dotenv.config();

const VAULT_ADDR = process.env.VAULT_ADDR;
const VAULT_TOKEN = process.env.VAULT_TOKEN;
const SECRET_PATH = process.env.SECRET_PATH || 'secret';
const SECRET_PATH_FETCH = process.env.SECRET_PATH_FETCH || 'secret';
const BASEURL = process.env.BASEURL || '';
const PORT = process.env.PORT; // Local server port; similar to your COURSE CODE

const app = express();
app.use(express.json()); // for parsing application/json

// Serve Swagger API documentation
app.use(`${BASEURL}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Add a test route
// BASEURL=/aubi/comp/6710/spring2025
app.get(`${BASEURL}/test`, (_req, res) => {
    res.send('Server is working!');
});



/**
 * Fetch secret from Vault when visiting the clickable link (nested support)
 * http://localhost:6710/aubi/comp/6710/spring2025/fetch-specific-secret/COMP6710
 * http://localhost:6710/aubi/comp/6710/spring2025/fetch-specific-secret/myappdata/COMP6710
 */
// GET METHOD
app.get(`${BASEURL}/fetch-specific-secret/:path(*)`, async (req, res) => {
    try {
        const path = req.params.path;
        console.log(`Fetching specific secret: ${path}`);
        const response = await axios.get(`${VAULT_ADDR}/v1/${SECRET_PATH_FETCH}/data/${path}`, {
            headers: {'X-Vault-Token': VAULT_TOKEN}
        });
        console.log('Secret Data:', response.data.data);
        res.send(`
            <h1>Secret Data for ${path}</h1>
            <pre>${JSON.stringify(response.data.data, null, 2)}</pre>
            <p><a href="${BASEURL}/list-secrets">Back to Secret List</a></p>
        `);
    } catch (error) {
        console.error('Error fetching specific secret:', error);
        let errorMessage = error.message;
        if (error.response) {
            console.error('Error response:', error.response.data);
            errorMessage += `\nResponse data: ${JSON.stringify(error.response.data)}`;
        }
        res.status(500).send(`
            <h1>Error fetching specific secret: ${req.params.path}</h1>
            <pre>${errorMessage}</pre>
            <p><a href="${BASEURL}/list-secrets">Back to Secret List</a></p>
        `);
    }
});

/**
 * List all secrets in the Vault
 */
// Util methods
/**
 * Recursively list all secrets in the Vault
 */
async function listSecretsRecursively(path = '') {
    try {
        console.log(`Attempting to list secrets at path: ${SECRET_PATH_FETCH}${path}`);
        const response = await axios.get(`${VAULT_ADDR}/v1/${SECRET_PATH_FETCH}/metadata/${path}?list=true`, {
            headers: {'X-Vault-Token': VAULT_TOKEN}
        });

        if (!response.data.data || !response.data.data.keys) {
            return {};
        }

        let result = {};
        const keys = response.data.data.keys;

        for (const key of keys) {
            const fullPath = `${path}${key}`;
            if (key.endsWith('/')) {
                result[key.slice(0, -1)] = await listSecretsRecursively(fullPath);
            } else {
                try {
                    const secretResponse = await axios.get(`${VAULT_ADDR}/v1/${SECRET_PATH_FETCH}/data/${fullPath}`, {
                        headers: {'X-Vault-Token': VAULT_TOKEN}
                    });
                    result[key] = {
                        data: secretResponse.data.data.data,
                        path: fullPath
                    };
                } catch (secretError) {
                    result[key] = {
                        error: 'Unable to fetch secret',
                        path: fullPath
                    };
                }
            }
        }

        return result;
    } catch (error) {
        console.error(`Error listing secrets at path ${path}:`, error.message);
        throw error;
    }
}

// GET METHOD
app.get(`${BASEURL}/list-secrets`, async (_req, res) => {
    try {
        console.log("Listing all secrets in Vault...");
        const allSecrets = await listSecretsRecursively();
        res.json(allSecrets);
    } catch (error) {
        console.error('Error listing secrets:', error);
        res.status(500).json({ error: 'Error listing secrets', message: error.message });
    }
});

/**
 * Create a new secret in the Vault
 *
 * In your terminal, run:

 curl -X POST http://localhost:6710/create-secret \
 -H "Content-Type: application/json" \
 -d '{
 "path": "COMP6710",
 "data": {
 "username": "auburn",
 "password": "AubiTiger6710"
 }
 }'

 */
// POST METHOD
// Modify the create-secret route
app.post(`${BASEURL}/create-secret`, async (req, res) => {
    console.log("Received request to create secret");
    console.log("Request body:", req.body);
    try {
        console.log("Creating new secret in Vault...");
        const { path, data } = req.body;
        if (!path || !data || typeof data !== 'object') {
            return res.status(400).send('Both path and data object are required.');
        }

        const response = await axios.post(`${VAULT_ADDR}/v1/${SECRET_PATH}data/${path}`,
            { data: data },
            { headers: {'X-Vault-Token': VAULT_TOKEN} }
        );
        console.log("Vault response:", response.data);
        res.status(201).send(`Secret at '${path}' created successfully.`);
    } catch (error) {
        console.error('Error creating secret:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        res.status(500).send(`Error creating secret: ${error.message}`);
    }
});

/**
 * Main function - provides the URL for fetching secrets
 */
async function main() {
    app.listen(PORT, () => {
        const baseUrl = `http://localhost:${PORT}${BASEURL}`;
        console.log(`Server is running on port ${PORT}`);
        console.log(`Base URL: ${baseUrl}`);
        console.log("Available routes:");
        console.log(`1. Test route: ${baseUrl}/test`);
        console.log(`2. List secrets: ${baseUrl}/list-secrets`);
        console.log(`3. Create secret (POST): ${baseUrl}/create-secret`);
        console.log(`4. API Documentation: ${baseUrl}/api-docs`);
        console.log("\nTo create a secret, use this curl command:");
        console.log(`curl -X POST ${baseUrl}/create-secret \\`);
        console.log('-H "Content-Type: application/json" \\');
        console.log('-d \'{"path": "COMP6710", "data": {"username": "auburn", "password": "AubiTiger6710"}}\'');
        console.log("\nPress Ctrl+C to stop the server.");
    });
}

// Start the program
main();