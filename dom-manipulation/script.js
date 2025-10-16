// Initial quotes array (Task 0 requirement)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

// Display a random quote (Task 0)
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const filtered = getFilteredQuotes();
  const randomIndex = Math.floor(Math.random() * filtered.length);
  quoteDisplay.textContent = filtered[randomIndex]
    ? "${filtered[randomIndex].text}" — ${filtered[randomIndex].category}
    : "No quotes available for this category.";
}

// Add a new quote (Task 1)
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    populateCategories();
    displayRandomQuote();
  }
}

// ✅ Task 2: Populate unique categories dynamically
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categorySelect.innerHTML = categories
    .map(cat => <option value="${cat}">${cat}</option>)
    .join("");

  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  categorySelect.value = savedCategory;
}

// ✅ Task 2: Get filtered quotes based on selected category
function getFilteredQuotes() {
  const selectedCategory = localStorage.getItem("selectedCategory") || "all";
  return selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
}

// ✅ Task 2: Filter quotes and update localStorage
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayRandomQuote();
}

// ✅ Task 3: Fetch quotes from mock server (simulation)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Convert server data into quote format
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Failed to fetch from server:", error);
    return [];
  }
}

// ✅ Task 3: Post new quotes to server (simulation)
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
  } catch (error) {
    console.error("Failed to post to server:", error);
  }
}

// ✅ Task 3: Sync quotes and resolve conflicts
async function syncQuotes() {
  const syncStatus = document.getElementById("syncStatus");
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: Server data takes precedence
  const mergedQuotes = [...serverQuotes, ...quotes.filter(q => q.category !== "Server")];
  quotes = mergedQuotes;
  localStorage.setItem("quotes", JSON.stringify(quotes));

  syncStatus.textContent = "✅ Quotes synced successfully!";
  populateCategories();
  displayRandomQuote();
}

// Event listeners (Task 1)
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Initialize (Task 0–3)
window.onload = async () => {
  populateCategories();
  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  document.getElementById("categoryFilter").value = savedCategory;
  displayRandomQuote();

  // Periodic sync every 15 seconds (Task 3)
  await syncQuotes();
  setInterval(syncQuotes, 15000);
};
