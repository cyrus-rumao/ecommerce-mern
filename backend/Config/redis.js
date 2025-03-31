import Redis from "ioredis";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the correct path to .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
export const redis = new Redis(process.env.REDIS_URI);
// console.log(process.env.REDIS_URI);
