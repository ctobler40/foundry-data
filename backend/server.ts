// server.ts – Full Postgres / Neon Version with TypeScript

import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// ----------------------------------------
// ⚙️ Middleware
// ----------------------------------------
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://foundry-data.onrender.com",
    ],
  })
);
app.use(express.json());

// ----------------------------------------
// 🗃️ Database Connection
// ----------------------------------------
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ----------------------------------------
// 🌐 Default Route
// ----------------------------------------
app.get("/", (req, res) => {
  res.send("API is running. Use /api/talents or /api/characters for data.");
});


// ============================================================================
// TALENTS ROUTES
// ============================================================================
app.get("/api/talents", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM talents ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching talents:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/talents/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("SELECT * FROM talents WHERE id = $1", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Talent not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching talent:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/talents", async (req: Request, res: Response) => {
  try {
    const {
      name,
      xp_cost,
      requirements,
      effect,
      rank_requirement,
      species_requirement,
    } = req.body;
    const { rows } = await db.query(
      `INSERT INTO talents (name, xp_cost, requirements, effect, rank_requirement, species_requirement)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, xp_cost, requirements, effect, rank_requirement, species_requirement]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating talent:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/talents/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      xp_cost,
      requirements,
      effect,
      rank_requirement,
      species_requirement,
    } = req.body;
    const { rows } = await db.query(
      `UPDATE talents
       SET name = $1, xp_cost = $2, requirements = $3, effect = $4,
           rank_requirement = $5, species_requirement = $6
       WHERE id = $7
       RETURNING *`,
      [name, xp_cost, requirements, effect, rank_requirement, species_requirement, id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Talent not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating talent:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/talents/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM talents WHERE id = $1", [id]);
    res.json({ message: "Talent deleted" });
  } catch (err) {
    console.error("Error deleting talent:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ============================================================================
// CHARACTERS ROUTES
// ============================================================================

// Get all characters with joined importance and status info
app.get("/api/characters", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query(`
      SELECT c.*, ci.importance AS importance_label, cs.status AS status_label
      FROM characters c
      LEFT JOIN characterImportance ci ON c.characterImportance = ci.id
      LEFT JOIN characterStatus cs ON c.status = cs.id
      ORDER BY c.id ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching characters:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get character by ID
app.get("/api/characters/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT c.*, ci.importance AS importance_label, cs.status AS status_label
      FROM characters c
      LEFT JOIN characterImportance ci ON c.characterImportance = ci.id
      LEFT JOIN characterStatus cs ON c.status = cs.id
      WHERE c.id = $1;
    `, [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Character not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching character:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create new character
app.post("/api/characters", async (req: Request, res: Response) => {
  try {
    const { name, description, characterImportance, status, causeOfDeath, iconHTML } = req.body;
    const { rows } = await db.query(
      `INSERT INTO characters (name, description, characterImportance, status, causeOfDeath, iconHTML)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, characterImportance, status, causeOfDeath, iconHTML]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating character:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update character
app.put("/api/characters/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, characterImportance, status, causeOfDeath, iconHTML } = req.body;
    const { rows } = await db.query(
      `UPDATE characters
       SET name = $1, description = $2, characterImportance = $3, status = $4,
           causeOfDeath = $5, iconHTML = $6
       WHERE id = $7
       RETURNING *`,
      [name, description, characterImportance, status, causeOfDeath, iconHTML, id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Character not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating character:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete character
app.delete("/api/characters/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM characters WHERE id = $1", [id]);
    res.json({ message: "Character deleted" });
  } catch (err) {
    console.error("Error deleting character:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ============================================================================
// CAMPAIGN ROUTES
// ============================================================================
app.get("/api/campaign", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM campaign ORDER BY id LIMIT 1");
    if (rows.length === 0) return res.status(404).json({ error: "No campaign found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching campaign:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/campaign/factions", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM campaign_factions ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching factions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/campaign/planets", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM campaign_planets ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching planets:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/campaign/groups", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM campaign_groups ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// (Optional) Admin routes for adding or updating data
app.post("/api/campaign", async (req: Request, res: Response) => {
  try {
    const { title, description, setting, current_state, call_for_aid } = req.body;
    const { rows } = await db.query(
      `INSERT INTO campaign (title, description, setting, current_state, call_for_aid)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, setting, current_state, call_for_aid]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating campaign:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/regroupActions", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query(`
      SELECT ra.*, 
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', rao.id,
                   'title', rao.title,
                   'effect', rao.effect,
                   'example_usage', rao.example_usage
                 )
               ) FILTER (WHERE rao.id IS NOT NULL), '[]'
             ) AS options
      FROM regroup_actions ra
      LEFT JOIN regroup_action_options rao ON ra.id = rao.regroup_action_id
      GROUP BY ra.id
      ORDER BY ra.id ASC;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/regroupActions", async (req: Request, res: Response) => {
  try {
    const { name, description, notes } = req.body;
    const { rows } = await db.query(
      `INSERT INTO regroup_actions (name, description, notes)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/regroupActions/:id/options", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, effect, example_usage } = req.body;
    const { rows } = await db.query(
      `INSERT INTO regroup_action_options (regroup_action_id, title, effect, example_usage)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, title, effect, example_usage]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ============================================================================
// ASCENSION PACKAGES ROUTES
// ============================================================================
app.get("/api/ascensionPackages", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query(`
      SELECT a.*,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', ae.id,
                   'effect_type', ae.effect_type,
                   'effect_description', ae.effect_description
                 )
               ) FILTER (WHERE ae.id IS NOT NULL), '[]'
             ) AS effects,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', ak.id,
                   'keyword', ak.keyword
                 )
               ) FILTER (WHERE ak.id IS NOT NULL), '[]'
             ) AS keywords,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', ax.id,
                   'character_name', ax.character_name,
                   'example_text', ax.example_text
                 )
               ) FILTER (WHERE ax.id IS NOT NULL), '[]'
             ) AS examples
      FROM ascension_packages a
      LEFT JOIN ascension_effects ae ON a.id = ae.ascension_id
      LEFT JOIN ascension_keywords ak ON a.id = ak.ascension_id
      LEFT JOIN ascension_examples ax ON a.id = ax.ascension_id
      GROUP BY a.id
      ORDER BY a.id ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching ascension packages:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/ascensionPackages/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT a.*,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', ae.id,
                   'effect_type', ae.effect_type,
                   'effect_description', ae.effect_description
                 )
               ) FILTER (WHERE ae.id IS NOT NULL), '[]'
             ) AS effects,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', ak.id,
                   'keyword', ak.keyword
                 )
               ) FILTER (WHERE ak.id IS NOT NULL), '[]'
             ) AS keywords,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', ax.id,
                   'character_name', ax.character_name,
                   'example_text', ax.example_text
                 )
               ) FILTER (WHERE ax.id IS NOT NULL), '[]'
             ) AS examples
      FROM ascension_packages a
      LEFT JOIN ascension_effects ae ON a.id = ae.ascension_id
      LEFT JOIN ascension_keywords ak ON a.id = ak.ascension_id
      LEFT JOIN ascension_examples ax ON a.id = ax.ascension_id
      WHERE a.id = $1
      GROUP BY a.id;
    `, [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Ascension Package not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching ascension package:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/ascensionPackages", async (req: Request, res: Response) => {
  try {
    const {
      name,
      tagline,
      description,
      xp_cost,
      keyword,
      influence_bonus,
      requirements,
      story_element,
      example_usage,
      source_page,
      source_file,
    } = req.body;

    const { rows } = await db.query(
      `INSERT INTO ascension_packages 
       (name, tagline, description, xp_cost, keyword, influence_bonus, requirements, story_element, example_usage, source_page, source_file)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        name,
        tagline,
        description,
        xp_cost,
        keyword,
        influence_bonus,
        requirements,
        story_element,
        example_usage,
        source_page,
        source_file || "AscensionCompendiumv1",
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating ascension package:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/ascensionPackages/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      tagline,
      description,
      xp_cost,
      keyword,
      influence_bonus,
      requirements,
      story_element,
      example_usage,
      source_page,
      source_file,
    } = req.body;

    const { rows } = await db.query(
      `UPDATE ascension_packages
       SET name=$1, tagline=$2, description=$3, xp_cost=$4, keyword=$5,
           influence_bonus=$6, requirements=$7, story_element=$8, 
           example_usage=$9, source_page=$10, source_file=$11
       WHERE id=$12
       RETURNING *`,
      [
        name,
        tagline,
        description,
        xp_cost,
        keyword,
        influence_bonus,
        requirements,
        story_element,
        example_usage,
        source_page,
        source_file,
        id,
      ]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Ascension Package not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating ascension package:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/ascensionPackages/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM ascension_packages WHERE id = $1", [id]);
    res.json({ message: "Ascension Package deleted" });
  } catch (err) {
    console.error("Error deleting ascension package:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ------------------------------------------------------------------
// Optional Nested Routes for Related Tables
// ------------------------------------------------------------------
app.post("/api/ascensionPackages/:id/effects", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { effect_type, effect_description } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ascension_effects (ascension_id, effect_type, effect_description)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [id, effect_type, effect_description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error adding ascension effect:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/ascensionPackages/:id/keywords", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { keyword } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ascension_keywords (ascension_id, keyword)
       VALUES ($1,$2)
       RETURNING *`,
      [id, keyword]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error adding ascension keyword:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/ascensionPackages/:id/examples", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { character_name, example_text } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ascension_examples (ascension_id, character_name, example_text)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [id, character_name, example_text]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error adding ascension example:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ============================================================================
// SUPPORT TABLE ROUTES (characterImportance, characterStatus)
// ============================================================================

// Get importance list
app.get("/api/characterImportance", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM characterImportance ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching importance levels:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get status list
app.get("/api/characterStatus", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM characterStatus ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching statuses:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ----------------------------------------
// 🚀 Server Start
// ----------------------------------------
const PORT = process.env.PORT || 6500;
httpServer.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
