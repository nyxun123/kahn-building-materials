#!/usr/bin/env node
// Manage Cloudflare Worker routes for a zone.
// Requires env: CF_API_TOKEN, CF_ZONE_ID
// Optional: TARGET_PATTERN (default: "/api/*"), CONTACT_PATTERN (default: "/api/contact-api"), CONTACT_SCRIPT

const API = 'https://api.cloudflare.com/client/v4';
const token = process.env.CF_API_TOKEN;
const zoneId = process.env.CF_ZONE_ID;
const pattern = process.env.TARGET_PATTERN || '/api/*';
const contactPattern = process.env.CONTACT_PATTERN || '/api/contact-api';
const contactScript = process.env.CONTACT_SCRIPT; // e.g., 'contact-worker'
const dryRun = process.env.DRY_RUN !== 'false';

if (!token || !zoneId) {
  console.error('Missing CF_API_TOKEN or CF_ZONE_ID');
  process.exit(2);
}

async function cf(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(`${method} ${path} failed: ${JSON.stringify(json.errors)}`);
  }
  return json.result;
}

async function listRoutes() {
  return cf('GET', `/zones/${zoneId}/workers/routes`);
}

async function updateRoute(id, data) {
  return cf('PUT', `/zones/${zoneId}/workers/routes/${id}`, data);
}

async function deleteRoute(id) {
  return cf('DELETE', `/zones/${zoneId}/workers/routes/${id}`);
}

async function createRoute(data) {
  return cf('POST', `/zones/${zoneId}/workers/routes`, data);
}

(async () => {
  const routes = await listRoutes();
  console.log('Existing routes:');
  routes.forEach(r => console.log(`- id=${r.id} pattern=${r.pattern} script=${r.script}`));

  const apiRoute = routes.find(r => r.pattern === pattern);
  if (!apiRoute) {
    console.log(`No route with pattern ${pattern} found. Nothing to change.`);
    return;
  }

  console.log(`\nFound wide API route: id=${apiRoute.id}, script=${apiRoute.script}`);
  if (dryRun) {
    console.log('DRY RUN: would restrict route to contact endpoint and free /api/* for Pages Functions.');
    console.log(`- delete route ${apiRoute.id}`);
    if (contactScript) {
      console.log(`- create route ${contactPattern} -> ${contactScript}`);
    } else {
      console.log(`- create route ${contactPattern} -> <set CONTACT_SCRIPT env>`);
    }
    return;
  }

  // Apply changes
  await deleteRoute(apiRoute.id);
  console.log(`Deleted route ${apiRoute.id} (${pattern}).`);
  if (contactScript) {
    const created = await createRoute({ pattern: contactPattern, script: contactScript });
    console.log(`Created route ${created.id}: ${contactPattern} -> ${contactScript}`);
  } else {
    console.log('Note: Set CONTACT_SCRIPT env to bind your contact worker to /api/contact-api if needed.');
  }
})();

