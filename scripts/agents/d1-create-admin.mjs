#!/usr/bin/env node
// Create or update an admin user in D1 via Cloudflare API
// Env: CF_API_TOKEN, CF_ACCOUNT_ID, D1_DB_ID
// Optional: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_ROLE

const token = process.env.CF_API_TOKEN;
const accountId = process.env.CF_ACCOUNT_ID;
const dbId = process.env.D1_DB_ID;

if (!token || !accountId || !dbId) {
  console.error('Missing CF_API_TOKEN, CF_ACCOUNT_ID or D1_DB_ID');
  process.exit(2);
}

const email = process.env.ADMIN_EMAIL || 'admin@kn-wallpaperglue.com';
const password = process.env.ADMIN_PASSWORD || 'Admin#2025';
const name = process.env.ADMIN_NAME || '系统管理员';
const role = process.env.ADMIN_ROLE || 'super_admin';

const API = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;

async function run(sql, params = []) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(JSON.stringify(data.errors || data, null, 2));
  }
  return data.result;
}

(async () => {
  console.log('Creating admin in D1...', { email, role });
  const sql = `INSERT OR REPLACE INTO admins (email, password_hash, name, role)
               VALUES (?, ?, ?, ?);`;
  const result = await run(sql, [email.toLowerCase(), password, name, role]);
  console.log('Result:', result);
  console.log('Done. You can now login with provided credentials.');
})();

