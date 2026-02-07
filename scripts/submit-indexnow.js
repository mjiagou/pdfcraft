/**
 * IndexNow Submission Script
 * Submits all URLs from the live sitemap to Bing IndexNow
 */

const https = require('https');
const { URL } = require('url');

const CONFIG = {
  host: 'pdf.tpsh.cc',
  key: '44400e96030541748259d67566236b52',
  keyLocation: 'https://pdf.tpsh.cc/44400e96030541748259d67566236b52.txt',
  sitemapUrl: 'https://pdf.tpsh.cc/sitemap.xml',
  submitEndpoint: 'https://api.indexnow.org/indexnow',
};

async function fetchSitemap(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function submitToIndexNow(urlList) {
  const payload = JSON.stringify({
    host: CONFIG.host,
    key: CONFIG.key,
    keyLocation: CONFIG.keyLocation,
    urlList: urlList,
  });

  const url = new URL(CONFIG.submitEndpoint);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          resolve(`Success: ${res.statusCode}`);
        } else {
          reject(new Error(`IndexNow API Error: ${res.statusCode} ${responseBody}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function extractUrlsFromXml(xml) {
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(xml)) !== null) {
    if (match[1]) {
        urls.push(match[1]);
    }
  }
  return urls;
}

async function main() {
  try {
    console.log(`Fetching sitemap from ${CONFIG.sitemapUrl}...`);
    const sitemapXml = await fetchSitemap(CONFIG.sitemapUrl);
    
    console.log('Extracting URLs...');
    const urlList = extractUrlsFromXml(sitemapXml);
    
    if (urlList.length === 0) {
      throw new Error('No URLs found in sitemap');
    }
    
    console.log(`Found ${urlList.length} URLs.`);
    
    // IndexNow allows bulk submission (up to 10k items)
    console.log('Submitting to IndexNow...');
    await submitToIndexNow(urlList);
    
    console.log('✅ IndexNow submission successful!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
