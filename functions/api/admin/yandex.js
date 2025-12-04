import { authenticate } from '../../lib/jwt-auth.js';
import { createSuccessResponse, createServerErrorResponse, createUnauthorizedResponse } from '../../lib/api-response.js';

const YANDEX_API_BASE = 'https://api.webmaster.yandex.net/v4';

export async function onRequestGet(context) {
    const { request, env } = context;

    // 1. Authentication Check
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
        return createUnauthorizedResponse();
    }

    // 2. Check Credentials
    if (!env.YANDEX_ACCESS_TOKEN) {
        return createSuccessResponse({
            status: 'not_configured',
            message: 'Yandex Webmaster Access Token not configured',
            data: null
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
        // Find the host for kn-wallpaperglue.com (or use the first one if not found/configured)
        // Yandex host format usually: "https:kn-wallpaperglue.com:443"
        const targetHost = hostsData.hosts.find(h => h.ascii_host_url.includes('kn-wallpaperglue.com')) || hostsData.hosts[0];

        if (!targetHost) {
            return createSuccessResponse({
                status: 'no_hosts',
                message: 'No sites found in Yandex Webmaster account',
                data: null
            });
        }

        const hostId = targetHost.host_id;

        // 5. Get Indexing Summary
        const summaryResp = await fetch(`${YANDEX_API_BASE}/user/${userId}/hosts/${hostId}/summary`, {
            headers: { 'Authorization': `OAuth ${env.YANDEX_ACCESS_TOKEN}` }
        });
        const summaryData = await summaryResp.json();

        // 6. Get Popular Queries (if available)
        // Note: This endpoint might require specific rights or data availability
        let popularQueries = [];
        try {
            const queriesResp = await fetch(`${YANDEX_API_BASE}/user/${userId}/hosts/${hostId}/search-queries/popular/samples`, {
                headers: { 'Authorization': `OAuth ${env.YANDEX_ACCESS_TOKEN}` }
            });
            if (queriesResp.ok) {
                const queriesData = await queriesResp.json();
                popularQueries = queriesData.queries || [];
            }
        } catch (e) {
            console.warn('Failed to fetch popular queries:', e);
        }

        return createSuccessResponse({
            status: 'connected',
            data: {
                host_display_name: targetHost.ascii_host_url,
                sqi: summaryData.sqi, // Site Quality Index
                indexed_count: summaryData.searchable_pages_count, // Pages in search
                excluded_count: summaryData.excluded_pages_count,
                popular_queries: popularQueries.slice(0, 5) // Top 5 queries
            }
        });

    } catch (error) {
        console.error('Yandex Integration Error:', error);
        return createServerErrorResponse({
            message: 'Failed to fetch Yandex Webmaster data',
            error: error.message
        });
    }
}
