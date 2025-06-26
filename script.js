document.getElementById('classificationForm')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    classifyProduct();
  });

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
      body: JSON.stringify({ description, price: 100, country }) // dummy price for model
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API response:', data); // Dev debug log

    loading.style.display = 'none';
    resultBox.innerHTML = `
      <strong>Classification result</strong><br>
      HTS code: ${data.hts_code}<br>
      Duty: ${data.duty}%<br>
      VAT: ${data.vat}%<br>
      Total Landed Cost: $${data.total_cost}<br>
      Confidence: ${data.confidence}<br>
      <em>${explainConfidence(data.confidence)}</em><br>
      <hr>
      <strong>Rationale:</strong> ${data.rationale}
    `;
  } catch (error) {
    loading.style.display = 'none';
    console.error('❌ API error:', error);
    resultBox.innerHTML = '❌ Something went wrong. Please try again.';
  }
}

function explainConfidence(confidence) {
  if (confidence >= 0.9) return "High confidence – Ready for use.";
  if (confidence >= 0.7) return "Medium confidence – Review recommended.";
  return "Low confidence – Please double check.";
}
