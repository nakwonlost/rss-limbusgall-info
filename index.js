const express = require('express');
const axios = require('axios');
const { create } = require('xmlbuilder2');

const app = express();
const port = process.env.PORT || 3000;

// Apify Task 설정
const APIFY_TASK_ID = 'XgcxJg6WUQprXwff3';
const APIFY_TOKEN = process.env.APIFY_TOKEN;

app.get('/rss.xml', async (req, res) => {
  try {
    // Apify에서 데이터 가져오기
    const { data: items } = await axios.get(
      `https://api.apify.com/v2/actor-tasks/${APIFY_TASK_ID}/runs/last/dataset/items`,
      { params: { token: APIFY_TOKEN } }
    );

    // RSS XML 빌드
    const feed = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('rss', { version: '2.0' })
        .ele('channel')
          .ele('title').txt('DCInside LimbusCompany 갤 추천글 RSS').up()
          .ele('link').txt('https://gall.dcinside.com/mgallery/board/lists/?id=limbuscompany').up()
          .ele('description').txt('디시인사이드 림버스 컴퍼니 갤러리 추천글 피드').up();

    // 각 아이템 추가
    items.forEach(item => {
      const title = item.title || '제목 없음';
      const link = item.link || '';
      const guid = item.guid || link;
      const pubDate = item.pubDate ? new Date(item.pubDate).toUTCString() : new Date().toUTCString();
      const imageTag = item.image ? `<img src="${item.image}" /><br/>` : '';
      const description = `${imageTag}${title}<br/><a href="${link}">${link}</a>`;

      feed.ele('item')
        .ele('title').txt(title).up()
        .ele('link').txt(link).up()
        .ele('guid').txt(guid).up()
        .ele('pubDate').txt(pubDate).up()
        .ele('description').dat(description).up()
      .up();
    });

    const xml = feed.end({ prettyPrint: true });
    res.set('Content-Type', 'application/rss+xml; charset=UTF-8');
    res.send(xml);
  } catch (err) {
    console.error('Error generating RSS:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`RSS server listening at http://localhost:${port}/rss.xml`);
});