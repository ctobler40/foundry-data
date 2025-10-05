// server.ts – Full Postgres / Neon Version with TypeScript

import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import path from "path";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// -----------------------------
// 🌐 CRUD Routes for talents
// -----------------------------

// GET all talents
app.get("/api/talents", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM talents ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching talents:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET single talent by ID
app.get("/api/talents/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("SELECT * FROM talents WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Talent not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching talent:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST create a new talent
app.post("/api/talents", async (req: Request, res: Response) => {
  try {
    const { name, xp_cost, requirements, effect, rank_requirement, species_requirement } = req.body;

    const { rows } = await db.query(
      `INSERT INTO talents (name, xp_cost, requirements, effect, rank_requirement, species_requirement)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, xp_cost, requirements, effect, rank_requirement, species_requirement]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("❌ Error creating talent:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update a talent
app.put("/api/talents/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, xp_cost, requirements, effect, rank_requirement, species_requirement } = req.body;

    const { rows } = await db.query(
      `UPDATE talents
       SET name = $1, xp_cost = $2, requirements = $3, effect = $4, 
           rank_requirement = $5, species_requirement = $6
       WHERE id = $7
       RETURNING *`,
      [name, xp_cost, requirements, effect, rank_requirement, species_requirement, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Talent not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error updating talent:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a talent
app.delete("/api/talents/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM talents WHERE id = $1", [id]);
    res.json({ message: "Talent deleted" });
  } catch (err) {
    console.error("❌ Error deleting talent:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// -----------------------------
// Server start
// -----------------------------
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
