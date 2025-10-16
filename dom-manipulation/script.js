// ====== Quotes Array (load from localStorage if available) ======
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Your limitation—it’s only your imagination.", category: "Inspiration" }
];

// ====== Display a Random Quote ======
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDiv = document.getElementById('quoteDisplay');
  quoteDiv.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>- ${randomQuote.category}</small>
  `;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
}

// ====== Add a New Quote ======
function addQuote() {
  const textInput = document.getElementById('newQuoteText').value.trim();
  const categoryInput = document.getElementById('newQuoteCategory').value.trim();

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });
    saveQuotes();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    showRandomQuote();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// ====== Save Quotes to Local Storage ======
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ====== Create Add Quote Form (Dynamic DOM) ======
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');
  formContainer.innerHTML = ''; // Clear any existing form

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// ====== Export Quotes as JSON File ======
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ====== Import Quotes from JSON File ======
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
    showRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

// ====== Event Listeners ======
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// ====== Initialize App ======
window.onload = function () {
  createAddQuoteForm();

  // If session has a last viewed quote, show it
  const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
  if (lastQuote) {
    const quoteDiv = document.getElementById('quoteDisplay');
    quoteDiv.innerHTML = `
      <p>"${lastQuote.text}"</p>
      <small>- ${lastQuote.category}</small>
    `;
  } else {
    showRandomQuote();
  }
};
