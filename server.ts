import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("enquiries.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    mobile TEXT,
    society TEXT,
    city TEXT,
    district TEXT,
    state TEXT,
    pincode TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration for existing databases
try {
  db.prepare("ALTER TABLE enquiries ADD COLUMN mobile TEXT").run();
  db.prepare("ALTER TABLE enquiries ADD COLUMN city TEXT").run();
  db.prepare("ALTER TABLE enquiries ADD COLUMN district TEXT").run();
  db.prepare("ALTER TABLE enquiries ADD COLUMN state TEXT").run();
  db.prepare("ALTER TABLE enquiries ADD COLUMN pincode TEXT").run();
} catch (e) {
  // Columns might already exist
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/enquiries", (req, res) => {
    const { name, mobile, society, city, district, state, pincode, message } = req.body;
    if (!name || !mobile) {
      return res.status(400).json({ error: "Name and mobile are required" });
    }

    try {
      const stmt = db.prepare(
        "INSERT INTO enquiries (name, mobile, society, city, district, state, pincode, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      );
      stmt.run(name, mobile, society, city, district, state, pincode, message);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save enquiry" });
    }
  });

  app.get("/api/enquiries", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM enquiries ORDER BY created_at DESC").all();
      res.json(rows);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch enquiries" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
