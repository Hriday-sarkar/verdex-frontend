// at top of file
const API_BASE = "https://verdex-backend-nfog.onrender.com";

const caseList = document.getElementById("cases");
const caseForm = document.getElementById("case-form");

/**
 * Fetches public cases from the API and renders them.
 */
async function fetchAndRenderCases() {
  if (!caseList) return;

  try {
    const response = await fetch(`${API_BASE}/api/cases`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const cases = await response.json();

    caseList.innerHTML = ''; // Clear existing list
    cases.forEach(c => {
      const div = document.createElement("div");
      div.className = "case-item";
      // Use _id from MongoDB
      div.innerHTML = `<h3>${c.title}</h3><p>${c.description}</p>
      <a href="case.html?id=${c._id}">Open Case</a>`;
      caseList.appendChild(div);
    });
  } catch (error) {
    console.error("Failed to fetch cases:", error);
    caseList.innerHTML = '<p class="error">Could not load cases. Please try again later.</p>';
  }
}

/**
 * Handles the submission of the new case form.
 * @param {Event} e The form submission event.
 */
async function handleCreateCase(e) {
    e.preventDefault();
    const resultEl = document.getElementById("result");
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const visibility = document.getElementById("visibility").value;

    try {
      const response = await fetch(`${API_BASE}/api/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, visibility }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }

      const newCase = await response.json();
      resultEl.textContent = `✅ Case "${newCase.title}" created!`;
      resultEl.className = 'success';
      caseForm.reset();
      // Optionally, redirect or update the case list
      fetchAndRenderCases(); // Refresh the list on the main page
    } catch (error) {
      console.error("Failed to create case:", error);
      resultEl.textContent = `❌ Error: ${error.message}`;
      resultEl.className = 'error';
    }
}

/**
 * Fetches and displays a single case on the case detail page.
 */
async function fetchAndRenderSingleCase() {
  const caseDetailContainer = document.getElementById("case-detail-container");
  if (!caseDetailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const caseId = params.get('id');

  if (!caseId) {
    caseDetailContainer.innerHTML = '<p class="error">No case ID provided.</p>';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/cases/${caseId}`);
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || `HTTP error! status: ${response.status}`);
    }
    const caseData = await response.json();

    // Populate the page with case data
    document.getElementById("case-title").textContent = caseData.title;
    document.getElementById("case-description").textContent = caseData.description;
    
    // Update vote counts
    document.getElementById("guilty-count").textContent = caseData.votes.guilty;
    document.getElementById("not-guilty-count").textContent = caseData.votes.notGuilty;
    document.getElementById("neutral-count").textContent = caseData.votes.neutral;

  } catch (error) {
    console.error("Failed to fetch case:", error);
    caseDetailContainer.innerHTML = `<p class="error">Could not load case: ${error.message}</p>`;
  }
}

/**
 * Submits a vote for the current case.
 * @param {'guilty' | 'notGuilty' | 'neutral'} voteType The type of vote.
 */
async function vote(voteType) {
  const params = new URLSearchParams(window.location.search);
  const caseId = params.get('id');
  const voteResultEl = document.getElementById("vote-result");

  try {
    const response = await fetch(`${API_BASE}/api/cases/${caseId}/vote`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote: voteType }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || `HTTP error! status: ${response.status}`);
    }

    voteResultEl.textContent = `✅ Your vote for "${voteType}" has been counted!`;
    voteResultEl.className = 'success';
    // Refresh the case data to show new vote counts
    fetchAndRenderSingleCase(); 
  } catch (error) {
    console.error("Failed to vote:", error);
    voteResultEl.textContent = `❌ Error: ${error.message}`;
    voteResultEl.className = 'error';
  }
}

// --- Event Listeners ---

// If on the main page, fetch cases when the page loads.
document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderCases(); // For index.html
  fetchAndRenderSingleCase(); // For case.html
  if (caseForm) caseForm.addEventListener("submit", handleCreateCase); // For create.html
});
