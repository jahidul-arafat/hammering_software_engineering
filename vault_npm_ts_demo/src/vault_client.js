"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const VAULT_ADDR = process.env.VAULT_ADDR;
const VAULT_TOKEN = process.env.VAULT_TOKEN;
const SECRET_PATH = process.env.SECRET_PATH;
/**
 * Function to fetch secret from HashiCorp Vault
 */
function fetchSecret() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${VAULT_ADDR}/v1/${SECRET_PATH}`, {
                headers: { 'X-Vault-Token': VAULT_TOKEN }
            });
            console.log('Secret Data:', response.data.data);
        }
        catch (error) {
            console.error('Error fetching secret:', error);
        }
    });
}
/**
 * Main function to interact with user before fetching secrets
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("I am JAZ, your TABot to guide you to setup. Type 'NEXT' to continue...");
        console.log("Type 'NEXT' to continue... (or press Ctrl+C to exit): ");
        process.stdin.on('data', (data) => __awaiter(this, void 0, void 0, function* () {
            const input = data.toString().trim().toUpperCase();
            if (input === 'NEXT') {
                console.log("Fetching secrets from Vault...");
                yield fetchSecret();
                process.exit(0);
            }
            else {
                console.log("Invalid input. Type 'NEXT' to continue.");
            }
        }));
    });
}
// Start the program
main();
