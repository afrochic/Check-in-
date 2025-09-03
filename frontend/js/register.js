const backend = location.origin.includes('file:') ? 'http://localhost:4000' : location.origin.replace(/:\d+$/, ':4000');

const form = document.getElementById('registration-form');
const qrSection = document.getElementById('qr-section');
const qrCanvas = document.getElementById('qr-code-canvas');
const qrId = document.getElementById('qr-id');
const downloadBtn = document.getElementById('download-qr');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const team = document.getElementById('team').value.trim();
  const tshirt = document.getElementById('tshirt').value.trim();

  try {
    const res = await fetch(backend + '/api/register', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, team, tshirt })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Registration failed');

    qrCanvas.innerHTML = '';
    const img = document.createElement('img');
    img.src = data.qr;
    img.alt = 'qr';
    img.style.width = '220px';
    qrCanvas.appendChild(img);

    qrId.textContent = 'ID: ' + data.id;
    qrSection.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    alert('Network error');
  }
});

downloadBtn.addEventListener('click', () => {
  const img = qrCanvas.querySelector('img');
  if (!img) return alert('No QR code to download');
  const a = document.createElement('a');
  a.href = img.src;
  a.download = 'qr.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
});
