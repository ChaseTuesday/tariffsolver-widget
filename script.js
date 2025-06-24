
document.getElementById('classificationForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const description = document.getElementById('description').value.trim();
  const country = document.getElementById('country').value;
  const resultBox = document.getElementById('result');
  const submitBtn = document.getElementById('submitBtn');

  if (!description || description.length < 5) {
    alert("Please enter a detailed product description.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Classifying...";

  try {
    const response = await fetch('https://api.tariffsolver.com/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, country })
    });

    const data = await response.json();
    resultBox.innerHTML = `
      <h3>Classification Result</h3>
      <p><strong>HS Code:</strong> ${data.hs_code}</p>
      <p><strong>Duty Rate:</strong> ${data.duty_rate}%</p>
      <p><strong>Confidence:</strong> ${data.confidence}%</p>
    `;
  } catch (err) {
    resultBox.innerHTML = "Something went wrong. Please try again.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});

function setExample() {
  document.getElementById('description').value = "leather hiking boots with rubber soles";
  document.getElementById('country').value = "US";
}
