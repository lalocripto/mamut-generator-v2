module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { feeds, startDate, endDate } = req.body;

    const RSS_FEEDS = feeds || {
        "CoinDesk": "https://www.coindesk.com/arc/outboundfeeds/rss/",
        "The Block": "https://www.theblock.co/rss.xml",
        "Cointelegraph": "https://cointelegraph.com/rss",
        "Decrypt": "https://decrypt.co/feed",
    };

    const NEWS_PER_SOURCE = 4;

    try {
        const allNews = [];
        const startDt = new Date(startDate);
        const endDt = new Date(endDate);
        endDt.setDate(endDt.getDate() + 1);

        for (const [source, url] of Object.entries(RSS_FEEDS)) {
            try {
                const response = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' }
                });
                const text = await response.text();

                // Parse RSS manually (simplified)
                const items = text.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];

                let sourceCount = 0;

                for (const item of items) {
                    if (sourceCount >= NEWS_PER_SOURCE) break;

                    const title = (item.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i) || [])[1] || '';
                    let link = (item.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || '';

                    // Some feeds use <link/> with href or put URL after the tag
                    if (!link) {
                        link = (item.match(/<link[^>]*href=["']([^"']+)["']/i) || [])[1] || '';
                    }
                    if (!link) {
                        link = (item.match(/<link[^>]*\/>\s*(https?:\/\/[^\s<]+)/i) || [])[1] || '';
                    }

                    const pubDate = (item.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || [])[1] || '';
                    const description = (item.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i) || [])[1] || '';

                    const date = new Date(pubDate);

                    if (date >= startDt && date <= endDt && title && link) {
                        allNews.push({
                            title: title.trim().substring(0, 150),
                            url: link.trim(),
                            date: date.toISOString().split('T')[0],
                            summary: description.replace(/<[^>]*>/g, '').trim().substring(0, 150),
                            source: source
                        });
                        sourceCount++;
                    }
                }
            } catch (e) {
                console.error(`Error fetching ${source}:`, e.message);
            }
        }

        // Sort by date descending
        allNews.sort((a, b) => new Date(b.date) - new Date(a.date));

        return res.status(200).json({ news: allNews });
    } catch (error) {
        console.error('News fetch error:', error);
        return res.status(500).json({ error: error.message });
    }
}
