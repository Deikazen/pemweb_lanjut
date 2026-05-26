import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load local .env files for development only.
// On Vercel, environment variables are injected via the dashboard, 
// so dotenv is not needed. The .env files are gitignored and don't exist on Vercel.
const envFiles = [
    path.resolve(__dirname, "../.env.kopi"),
    path.resolve(__dirname, "../.env"),
];

for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
        dotenv.config({ path: envFile });
        console.log(`[supabaseClient] Loaded env from: ${envFile}`);
        break;
    }
}

if (!process.env.SUPABASE_URL) {
    console.log("[supabaseClient] No local .env file found. Using process.env (Vercel dashboard variables).");
}

const cleanEnvVar = (val) => {
    if (!val) return val;
    let cleaned = val.trim();
    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
        cleaned = cleaned.substring(1, cleaned.length - 1).trim();
    }
    return cleaned;
};

const rawUrl = process.env.SUPABASE_URL;
const rawRoleKey = process.env.SUPABASE_ROLE_KEY;
const rawKey = process.env.SUPABASE_KEY;

const supabaseUrl = cleanEnvVar(rawUrl);
const supabaseKey = cleanEnvVar(rawRoleKey || rawKey);

console.log("=== SUPABASE DIAGNOSTIC INITIALIZATION ===");
console.log("SUPABASE_URL:", {
    rawExists: !!rawUrl,
    cleanedValue: supabaseUrl,
    isValidUrl: supabaseUrl ? supabaseUrl.startsWith("http") : false
});
console.log("SUPABASE_ROLE_KEY:", {
    rawExists: !!rawRoleKey,
    rawLength: rawRoleKey ? rawRoleKey.length : 0,
    cleanedLength: cleanEnvVar(rawRoleKey) ? cleanEnvVar(rawRoleKey).length : 0,
    startsWithJWT: rawRoleKey ? rawRoleKey.trim().startsWith("eyJ") : false
});
console.log("SUPABASE_KEY:", {
    rawExists: !!rawKey,
    rawLength: rawKey ? rawKey.length : 0,
    cleanedLength: cleanEnvVar(rawKey) ? cleanEnvVar(rawKey).length : 0,
    startsWithJWT: rawKey ? rawKey.trim().startsWith("eyJ") : false
});
console.log("RESOLVED KEY SYSTEM:", {
    keySource: rawRoleKey ? "SUPABASE_ROLE_KEY" : (rawKey ? "SUPABASE_KEY" : "NONE"),
    resolvedLength: supabaseKey ? supabaseKey.length : 0,
    resolvedStartsWithJWT: supabaseKey ? supabaseKey.startsWith("eyJ") : false,
    resolvedPreview: supabaseKey ? (supabaseKey.substring(0, 10) + "..." + supabaseKey.substring(supabaseKey.length - 5)) : "NONE"
});
console.log("==========================================");

if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL ERROR: SUPABASE_URL and either SUPABASE_ROLE_KEY or SUPABASE_KEY are missing in process.env!");
}

export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    })
    : null;

export const createStatelessClient = () => {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("SUPABASE_URL and either SUPABASE_ROLE_KEY or SUPABASE_KEY must be defined in environment variables.");
    }
    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    });
};