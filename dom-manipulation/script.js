// Array of quote objects
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Your limitation—it’s only your imagination.", category: "Inspiration" }
];

// Function to display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDiv = document.getElementById('quoteDisplay');
  quoteDiv.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>- ${randomQuote.category}</small>
  `;
}

// Function to add a new quote dynamically
function addQuote() {
  const textInput = document.getElementById('newQuoteText').value.trim();
  const categoryInput = document.getElementById('newQuoteCategory').value.trim();

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    displayRandomQuote();
  } else {
    alert('Please enter both quote and category.');
  }
}

// Event listener for button click
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Display a quote on page load
window.onload = displayRandomQuote;
