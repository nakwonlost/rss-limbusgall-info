// api/rss.js
import axios from 'axios';

const APIFY_TASK_ID = 'XgcxJg6WUQprXwff3';
const APIFY_TOKEN   = process.env.APIFY_TOKEN;

export default async function handler(req, res) {
  try {
    // Apify API 호출
    const { data: items } = await axios.get(
      `https://api.apify.com/v2/actor-tasks/${APIFY_TASK_ID}/runs/last/dataset/items`,
      { params: { token: APIFY_TOKEN } }
    );

    // RSS 조립
    const rssItems = items.map(item => `
      <item>
        <title><![CDATA[${item.title}]]></title>
        <link>${item.link}</link>
        <guid>${item.guid}</guid>
        <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
        ${item.image ? `<description><![CDATA[<img src="${item.image}" /><br/>]]></description>` : ''}
      </item>
    `).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>DCInside LimbusCompany 갤 추천글 RSS</title>
    <link>https://gall.dcinside.com/mgallery/board/lists/?id=limbuscompany</link>
    <description>DC인사이드 림버스 컴퍼니 갤러리 추천글을 모아봅니다.</description>
    ${rssItems}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml');
    res.status(200).send(rss.trim());
  } catch (e) {
    console.error('Error generating RSS:', e);
    res.status(500).send('Internal Server Error');
  }
}