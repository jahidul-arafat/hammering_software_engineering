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
function fetchSecret() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `${VAULT_ADDR}/v1/${SECRET_PATH}`;
            console.log("Fetching from URL:", url);
            const response = yield axios_1.default.get(url, {
                headers: { 'X-Vault-Token': VAULT_TOKEN }
            });
            console.log('Secret Data:', response.data.data);
        }
        catch (error) {
            console.error('Error fetching secret:', error);
        }
    });
}
fetchSecret();
