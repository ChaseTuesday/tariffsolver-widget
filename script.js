document.getElementById('classificationForm')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    classifyProduct();
  });

function setExample() {
  document.getElementById('description').value = 'leather hiking boots with rubber soles';
  document.getElementById('country').value = 'US';
}

async function classifyProduct() {
  const description = document.getElementById('description').value;
  const country = document.getElementById('country').value;
  const resultBox = document.getElementById('result');
  const loading = document.getElementById('loading');

  resultBox.innerHTML = '';
  loading.style.display = 'block';

  try {
    const response = await fetch('https://tslite-api.onrender.com/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description,
        country,
        price: 100 // Dummy static price for API compatibility
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ API response:", data);

    loading.style.display = 'none';

    resultBox.innerHTML = `
      <strong>HTS Code:</strong> ${data.hts_code}<br>
      <strong>Duty:</strong> ${data.duty}%<br>
      <strong>VAT:</strong> ${data.vat}%<br>
      <strong>Total Landed Cost:</strong> $${data.total_cost}<br>
      <strong>Confidence:</strong> ${data.confidence}<br>
      <em>${confidenceText(data.confidence)}</em><br><br>
      <strong>Rationale:</strong><br>${data.rationale}
    `;
  } catch (err) {
    console.error("❌ Error during classification:", err);
    loading.style.display = 'none';
    resultBox.innerHTML = '❌ Something went wrong. Please try again.';
  }
}

function confidenceText(score) {
  if (score >= 0.9) return 'High confidence – ready for use';
  if (score >= 0.7) return 'Medium confidence – review recommended';
  return 'Low confidence – please double check';
}
