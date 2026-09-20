// 배포한 Apps Script 웹앱 주소 — 나중에 다시 배포해서 주소가 바뀌면 여기만 고치면 됨
const API_URL = "https://script.google.com/macros/s/AKfycbwaApBhZyh2Ygr8ZAi_WTPKXf1UeLqVKbOlfFxsHgYi1kmv7JaBusoKxxdBIZ_2MzPf/exec";

// 목록 불러오기: Apps Script에 GET 요청을 보내고, 후기 배열을 받아옴
async function fetchReviews() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('목록을 불러오지 못했습니다.');
  return response.json();
}

// 댓글 불러오기: 특정 후기(reviewId)에 달린 댓글만 받아옴
async function fetchComments(reviewId) {
  const url = `${API_URL}?action=comments&reviewId=${encodeURIComponent(reviewId)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('댓글을 불러오지 못했습니다.');
  return response.json();
}

// 후기든 댓글이든, Apps Script에 실제로 저장 요청을 보내는 공통 함수
// CORS 오류 없이 통하도록 Content-Type을 text/plain으로 보냄 (내용 자체는 JSON 문자열)
async function postData_(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('저장하지 못했습니다.');
  return response.json();
}

// 글 저장하기: 새 후기를 저장함
async function saveReview(review) {
  return postData_(review);
}

// 댓글 저장하기: type을 "comment"로 표시해서 보냄 (Apps Script가 이 값으로 구분함)
async function saveComment(comment) {
  return postData_({ type: 'comment', ...comment });
}