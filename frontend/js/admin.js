const backend = location.origin.includes('file:') ? 'http://localhost:4000' : location.origin.replace(/:\d+$/, ':4000');

const attendeesList = document.getElementById('attendees-list');
const refreshBtn = document.getElementById('refresh-attendees');

async function loadAttendees() {
  attendeesList.innerHTML = 'Loading...';
  try {
    const res = await fetch(backend + '/api/attendees');
    const data = await res.json();
    attendeesList.innerHTML = '';
    if (!data.length) {
      attendeesList.innerHTML = '<div class="text-sm text-gray-500">No attendees yet.</div>';
    }
    data.forEach(u => {
      const el = document.createElement('div');
      el.className = 'p-2 border rounded flex items-center justify-between';
      el.innerHTML = `
        <div>
          <div class="font-medium">${u.name}</div>
          <div class="text-xs text-gray-500">${u.email}</div>
        </div>
        <div class="text-xs ${u.checkedIn ? 'text-green-600' : 'text-yellow-600'}">
          ${u.checkedIn ? 'Checked' : 'Not yet'}
        </div>
      `;
      attendeesList.appendChild(el);
    });
  } catch (e) {
    attendeesList.innerHTML = '<div class="text-sm text-red-600">Failed to load</div>';
  }
}

refreshBtn.addEventListener('click', loadAttendees);
loadAttendees();
