// ===== STORAGE KEYS =====
const STORAGE_KEY = 'dqg_quotes_v1';
const FILTER_KEY = 'dqg_selected_category';
const LAST_INDEX_KEY = 'dqg_last_index';
const SYNC_TIME_KEY = 'dqg_last_sync';

// ===== DEFAULT QUOTES =====
const DEFAULT_QUOTES = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" }
];

let quotes = [];
loadQuotes();

// ===== HELPERS =====
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) {
        quotes = parsed;
        return;
      }
    }
  } catch (e) {
    console.error('Error loading quotes:', e);
  }
  quotes = DEFAULT_QUOTES.slice();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function isValidQuote(q) {
  return q && typeof q.text === 'string' && q.text.trim() !== '' &&
         typeof q.category === 'string' && q.category.trim() !== '';
}

// ===== TASK 0 =====
function displayRandomQuote() {
  const category = localStorage.getItem(FILTER_KEY) || 'all';
  const filtered = category === 'all' ? quotes : quotes.filter(q => q.category === category);
  const quoteDisplay = document.getElementById('quoteDisplay');

  if (!filtered.length) {
    quoteDisplay.innerHTML = '<p>No quotes found in this category.</p>';
    return;
  }

  const idx = Math.floor(Math.random() * filtered.length);
  const q = filtered[idx];
  quoteDisplay.innerHTML = <p>"${escapeHtml(q.text)}"</p><small>- ${escapeHtml(q.category)}</small>;

  sessionStorage.setItem(LAST_INDEX_KEY, idx);
}
function showRandomQuote() { displayRandomQuote(); }

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert('Please fill in both fields.');
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayRandomQuote();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

function createAddQuoteForm() {
  const container = document.getElementById('formContainer');
  if (!container) return;

  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// ===== TASK 1 =====
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        imported.forEach(q => {
          if (isValidQuote(q) && !quotes.find(x => x.text === q.text)) {
            quotes.push(q);
          }
        });
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON file.');
      }
    } catch (err) {
      alert('Error reading file.');
    }
  };
  reader.readAsText(file);
}

// ===== TASK 2 =====
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  if (!select) return;

  const categories = Array.from(new Set(quotes.map(q => q.category))).sort();
  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  const saved = localStorage.getItem(FILTER_KEY);
  if (saved) select.value = saved;
}

function filterQuotes() {
  const val = document.getElementById('categoryFilter').value;
  localStorage.setItem(FILTER_KEY, val);
  displayRandomQuote();
}

// ===== TASK 3 =====
// Mock server URL for simulation (JSONPlaceholder)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Sync with “server”
async function syncWithServer() {
  const status = document.getElementById('syncStatus');
  status.textContent = 'Syncing... ⏳';

  try {
    // Fetch mock server data (simulate server quotes)
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate server quotes (limit to 3 new)
    const serverQuotes = serverData.slice(0, 3).map((item, i) => ({
      text: Server Quote #${i + 1}: ${item.title},
      category: 'Server'
    }));

    // Merge data: server takes precedence
    const merged = [...quotes];
    serverQuotes.forEach(sq => {
      const idx = merged.findIndex(lq => lq.text === sq.text);
      if (idx === -1) merged.push(sq);
      else merged[idx] = sq; // overwrite if conflict
    });

    quotes = merged;
    saveQuotes();
    populateCategories();

    const now = new Date().toLocaleString();
    localStorage.setItem(SYNC_TIME_KEY, now);
    status.textContent = Last Sync: ${now};
    alert('Quotes synced with server successfully!');
  } catch (err) {
    console.error(err);
    status.textContent = 'Sync failed ❌';
  }
}

// Auto-sync every 60 seconds
setInterval(syncWithServer, 60000);

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  createAddQuoteForm();
  populateCategories();

  const showBtn = document.getElementById('newQuote');
  if (showBtn) showBtn.addEventListener('click', displayRandomQuote);

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportToJsonFile);

  const syncBtn = document.getElementById('syncNow');
  if (syncBtn) syncBtn.addEventListener('click', syncWithServer);

  const lastSync = localStorage.getItem(SYNC_TIME_KEY);
  const syncStatus = document.getElementById('syncStatus');
  if (lastSync && syncStatus) syncStatus.textContent = Last Sync: ${lastSync};

  displayRandomQuote();
});
