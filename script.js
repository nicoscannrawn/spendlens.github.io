// Function to handle the receipt scanning process
async function scanReceipt() {
  const fileInput = document.getElementById('receiptInput');
  const file = fileInput.files[0];
  const apiKey = K81834924488957; // Replace with your OCR API key

  if (!file) {
    alert('Please upload a receipt image.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('apikey', apiKey);

  try {
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (data.IsErroredOnProcessing) {
      alert('Error processing the receipt.');
      return;
    }

    const parsedText = data.ParsedResults[0].ParsedText;
    displayReceiptDetails(parsedText);
  } catch (error) {
    alert('Error scanning the receipt.');
  }
}

// Function to display extracted receipt details
function displayReceiptDetails(text) {
  const storeName = extractStoreName(text);
  const totalAmount = extractTotalAmount(text);
  const purchaseDate = extractPurchaseDate(text);

  document.getElementById('storeName').textContent = storeName;
  document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
  document.getElementById('purchaseDate').textContent = purchaseDate;
  document.getElementById('expenseDetails').style.display = 'block';
}

// Function to extract store name from OCR text
function extractStoreName(text) {
  const match = text.match(/^(.+)$/m); // Matches the first non-empty line
  return match ? match[1].trim() : 'Unknown Store';
}

// Function to extract total amount from OCR text
function extractTotalAmount(text) {
  const match = text.match(/(?:Total|Amount Due|Total Due)[\s:]*\$(\d+(\.\d{1,2})?)/i);
  return match ? parseFloat(match[1]) : 0.00;
}

// Function to extract purchase date from OCR text
function extractPurchaseDate(text) {
  const match = text.match(/\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})\b/);
  return match ? match[0] : 'Unknown Date';
}

// Event listener for the scan button
document.getElementById('scanButton').addEventListener('click', scanReceipt);
