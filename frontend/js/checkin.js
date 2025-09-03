const backend = location.origin.includes('file:') ? 'http://localhost:4000' : location.origin.replace(/:\d+$/, ':4000');

let scanner = null;

function startScanner() {
  if (scanner) return;
  scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (decodedText) => {
      try {
        const res = await fetch(backend + '/api/checkin', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ id: decodedText })
        });
        const data = await res.json();

        if (!res.ok) {
          document.getElementById('scan-error').textContent = data.error || 'Error checking in';
          document.getElementById('scan-error').classList.remove('hidden');
        } else {
          document.getElementById('scan-error').classList.add('hidden');
          document.getElementById('scan-name').textContent = data.user.name;
          document.getElementById('scan-email').textContent = data.user.email;
          document.getElementById('scan-id').textContent = data.user.id;
          document.getElementById('scan-result').classList.remove('hidden');
        }
      } catch {
        document.getElementById('scan-error').textContent = 'Network error';
        document.getElementById('scan-error').classList.remove('hidden');
      }
    },
    () => {}
  ).catch(err => {
    console.error('Scanner init failed', err);
    alert('Camera not available or permission denied');
  });
}

startScanner();
