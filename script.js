// 배포한 Apps Script 웹앱 주소 — 나중에 다시 배포해서 주소가 바뀌면 여기만 고치면 됨
const API_URL = "https://script.google.com/macros/s/AKfycbzp7zF1y-ltSi9zd7HGWa86d0L8hudmegffRrpUXclpwajFmMU3nf3we59jylAMfy3A/exec";

// 목록 불러오기: Apps Script에 GET 요청을 보내고, 후기 배열을 받아옴
async function fetchReviews() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('목록을 불러오지 못했습니다.');
  return response.json();
}

// 글 저장하기: Apps Script에 POST 요청을 보냄
// CORS 오류 없이 통하도록 Content-Type을 text/plain으로 보냄 (내용 자체는 JSON 문자열)
async function saveReview(review) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(review)
  });
  if (!response.ok) throw new Error('저장하지 못했습니다.');
  return response.json();
}