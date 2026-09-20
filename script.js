// 이제 같은 도메인(Vercel)에서 API를 서비스하니까 상대 경로만 쓰면 되고,
// Google Apps Script 때 필요했던 text/plain 트릭(CORS 우회)도 더 이상 필요 없음
const API_BASE = '/api/reviews';

// 목록 불러오기
async function fetchReviews() {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error('목록을 불러오지 못했습니다.');
  return response.json();
}

// 후기 하나 상세 불러오기 (id로 조회)
async function fetchReview(id) {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error('후기를 불러오지 못했습니다.');
  return response.json();
}

// 글 저장하기
async function saveReview(review) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
  if (!response.ok) throw new Error('저장하지 못했습니다.');
  return response.json();
}