document.getElementById('scanButton').addEventListener('click', async () => {
  const fileInput = document.getElementById('receiptInput');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please upload a receipt image.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('apikey', 'YOUR_OCR_API_KEY'); // Replace with your OCR API key

  try {
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.IsErroredOnProcessing) {
      alert('Error processing the receipt.');
    } else {
      const parsedText = data.ParsedResults[0].ParsedText;
      displayExpenseDetails(parsedText);
    }
  } catch (error) {
    alert('Error scanning the receipt.');
  }
});

function displayExpenseDetails(text) {
  const storeName = extractStoreName(text);
  const totalAmount = extractTotalAmount(text);
  const purchaseDate = extractPurchaseDate(text);

  document.getElementById('storeName').textContent = storeName;
  document.getElementById('totalAmount').textContent = totalAmount;
  document.getElementById('purchaseDate').textContent = purchaseDate;
  document.getElementById('expenseDetails').style.display = 'block';
}

function extractStoreName(text) {
  // Implement logic to extract store name from the text
  return 'Sample Store';
}

function extractTotalAmount(text) {
  // Implement logic to extract total amount from the text
  return '20.00';
}

function extractPurchaseDate(text) {
  // Implement logic to extract purchase date from the text
  return '2025-08-14';
}
let expenses = [];

function addExpense(store, amount, date) {
  expenses.push({ store, amount, date });
  updateExpenseList();
}

function updateExpenseList() {
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = '';
  expenses.forEach(expense => {
    const li = document.createElement('li');
    li.textContent = `${expense.date} - ${expense.store}: $${expense.amount}`;
    expenseList.appendChild(li);
  });
}

function setBudget(amount) {
  localStorage.setItem('budget', amount);
}

function getBudget() {
  return parseFloat(localStorage.getItem('budget')) || 0;
}

function checkBudget() {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budget = getBudget();
  if (totalSpent > budget) {
    alert('You have exceeded your budget!');
  }
}
