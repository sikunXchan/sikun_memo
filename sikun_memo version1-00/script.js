const titleInput = document.getElementById('titleInput');
const tagInput = document.getElementById('tagInput');
const memoInput = document.getElementById('memoInput');
const prioritySelect = document.getElementById('prioritySelect');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const memoList = document.getElementById('memoList');
const searchInput = document.getElementById('searchInput');

let editIndex = null;

function saveMemo() {
const title = titleInput.value.trim();
const tags = tagInput.value.split(',').map(t => t.trim()).filter(Boolean);
const content = memoInput.value.trim();
const priority = prioritySelect.value;
if (!content) return;

let memos = JSON.parse(localStorage.getItem('memos') || '[]');
const memoData = {
title,
tags,
content,
priority,
pinned: false,
date: new Date().toLocaleString()
};

if (editIndex !== null) {
memos[editIndex] = memoData;
editIndex = null;
} else {
memos.push(memoData);
}

localStorage.setItem('memos', JSON.stringify(memos));
resetForm();
displayMemos();
}

function resetForm() {
titleInput.value = "";
tagInput.value = "";
memoInput.value = "";
prioritySelect.value = "normal";
}

function displayMemos(filter = "") {
let memos = JSON.parse(localStorage.getItem('memos') || '[]');
memoList.innerHTML = "";

// ピン留め優先表示
memos.sort((a, b) => b.pinned - a.pinned);

memos.forEach((memo, index) => {
const text = (memo.title + memo.tags.join(' ') + memo.content).toLowerCase();
if (filter && !text.includes(filter.toLowerCase())) return;

const li = document.createElement('li');
li.classList.add(memo.priority);

const header = document.createElement('div');
header.className = "memo-header";
header.textContent = memo.title || "(タイトルなし)";
li.appendChild(header);

const tags = document.createElement('div');
tags.className = "memo-tags";
tags.textContent = memo.tags.join(', ');
li.appendChild(tags);

const date = document.createElement('div');
date.className = "memo-date";
date.textContent = memo.date;
li.appendChild(date);

const content = document.createElement('div');
content.className = "memo-content";
content.textContent = memo.content;
li.appendChild(content);

const editBtn = document.createElement('button');
editBtn.textContent = "編集";
editBtn.onclick = () => editMemo(index);
li.appendChild(editBtn);

const pinBtn = document.createElement('button');
pinBtn.textContent = memo.pinned ? "📌解除" : "📌固定";
pinBtn.onclick = () => togglePin(index);
li.appendChild(pinBtn);

const delBtn = document.createElement('button');
delBtn.textContent = "削除";
delBtn.onclick = () => deleteMemo(index);
li.appendChild(delBtn);

memoList.appendChild(li);
});
}

function editMemo(index) {
const memos = JSON.parse(localStorage.getItem('memos') || '[]');
const memo = memos[index];
titleInput.value = memo.title;
tagInput.value = memo.tags.join(', ');
memoInput.value = memo.content;
prioritySelect.value = memo.priority;
editIndex = index;
}

function togglePin(index) {
let memos = JSON.parse(localStorage.getItem('memos') || '[]');
memos[index].pinned = !memos[index].pinned;
localStorage.setItem('memos', JSON.stringify(memos));
displayMemos(searchInput.value);
}

function deleteMemo(index) {
let memos = JSON.parse(localStorage.getItem('memos') || '[]');
memos.splice(index, 1);
localStorage.setItem('memos', JSON.stringify(memos));
displayMemos(searchInput.value);
}

function clearAllMemos() {
if (confirm("本当に全削除しますか？")) {
localStorage.removeItem('memos');
displayMemos();
}
}

saveBtn.onclick = saveMemo;
clearBtn.onclick = clearAllMemos;
searchInput.oninput = () => displayMemos(searchInput.value);

displayMemos();
