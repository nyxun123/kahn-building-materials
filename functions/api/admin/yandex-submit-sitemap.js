import { authenticate } from '../../lib/jwt-auth.js';
import { createSuccessResponse, createServerErrorResponse, createUnauthorizedResponse, createBadRequestResponse } from '../../lib/api-response.js';

const YANDEX_API_BASE = 'https://api.webmaster.yandex.net/v4';

export async function onRequestPost(context) {
    const { request, env } = context;

    // 1. Authentication Check
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
        return createUnauthorizedResponse();
    }

    // 2. Check Credentials
    if (!env.YANDEX_ACCESS_TOKEN) {
        return createBadRequestResponse({
            message: 'Yandex Webmaster Access Token not configured'
        });
    }

    try {
        // 3. Get User ID
        const userResp = await fetch(`${YANDEX_API_BASE}/user`, {
            headers: { 'Authorization': `OAuth ${env.YANDEX_ACCESS_TOKEN}` }
        });

        if (!userResp.ok) {
            throw new Error(`Failed to get Yandex User ID: ${userResp.statusText}`);
        }

        const userData = await userResp.json();
        const userId = userData.user_id;

        // 4. Get Hosts (Sites)
        const hostsResp = await fetch(`${YANDEX_API_BASE}/user/${userId}/hosts`, {
            headers: { 'Authorization': `OAuth ${env.YANDEX_ACCESS_TOKEN}` }
        });

        if (!hostsResp.ok) {
            throw new Error(`Failed to get Yandex Hosts: ${hostsResp.statusText}`);
        }

        const hostsData = await hostsResp.json();
        const targetHost = hostsData.hosts.find(h => h.ascii_host_url.includes('kn-wallpaperglue.com')) || hostsData.hosts[0];

        if (!targetHost) {
            return createBadRequestResponse({
                message: 'No sites found in Yandex Webmaster account'
            });
        }

        const hostId = targetHost.host_id;

        // 5. Submit Sitemap
        const sitemapUrl = 'https://kn-wallpaperglue.com/sitemap-index.xml';

        // Check if added first (optional, but good for reporting)
        // For submission, we just POST
        const submitResp = await fetch(`${YANDEX_API_BASE}/user/${userId}/hosts/${hostId}/user-added-sitemaps`, {
            method: 'POST',
            headers: {
                'Authorization': `OAuth ${env.YANDEX_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: sitemapUrl
            })
        });

        if (!submitResp.ok) {
            // Handle "sitemap already added" or similar if API returns error
            const errorText = await submitResp.text();
            console.error('Yandex Sitemap Submit Error:', errorText);

            // Some APIs return 409 if already exists? Yandex documentation says it adds to queue.
            // Let's assume standard error handling.
            if (submitResp.status === 409) {
                return createSuccessResponse({
                    message: 'Sitemap already processed or in queue',
                    status: 'already_exists'
                });
            }

            throw new Error(`Failed to submit sitemap: ${errorText}`);
        }

        const result = await submitResp.json();

        return createSuccessResponse({
            message: 'Sitemap submitted successfully to Yandex',
            data: result,
            submitted_url: sitemapUrl
        });

    } catch (error) {
        console.error('Yandex Sitemap Submission Error:', error);
        return createServerErrorResponse({
            message: 'Failed to submit sitemap to Yandex',
            error: error.message
        });
    }
}
