// /api/reviews/[id].js
// GET /api/reviews/:id → 후기 하나 상세 조회

const NOTION_VERSION = '2026-03-11';
const NOTION_TOKEN = process.env.NOTION_TOKEN;

// Notion 페이지 객체 하나를 화면에서 쓰기 좋은 모양으로 바꿔주는 함수 (reviews.js와 동일)
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

// 주소의 :id 부분으로 Notion 페이지 하나를 바로 조회하는 함수
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '지원하지 않는 요청 방식입니다.' });
  }

  const { id } = req.query;

  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Notion 조회에 실패했습니다.');

    res.status(200).json(parsePage(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}