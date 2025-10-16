// quotes array with text and category properties
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Design" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Inspiration" },
  { text: "Learning never exhausts the mind.", category: "Wisdom" }
];

// function to display a random quote
function displayRandomQuote() {
  // get a random index
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // update DOM
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p><em>Category:</em> ${quote.category}</p>
  `;
}

// function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both the quote and category!");
    return;
  }

  // push new quote into quotes array
  quotes.push({ text: newText, category: newCategory });

  // clear input fields
  textInput.value = "";
  categoryInput.value = "";

  // update DOM to show new quote
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>"${newText}"</p>
    <p><em>Category:</em> ${newCategory}</p>
  `;
}

// event listener for the “Show New Quote” button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// optional: also add listener for the Add Quote button
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// display one quote at load
displayRandomQuote();
