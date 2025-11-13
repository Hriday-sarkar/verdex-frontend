// at top of file
const API_BASE = "https://verdex-backend-nfog.onrender.com";


// Simulated sample cases

const cases = [
  { id: 1, title: "Was it fair to take credit for group work?", desc: "A student took credit for a project others helped with.", visibility: "public" },
  { id: 2, title: "Should phones be banned in class?", desc: "Some students argue it affects focus, others say it's helpful.", visibility: "public" }
];

const caseList = document.getElementById("cases");

if (caseList) {
  cases.forEach(c => {
    const div = document.createElement("div");
    div.className = "case-item";
    div.innerHTML = `<h3>${c.title}</h3><p>${c.desc}</p>
    <a href="case.html?id=${c.id}">Open Case</a>`;
    caseList.appendChild(div);
  });
}

function vote(type) {
  document.getElementById("vote-result").textContent = `You voted: ${type.toUpperCase()}`;
}

const form = document.getElementById("case-form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const desc = document.getElementById("description").value;
    const vis = document.getElementById("visibility").value;
    document.getElementById("result").textContent = `✅ Case "${title}" created (${vis})!`;
    form.reset();
  });
}
