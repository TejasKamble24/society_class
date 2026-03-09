import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// SQLite Fallback (for local/preview)
let db: any = null;
if (!supabase) {
  console.log("Supabase not configured, falling back to local SQLite (enquiries.db)");
  db = new Database("enquiries.db");
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
} else {
  console.log("Supabase client initialized successfully.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      database: supabase ? "supabase" : "sqlite",
      env: process.env.NODE_ENV || "development"
    });
  });

  // API Routes
  app.post("/api/enquiries", async (req, res) => {
    console.log("POST /api/enquiries - Body:", req.body);
    const { name, mobile, society, city, district, state, pincode, message } = req.body;
    
    if (!name || !mobile) {
      return res.status(400).json({ error: "Name and mobile are required" });
    }

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('enquiries')
          .insert([{ name, mobile, society, city, district, state, pincode, message }]);
        
        if (error) throw error;
        console.log("Enquiry saved to Supabase");
      } else {
        const stmt = db.prepare(
          "INSERT INTO enquiries (name, mobile, society, city, district, state, pincode, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        const result = stmt.run(name, mobile, society, city, district, state, pincode, message);
        console.log("Enquiry saved to SQLite, ID:", result.lastInsertRowid);
      }
      res.status(201).json({ success: true });
    } catch (error: any) {
      console.error("Error saving enquiry:", error);
      res.status(500).json({ error: error.message || "Failed to save enquiry" });
    }
  });

  app.get("/api/enquiries", async (req, res) => {
    console.log("GET /api/enquiries");
    try {
      let rows;
      if (supabase) {
        const { data, error } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        rows = data;
      } else {
        rows = db.prepare("SELECT * FROM enquiries ORDER BY created_at DESC").all();
      }
      res.json(rows);
    } catch (error: any) {
      console.error("Error fetching enquiries:", error);
      res.status(500).json({ error: error.message || "Failed to fetch enquiries" });
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
    console.log(`Database: ${supabase ? "Supabase" : "SQLite"}`);
  });
}

startServer();
