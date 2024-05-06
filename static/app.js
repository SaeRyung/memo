//서버에서 받아온 내용 html에 추가
async function editMemo(event) {
  const id = event.target.dataset.id; //특정 id 어떤 버튼이 눌렸는지
  const editInput = prompt("수정할 값을 입력하세요"); //
  const res = await fetch(`/memos/${id}`, {
    method: "PUT", //값 수정. 이 값으로 바꿔줘 메소드: put
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: id, //id,로만 생략해도 id 들어감
      content: editInput,
    }),
  });
  readMemo();
  //서버에 특정 id 값 보내기->request body
}

//메모삭제 이벤트
async function deleteMemo(event) {
  const id = event.target.dataset.id;
  const res = await fetch(`/memos/${id}`, {
    method: "DELETE", //값 삭제 메소드:delete
  }); //request body에 값을 넣을게 아님, id만으로 서버에서는 데이터 삭제 가능하므로
  readMemo();
}

function displayMemo(memo) {
  const ul = document.querySelector("#memo-ul"); //html ul 쿼리셀렉터로 불러오기

  const li = document.createElement("li"); //li 태그 만들기
  li.innerText = `[id:${memo.id}] ${memo.content}`;

  //수정버튼
  const editBtn = document.createElement("button"); //수정하기 버튼
  editBtn.innerText = "수정하기";
  editBtn.addEventListener("click", editMemo); //이벤트추가. editMemo 함수 호출
  editBtn.dataset.id = memo.id; //dataset 속성에 id값 넣어주기

  //삭제버튼
  const delBtn = document.createElement("button");
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", deleteMemo);
  delBtn.dataset.id = memo.id;

  li.append(editBtn);
  li.appendChild(delBtn);
  ul.appendChild(li);
}
//get요청
async function readMemo() {
  const res = await fetch("/memos"); //memos get해서 가져와주세요
  const jsonRes = await res.json(); //json으로 받음
  //jsonRes = [{id:123, content:'블라블라'}] 내용을 받아온 후 html 추가
  const ul = document.querySelector("#memo-ul");
  ul.innerHTML = ""; //초기화----------------에러 수정 후 활성화 필요
  jsonRes.forEach(displayMemo);
}

//서버에 메모 만들기 요청, async - await 함께 사용
async function createMemo(value) {
  const res = await fetch("/memos", {
    //서버 응답 await 기다림. /memos 라는 경로로 요청 보냄. post요청으로 보냄
    method: "POST", //method: post 라는 메소드로 보냄
    headers: { "Content-Type": "application/json" }, //header에 request body로 받아야함. 필수로 추가해야 하는 값 Content-Type": "application/json
    body: JSON.stringify({
      //JSON.stringfy 통신시 문자열만 전송. 문자열로 body 변경 후 전송 후, 받는 쪽에서 다시 json형태로 받고, 처리하고..
      //메모확인 id
      id: new Date().getTime(),
      content: value,
    }),
  });

  //const jsonRes = await res.json();
  //console.log("jsonRes", jsonRes);

  readMemo();
}

//메모 생성 함수, 제출 시 동작
function handleSubmit(event) {
  //이벤트 넘어옴
  event.preventDefault(); //이벤트가 발생하는걸 막는 함수
  const input = document.querySelector("#memo-input"); //입력값 가져오기
  createMemo(input.value); //input에 있는 value값 넘겨줌. 메모 생성해라
  input.value = ""; //메모 입력 후 칸 지우기
}

//발동 이벤트
const form = document.querySelector("#memo-form"); //html momo-form변수로 지정
form.addEventListener("submit", handleSubmit); //form의 값이 제출됐을때 발생하는 이벤트. createMemon 호출
//form의 submit 이벤트는 redirect 이벤트 발생, 스스로 새로고침.방지 필요

readMemo();
