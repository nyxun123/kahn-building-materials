import { webcrypto } from 'node:crypto';

if (!globalThis.crypto) {
    globalThis.crypto = webcrypto;
}

// Mock Private Key (RSA 2048 bit) - just for testing the format parsing
// This is a generated test key, not a real one.
const MOCK_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZLC+tZ+v4x5u1
... (truncated for brevity, I will generate a real-looking one for the test) ...
-----END PRIVATE KEY-----`;

// Actually, generating a key pair in the script is better to ensure it works
async function generateTestKey() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
    );

    const exported = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    const exportedPem = `-----BEGIN PRIVATE KEY-----\n${Buffer.from(exported).toString('base64')}\n-----END PRIVATE KEY-----`;
    return { pem: exportedPem, publicKey: keyPair.publicKey };
}

// Copy of the function from gsc.js
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

async function importPrivateKey(pemKey) {
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
}

async function test() {
    console.log("Generating test key...");
    const { pem, publicKey } = await generateTestKey();
    console.log("Test key generated.");

    console.log("Importing private key from PEM...");
    try {
        const key = await importPrivateKey(pem);
        console.log("Private key imported successfully.");

        // Test signing
        const data = new TextEncoder().encode("test data");
        const signature = await crypto.subtle.sign(
            "RSASSA-PKCS1-v1_5",
            key,
            data
        );
        console.log("Signing successful. Signature length:", signature.byteLength);

        // Verify
        const valid = await crypto.subtle.verify(
            "RSASSA-PKCS1-v1_5",
            publicKey,
            signature,
            data
        );
        console.log("Verification result:", valid);

        if (valid) {
            console.log("✅ JWT Signing Logic Test Passed");
        } else {
            console.error("❌ Verification Failed");
        }

    } catch (e) {
        console.error("Test Failed:", e);
    }
}

test();
