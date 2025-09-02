
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "registrations.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    console.error("readData error", e);
    return [];
  }
}

function writeData(rows) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2), "utf-8");
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Health
app.get("/", (req, res) => res.send("QR Checkin Backend is running"));

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, team, tshirt } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: "name and email required" });

    const rows = readData();

    if (rows.some(r => r.email && r.email.toLowerCase() === (email || "").toLowerCase())) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const id = uuidv4();
    const record = {
      id,
      name,
      email,
      team: team || null,
      tshirt: tshirt || null,
      checkedIn: false,
      createdAt: new Date().toISOString()
    };

    rows.push(record);
    writeData(rows);

    const qrDataUrl = await QRCode.toDataURL(id);

    return res.json({ ...record, qr: qrDataUrl });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get all attendees
app.get("/api/attendees", (req, res) => {
  const rows = readData();
  res.json(rows);
});

// Get single attendee
app.get("/api/attendee/:id", (req, res) => {
  const rows = readData();
  const found = rows.find(r => r.id === req.params.id);
  if (!found) return res.status(404).json({ error: "Not found" });
  res.json(found);
});

// Check-in
app.post("/api/checkin", (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: "id required" });

    const rows = readData();
    const idx = rows.findIndex(r => r.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not registered" });

    if (rows[idx].checkedIn) {
      return res.json({ message: "Already checked in", user: rows[idx] });
    }

    rows[idx].checkedIn = true;
    rows[idx].checkedInAt = new Date().toISOString();
    writeData(rows);

    return res.json({ message: "Checked in", user: rows[idx] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Serve static files: optional: qr images or UI assets are in ../frontend
app.get("/data/registrations.json", (req, res) => {
  res.sendFile(DATA_FILE);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`QR backend running on http://localhost:${port}`));
