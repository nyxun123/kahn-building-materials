import { authenticate } from '../../../lib/jwt-auth.js';
import { createSuccessResponse, createServerErrorResponse, createUnauthorizedResponse } from '../../../lib/api-response.js';

// Google Search Console API Endpoint
const GSC_API_URL = 'https://www.googleapis.com/webmasters/v3/sites';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_AUTH_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

/**
 * Convert PEM formatted private key to ArrayBuffer
 */
function pemToArrayBuffer(pem) {
    const b64Lines = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
    const b64Prefix = b64Lines.replace(/-/g, '+').replace(/_/g, '/');

    const str = atob(b64Prefix);
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);

    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

/**
 * Import Private Key for Signing
 */
async function importPrivateKey(pemKey) {
    try {
        const binaryKey = pemToArrayBuffer(pemKey);

        return await crypto.subtle.importKey(
            "pkcs8",
            binaryKey,
            {
                name: "RSASSA-PKCS1-v1_5",
                hash: { name: "SHA-256" },
            },
            false,
            ["sign"]
        );
    } catch (e) {
        console.error("Failed to import private key:", e);
        throw new Error("Invalid Private Key format");
    }
}

/**
 * Base64 URL Encode
 */
function base64UrlEncode(str) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function arrayBufferToBase64Url(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Generate Signed JWT for Google Auth
 */
async function generateGoogleJWT(clientEmail, privateKey) {
    const header = {
        alg: "RS256",
        typ: "JWT"
    };

    const now = Math.floor(Date.now() / 1000);
    const claimSet = {
        iss: clientEmail,
        scope: GOOGLE_AUTH_SCOPE,
        aud: GOOGLE_TOKEN_URL,
        exp: now + 3600,
        iat: now
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
    const unsignedToken = `${encodedHeader}.${encodedClaimSet}`;

    const key = await importPrivateKey(privateKey);
    const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        key,
        new TextEncoder().encode(unsignedToken)
    );

    return `${unsignedToken}.${arrayBufferToBase64Url(signature)}`;
}

/**
 * Get Access Token from Google
 */
async function getGoogleAccessToken(clientEmail, privateKey) {
    const jwt = await generateGoogleJWT(clientEmail, privateKey);

    const response = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Google Auth Failed: ${error}`);
    }

    const data = await response.json();
    return data.access_token;
}

export async function onRequestGet(context) {
    const { request, env } = context;

    // 1. Authentication Check
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
        return createUnauthorizedResponse();
    }

    // 2. Check Credentials
    if (!env.GSC_CLIENT_EMAIL || !env.GSC_PRIVATE_KEY) {
        // Return mock data or error indicating missing config
        // For now, we return a specific code so frontend can show "Connect GSC" button or similar
        return createSuccessResponse({
            status: 'not_configured',
            message: 'Google Search Console credentials not configured',
            data: null
        });
    }

    try {
        // 3. Get Access Token
        const accessToken = await getGoogleAccessToken(env.GSC_CLIENT_EMAIL, env.GSC_PRIVATE_KEY);

        // 4. Determine Date Range
        const url = new URL(request.url);
        const range = url.searchParams.get('range') || '30d';
        const siteUrl = env.GSC_SITE_URL || 'sc-domain:kn-wallpaperglue.com'; // Default or from env

        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Default 30 days

        if (range === '7d') startDate.setDate(new Date().getDate() - 7);
        if (range === '90d') startDate.setDate(new Date().getDate() - 90);

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = new Date().toISOString().split('T')[0];

        // 5. Query Search Console API
        // We want date, clicks, impressions for the chart
        const queryBody = {
            startDate: startDateStr,
            endDate: endDateStr,
            dimensions: ['date'],
            rowLimit: 100
        };

        const apiResponse = await fetch(`${GSC_API_URL}/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(queryBody)
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('GSC API Error:', errorText);
            throw new Error(`GSC API Error: ${apiResponse.statusText}`);
        }

        const data = await apiResponse.json();

        // 6. Format Data for Frontend
        // Expected format: Array<{ date: string, Clicks: number, Impressions: number }>
        const formattedData = (data.rows || []).map(row => ({
            date: row.keys[0],
            Clicks: row.clicks,
            Impressions: row.impressions,
            CTR: row.ctr,
            Position: row.position
        })).sort((a, b) => a.date.localeCompare(b.date));

        return createSuccessResponse({
            status: 'connected',
            data: formattedData
        });

    } catch (error) {
        console.error('GSC Integration Error:', error);
        return createServerErrorResponse({
            message: 'Failed to fetch Google Search Console data',
            error: error.message
        });
    }
}
