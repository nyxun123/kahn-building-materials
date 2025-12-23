
import readline from 'readline';

const YANDEX_API_BASE = 'https://api.webmaster.yandex.net/v4';
const SITE_HOST = 'kn-wallpaperglue.com';
const SITEMAP_URL = 'https://kn-wallpaperglue.com/sitemap-index.xml';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

async function main() {
    console.log('🚀 Yandex Sitemap Submission Tool');
    console.log('--------------------------------');
    console.log('Since the web dashboard is not configured with the Yandex Token localy,');
    console.log('please enter your Yandex Access Token to submit the sitemap directly.');
    console.log('');

    const token = await askQuestion('👉 Enter Yandex Access Token: ');

    if (!token) {
        console.error('❌ Token is required.');
        rl.close();
        return;
    }

    try {
        console.log('\n🔄 Authenticating with Yandex...');

        // 1. Get User ID
        const userResp = await fetch(`${YANDEX_API_BASE}/user`, {
            headers: { 'Authorization': `OAuth ${token}` }
        });

        if (!userResp.ok) {
            throw new Error(`Authentication failed: ${userResp.statusText}`);
        }

        const userData = await userResp.json();
        const userId = userData.user_id;
        console.log(`✅ Authenticated as User ID: ${userId}`);

        // 2. Get Hosts
        console.log('🔄 Fetching sites...');
        const hostsResp = await fetch(`${YANDEX_API_BASE}/user/${userId}/hosts`, {
            headers: { 'Authorization': `OAuth ${token}` }
        });

        if (!hostsResp.ok) {
            throw new Error(`Failed to get hosts: ${hostsResp.statusText}`);
        }

        const hostsData = await hostsResp.json();
        const targetHost = hostsData.hosts.find(h => h.ascii_host_url.includes(SITE_HOST)) || hostsData.hosts[0];

        if (!targetHost) {
            console.error(`❌ Site ${SITE_HOST} not found in Yandex account.`);
            console.log('Available sites:', hostsData.hosts.map(h => h.ascii_host_url).join(', '));
            return;
        }

        const hostId = targetHost.host_id;
        console.log(`✅ Found site: ${targetHost.ascii_host_url} (ID: ${hostId})`);

        // 3. Submit Sitemap
        console.log(`\n🔄 Submitting sitemap: ${SITEMAP_URL}`);
        const submitResp = await fetch(`${YANDEX_API_BASE}/user/${userId}/hosts/${hostId}/user-added-sitemaps`, {
            method: 'POST',
            headers: {
                'Authorization': `OAuth ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: SITEMAP_URL
            })
        });

        if (!submitResp.ok) {
            if (submitResp.status === 409) {
                console.log('⚠️  Sitemap is already in the processing queue.');
            } else {
                const errorText = await submitResp.text();
                throw new Error(`Submission failed: ${errorText}`);
            }
        } else {
            const result = await submitResp.json();
            console.log('✅ Sitemap submitted successfully!');
            console.log('Response:', result);
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

main();
