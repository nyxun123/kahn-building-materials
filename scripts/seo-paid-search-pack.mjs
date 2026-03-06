#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://kn-wallpaperglue.com';
const OUTPUT_DIR = path.resolve(process.cwd(), 'docs/seo-reports');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const startDate = new Date().toISOString().slice(0, 10);

const platforms = [
  { platform: 'google_ads', source: 'google' },
  { platform: 'microsoft_ads', source: 'bing' },
];

const campaignBlueprints = [
  {
    baseCampaign: 'Search | OEM Wallpaper Adhesive | EN',
    adGroup: 'OEM Wallpaper Adhesive',
    landingPath: '/en/oem',
    campaignCode: 'search-oem-2026q1',
    budget: 55,
    keywords: [
      { keyword: 'wallpaper adhesive manufacturer', matchType: 'phrase' },
      { keyword: 'oem wallpaper glue supplier', matchType: 'phrase' },
      { keyword: 'private label wallpaper adhesive', matchType: 'phrase' },
      { keyword: 'wallpaper adhesive factory', matchType: 'exact' },
      { keyword: 'bulk wallpaper glue powder', matchType: 'phrase' },
    ],
    headlines: [
      'Wallpaper Adhesive OEM',
      'Factory Direct Supply',
      'Private Label Available',
      'Stable Batch Quality',
      'Fast Sample Turnaround',
      'Export Ready Packaging',
      'Request Technical Sheet',
      'Contact Factory Team',
    ],
    descriptions: [
      'OEM wallpaper adhesive powder with stable viscosity and consistent batches.',
      'Private label packaging, custom specs, and export documentation support.',
      'Ask for sample, TDS, and quote from Hangzhou production team.',
      'Track lead quality with UTM tagged landing pages by ad group.',
    ],
    path1: 'oem',
    path2: 'wallpaper-glue',
  },
  {
    baseCampaign: 'Search | Construction CMS Additive | EN',
    adGroup: 'Construction CMS',
    landingPath: '/en/products/construction-cms',
    campaignCode: 'search-construction-2026q1',
    budget: 40,
    keywords: [
      { keyword: 'construction grade carboxymethyl starch', matchType: 'phrase' },
      { keyword: 'putty powder additive supplier', matchType: 'phrase' },
      { keyword: 'gypsum additive starch', matchType: 'phrase' },
      { keyword: 'cms 8840 supplier', matchType: 'exact' },
      { keyword: 'building material starch additive', matchType: 'phrase' },
    ],
    headlines: [
      'Construction Grade CMS',
      'Putty And Gypsum Additive',
      'High Water Retention',
      'Improved Workability',
      'Stable Industrial Supply',
      'Technical Data Available',
      'Request Product Quote',
      'Factory Quality Control',
    ],
    descriptions: [
      'Carboxymethyl starch additive for putty, gypsum, and construction blends.',
      'Improve water retention, bonding, and crack resistance in dry mix formulas.',
      'Industrial batches with quality checks and export-ready documentation.',
      'Contact us for sample validation and production lead time.',
    ],
    path1: 'products',
    path2: 'construction-cms',
  },
  {
    baseCampaign: 'Search | Desiccant Gel Material | EN',
    adGroup: 'Desiccant Gel Material',
    landingPath: '/en/products/desiccant-gel',
    campaignCode: 'search-desiccant-2026q1',
    budget: 30,
    keywords: [
      { keyword: 'calcium chloride desiccant gel material', matchType: 'phrase' },
      { keyword: 'desiccant water locking gel supplier', matchType: 'phrase' },
      { keyword: 'desiccant gel starch material', matchType: 'phrase' },
      { keyword: 'desiccant gel raw material', matchType: 'exact' },
      { keyword: 'humidity absorber gel additive', matchType: 'phrase' },
    ],
    headlines: [
      'Desiccant Gel Material',
      'Water Locking Performance',
      'Leakage Risk Reduction',
      'Calcium Chloride Compatible',
      'Stable Batch Production',
      'Industrial Moisture Control',
      'Ask For TDS And Sample',
      'Export Packaging Support',
    ],
    descriptions: [
      'Gel locking material designed for calcium chloride desiccant production.',
      'Turn absorbed moisture into stable gel and reduce leakage risk.',
      'Suitable for container, household, and industrial humidity control products.',
      'Request technical sheet, sample, and lead time for bulk orders.',
    ],
    path1: 'products',
    path2: 'desiccant-gel',
  },
];

const negativeKeywords = [
  'free',
  'free sample',
  'diy',
  'recipe',
  'jobs',
  'salary',
  'definition',
  'wikipedia',
  'homework',
  'download',
  'cheap',
  'retail',
];

function csvEscape(value) {
  const stringValue = String(value ?? '');
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function toCsv(headers, rows) {
  const lines = [headers.join(',')];
  rows.forEach((row) => {
    lines.push(headers.map((header) => csvEscape(row[header])).join(','));
  });
  return `${lines.join('\n')}\n`;
}

function buildUrl(pathname, params) {
  const url = new URL(pathname, SITE_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

function buildCampaignRows() {
  const rows = [];
  platforms.forEach((platformInfo) => {
    campaignBlueprints.forEach((blueprint) => {
      rows.push({
        platform: platformInfo.platform,
        campaign_name: blueprint.baseCampaign,
        campaign_type: 'search',
        budget_usd_per_day: blueprint.budget,
        bidding_strategy: 'Maximize Clicks',
        target_locations: 'United States, Canada, United Kingdom, Australia',
        target_languages: 'English',
        start_date: startDate,
        status: 'paused',
      });
    });
  });
  return rows;
}

function buildKeywordRows() {
  const rows = [];
  platforms.forEach((platformInfo) => {
    campaignBlueprints.forEach((blueprint) => {
      blueprint.keywords.forEach((keywordRow) => {
        const finalUrl = buildUrl(blueprint.landingPath, {
          utm_source: platformInfo.source,
          utm_medium: 'cpc',
          utm_campaign: blueprint.campaignCode,
          utm_content: blueprint.adGroup.toLowerCase().replace(/\s+/g, '-'),
          utm_term: keywordRow.keyword.replace(/\s+/g, '+'),
        });
        rows.push({
          platform: platformInfo.platform,
          campaign_name: blueprint.baseCampaign,
          ad_group_name: blueprint.adGroup,
          keyword: keywordRow.keyword,
          match_type: keywordRow.matchType,
          final_url: finalUrl,
          status: 'enabled',
        });
      });
    });
  });
  return rows;
}

function buildRsaRows() {
  const rows = [];
  platforms.forEach((platformInfo) => {
    campaignBlueprints.forEach((blueprint) => {
      const finalUrl = buildUrl(blueprint.landingPath, {
        utm_source: platformInfo.source,
        utm_medium: 'cpc',
        utm_campaign: blueprint.campaignCode,
        utm_content: `${blueprint.adGroup.toLowerCase().replace(/\s+/g, '-')}-rsa`,
      });

      const headlineMap = {};
      const descriptionMap = {};
      for (let index = 0; index < 15; index += 1) {
        headlineMap[`headline_${index + 1}`] = blueprint.headlines[index] ?? '';
      }
      for (let index = 0; index < 4; index += 1) {
        descriptionMap[`description_${index + 1}`] = blueprint.descriptions[index] ?? '';
      }

      rows.push({
        platform: platformInfo.platform,
        campaign_name: blueprint.baseCampaign,
        ad_group_name: blueprint.adGroup,
        final_url: finalUrl,
        ...headlineMap,
        ...descriptionMap,
        path_1: blueprint.path1,
        path_2: blueprint.path2,
        status: 'enabled',
      });
    });
  });
  return rows;
}

function buildNegativeRows() {
  const rows = [];
  platforms.forEach((platformInfo) => {
    campaignBlueprints.forEach((blueprint) => {
      negativeKeywords.forEach((negativeKeyword) => {
        rows.push({
          platform: platformInfo.platform,
          scope: 'campaign',
          campaign_name: blueprint.baseCampaign,
          negative_keyword: negativeKeyword,
          match_type: 'phrase',
        });
      });
    });
  });
  return rows;
}

function buildSummary(campaignRows, keywordRows, rsaRows, negativeRows) {
  const dailyBudget = campaignRows.reduce((sum, row) => sum + Number(row.budget_usd_per_day), 0);
  return [
    '# Paid Search Launch Pack',
    '',
    `- Generated: ${new Date().toISOString()}`,
    `- Campaign rows: ${campaignRows.length}`,
    `- Keyword rows: ${keywordRows.length}`,
    `- RSA rows: ${rsaRows.length}`,
    `- Negative keyword rows: ${negativeRows.length}`,
    `- Total planned daily budget (all rows): $${dailyBudget}`,
    '',
    '## Launch Checklist',
    '- Import campaign CSV into Google Ads Editor and Microsoft Ads Editor.',
    '- Import keyword CSV and verify match types before post.',
    '- Import RSA CSV and check policy warnings for each platform.',
    '- Import negative keyword CSV at campaign scope.',
    '- Keep campaigns in paused state until conversion tracking is verified.',
    '',
    '## Tracking Checklist',
    '- Verify utm_source and utm_campaign values in analytics.',
    '- Ensure contact form captures UTM query params in lead records.',
    '- Check first 7 days search terms and expand negative list.',
    '- Reallocate budget to ad groups with qualified lead submissions.',
    '',
  ].join('\n');
}

async function writeOutputs() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const campaignRows = buildCampaignRows();
  const keywordRows = buildKeywordRows();
  const rsaRows = buildRsaRows();
  const negativeRows = buildNegativeRows();

  const campaignHeaders = [
    'platform',
    'campaign_name',
    'campaign_type',
    'budget_usd_per_day',
    'bidding_strategy',
    'target_locations',
    'target_languages',
    'start_date',
    'status',
  ];

  const keywordHeaders = [
    'platform',
    'campaign_name',
    'ad_group_name',
    'keyword',
    'match_type',
    'final_url',
    'status',
  ];

  const rsaHeaders = [
    'platform',
    'campaign_name',
    'ad_group_name',
    'final_url',
    'headline_1',
    'headline_2',
    'headline_3',
    'headline_4',
    'headline_5',
    'headline_6',
    'headline_7',
    'headline_8',
    'headline_9',
    'headline_10',
    'headline_11',
    'headline_12',
    'headline_13',
    'headline_14',
    'headline_15',
    'description_1',
    'description_2',
    'description_3',
    'description_4',
    'path_1',
    'path_2',
    'status',
  ];

  const negativeHeaders = [
    'platform',
    'scope',
    'campaign_name',
    'negative_keyword',
    'match_type',
  ];

  const summary = buildSummary(campaignRows, keywordRows, rsaRows, negativeRows);

  const files = [
    {
      file: `paid-search-campaigns-${timestamp}.csv`,
      latest: 'paid-search-campaigns-latest.csv',
      content: toCsv(campaignHeaders, campaignRows),
    },
    {
      file: `paid-search-keywords-${timestamp}.csv`,
      latest: 'paid-search-keywords-latest.csv',
      content: toCsv(keywordHeaders, keywordRows),
    },
    {
      file: `paid-search-rsas-${timestamp}.csv`,
      latest: 'paid-search-rsas-latest.csv',
      content: toCsv(rsaHeaders, rsaRows),
    },
    {
      file: `paid-search-negative-keywords-${timestamp}.csv`,
      latest: 'paid-search-negative-keywords-latest.csv',
      content: toCsv(negativeHeaders, negativeRows),
    },
    {
      file: `paid-search-launch-${timestamp}.md`,
      latest: 'paid-search-launch-latest.md',
      content: summary,
    },
  ];

  for (const item of files) {
    const outputFile = path.join(OUTPUT_DIR, item.file);
    const latestFile = path.join(OUTPUT_DIR, item.latest);
    await fs.writeFile(outputFile, item.content, 'utf8');
    await fs.writeFile(latestFile, item.content, 'utf8');
    console.log(`Wrote ${outputFile}`);
  }
}

await writeOutputs();
