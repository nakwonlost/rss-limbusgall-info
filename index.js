// index.js (핵심 부분만)
import express from 'express';
import axios from 'axios';
import { create } from 'xmlbuilder2';

const app = express();
const port = process.env.PORT || 3000;
const APIFY_TASK_ID = 'XgcxJg6WUQprXwff3';

// /rss.xml 엔드포인트
app.get('/rss.xml', async (req, res) => {
  try {
    // 1) URL에서 토큰 쿼리 제거
    const url = `https://api.apify.com/v2/actor-tasks/${APIFY_TASK_ID}/runs/last/dataset/items`;

    // 2) Authorization 헤더로 토큰 전달
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.APIFY_TOKEN}`,
      },
    });

    const items = response.data;
    // … RSS 빌드 로직 …
    res.set('Content-Type', 'application/rss+xml; charset=UTF-8');
    res.send(/* rss XML */);
  } catch (err) {
    console.error('Error generating RSS:', err.message);
    res.status(500).send('Failed to generate RSS');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
