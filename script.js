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
      body: JSON.stringify({ description, price: 100, country }) // dummy price to match backend model
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API response:', data); // for dev/debug

    loading.style.display = 'none';

    resultBox.innerHTML = `
      <strong>Classification result</strong><br>
      HTS code: ${data.hts_code}<br>
      Duty: ${data.duty}%<br>
      VAT: ${data.vat}%<br>
      Total Landed Cost: $${data.total_cost}<br>
      Confidence: ${data.confidence}<br>
      <em>${explainConfidence(data.confidence)}</em><br><br>
      <strong>Rationale:</strong> ${data.rationale}
    `;
  } catch (error) {
    console.error('❌ API call failed:', error);
    loading.style.display = 'none';
    resultBox.innerHTML = '❌ Something went wrong. Please try again.';
  }
}

function explainConfidence(confidence) {
  if (confidence >= 90) return 'High confidence — Ready for use.';
  if (confidence >= 70) return 'Medium confidence — Review recommended.';
  return 'Low confidence — Please double check.';
}

function setExample() {
  document.getElementById('description').value = 'leather hiking boots with rubber soles';
  document.getElementById('country').value = 'US';
}
