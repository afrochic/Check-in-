# 📌 QR Check-in App

A simple event management system that allows you to:
- **Register attendees** and generate unique QR codes
- **Check in attendees** by scanning their QR code
- **Manage attendees** via an Admin dashboard

---

## 🚀 Features
- Register with name, email, team, and T-shirt size
- Auto-generate unique QR codes for each attendee
- Check-in via webcam QR scanner
- Admin dashboard with real-time attendee list
- Backend stores data in JSON file (no database needed)

---

## 📂 Project Structure

qr-checkin-app/
│── backend/ # Node.js + Express API
│ ├── server.js # Backend server
│ └── data/ # Stores registrations.json
│
│── frontend/ # HTML, TailwindCSS, JS
│ ├── index.html # Landing page
│ ├── register.html # Registration page
│ ├── checkin.html # Scanner page
│ ├── admin.html # Admin dashboard
│ └── js/ # Page-specific JS


---

## ⚙️ Backend Setup

1. Go to backend folder:
   ```bash
   cd backend

2.node server.js

---

## ⚙️ Frontend Setup

1. cd frontend
2.npm install -g http-server
http-server -p 3000


