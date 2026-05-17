import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("construction.db");
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    projectName TEXT NOT NULL,
    location TEXT NOT NULL,
    area REAL NOT NULL,
    constructionType TEXT NOT NULL,
    materialQuality TEXT NOT NULL,
    budget REAL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    estimatedCost REAL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Default Settings
const defaultSettings = [
  { key: 'cost_per_sqft', value: '1500' },
  { key: 'material_rate_multiplier', value: '1.2' }, // High quality multiplier
  { key: 'labour_rate', value: '400' }
];

const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
defaultSettings.forEach(s => insertSetting.run(s.key, s.value));

// Seed Admin if not exists
const adminEmail = "admin@example.com";
const existingAdmin = db.prepare("SELECT * FROM users WHERE email = ?").get(adminEmail);
if (!existingAdmin) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run("Admin", adminEmail, hashedPassword, "admin");
}

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    next();
  };

  // Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, hashedPassword);
      const user = { id: result.lastInsertRowid, name, email, role: 'user' };
      const token = jwt.sign(user, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' }).json(user);
    } catch (err: any) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' }).json(payload);
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token").json({ message: "Logged out" });
  });

  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json(null);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json(decoded);
    } catch (err) {
      res.json(null);
    }
  });

  // User Routes
  app.get("/api/requests", authenticate, (req: any, res) => {
    const requests = db.prepare("SELECT * FROM requests WHERE userId = ? ORDER BY createdAt DESC").all(req.user.id);
    res.json(requests);
  });

  app.post("/api/requests", authenticate, (req: any, res) => {
    const { projectName, location, area, constructionType, materialQuality, budget, description } = req.body;
    
    // Calculate Estimate
    const settings = db.prepare("SELECT * FROM settings").all() as any[];
    const costPerSqft = parseFloat(settings.find(s => s.key === 'cost_per_sqft')?.value || "1500");
    const materialMultiplier = materialQuality === 'high' ? parseFloat(settings.find(s => s.key === 'material_rate_multiplier')?.value || "1.2") : 1.0;
    const labourRate = parseFloat(settings.find(s => s.key === 'labour_rate')?.value || "400");
    
    const estimatedCost = (area * costPerSqft * materialMultiplier) + (area * labourRate);

    const result = db.prepare(`
      INSERT INTO requests (userId, projectName, location, area, constructionType, materialQuality, budget, description, estimatedCost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, projectName, location, area, constructionType, materialQuality, budget, description, estimatedCost);
    
    res.json({ id: result.lastInsertRowid, estimatedCost });
  });

  app.put("/api/profile", authenticate, (req: any, res) => {
    const { name, email, password } = req.body;
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.prepare("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?").run(name, email, hashedPassword, req.user.id);
    } else {
      db.prepare("UPDATE users SET name = ?, email = ? WHERE id = ?").run(name, email, req.user.id);
    }
    res.json({ message: "Profile updated" });
  });

  // Admin Routes
  app.get("/api/admin/stats", authenticate, isAdmin, (req, res) => {
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'").get() as any;
    const totalRequests = db.prepare("SELECT COUNT(*) as count FROM requests").get() as any;
    const pending = db.prepare("SELECT COUNT(*) as count FROM requests WHERE status = 'pending'").get() as any;
    const approved = db.prepare("SELECT COUNT(*) as count FROM requests WHERE status = 'approved'").get() as any;
    const rejected = db.prepare("SELECT COUNT(*) as count FROM requests WHERE status = 'rejected'").get() as any;
    
    res.json({
      totalUsers: totalUsers.count,
      totalRequests: totalRequests.count,
      pending: pending.count,
      approved: approved.count,
      rejected: rejected.count
    });
  });

  app.get("/api/admin/requests", authenticate, isAdmin, (req, res) => {
    const requests = db.prepare(`
      SELECT r.*, u.name as userName, u.email as userEmail 
      FROM requests r 
      JOIN users u ON r.userId = u.id 
      ORDER BY r.createdAt DESC
    `).all();
    res.json(requests);
  });

  app.patch("/api/admin/requests/:id", authenticate, isAdmin, (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE requests SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ message: "Request updated" });
  });

  app.get("/api/admin/users", authenticate, isAdmin, (req, res) => {
    const users = db.prepare("SELECT id, name, email, role FROM users WHERE role = 'user'").all();
    res.json(users);
  });

  app.delete("/api/admin/users/:id", authenticate, isAdmin, (req, res) => {
    db.prepare("DELETE FROM requests WHERE userId = ?").run(req.params.id);
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ message: "User deleted" });
  });

  app.get("/api/admin/settings", authenticate, isAdmin, (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    res.json(settings);
  });

  app.post("/api/admin/settings", authenticate, isAdmin, (req, res) => {
    const { settings } = req.body; // Array of {key, value}
    const update = db.prepare("UPDATE settings SET value = ? WHERE key = ?");
    const transaction = db.transaction((items) => {
      for (const item of items) update.run(item.value, item.key);
    });
    transaction(settings);
    res.json({ message: "Settings updated" });
  });

  // Vite Integration
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

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
