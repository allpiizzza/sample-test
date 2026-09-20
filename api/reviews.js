// /api/reviews.js
// GET  /api/reviews  → 후기 목록 가져오기
// POST /api/reviews  → 새 후기 저장하기

const NOTION_VERSION = '2026-03-11';
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Notion 페이지 객체 하나를 화면에서 쓰기 좋은 모양으로 바꿔주는 함수
function parsePage(page) {
  const props = page.properties;
  return {
    id: page.id,
    title: props['제목']?.title?.map(t => t.plain_text).join('') || '',
    author: props['작성자']?.rich_text?.map(t => t.plain_text).join('') || '',
    date: props['작성일']?.date?.start || '',
    content: props['내용']?.rich_text?.map(t => t.plain_text).join('') || ''
  };
}

// 요청 방식(GET/POST)에 따라 목록 조회 또는 저장으로 나눠주는 진입점
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleList(req, res);
  }
  if (req.method === 'POST') {
    return handleCreate(req, res);
  }
  res.status(405).json({ error: '지원하지 않는 요청 방식입니다.' });
}

// 목록 불러오기: Notion 데이터베이스를 작성일 최신순으로 조회함
async function handleList(req, res) {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sorts: [{ property: '작성일', direction: 'descending' }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Notion 조회에 실패했습니다.');

    const reviews = data.results.map(parsePage);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 글 저장하기: 브라우저는 제목/작성자/내용만 보내고, 작성일은 여기서 오늘 날짜로 채움
async function handleCreate(req, res) {
  try {
    const { title, author, content } = req.body;
    const today = new Date().toISOString().slice(0, 10);

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          '제목': { title: [{ text: { content: title } }] },
          '작성자': { rich_text: [{ text: { content: author } }] },
          '작성일': { date: { start: today } },
          '내용': { rich_text: [{ text: { content: content } }] }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Notion 저장에 실패했습니다.');

    res.status(200).json({ result: 'success', id: data.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}