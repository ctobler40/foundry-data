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
// COMBAT ACTIONS ROUTES
// ============================================================================

// Get all combat actions
app.get("/api/combatActions", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM combat_actions ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching combat actions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single combat action by ID
app.get("/api/combatActions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("SELECT * FROM combat_actions WHERE id = $1", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Combat Action not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching combat action:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new combat action
app.post("/api/combatActions", async (req: Request, res: Response) => {
  try {
    const {
      name,
      action_type,
      action_category,
      description,
      dice_bonus,
      requirements,
      duration,
      effects,
      test_required,
      source_page
    } = req.body;

    const { rows } = await db.query(
      `INSERT INTO combat_actions 
        (name, action_type, action_category, description, dice_bonus, requirements, duration, effects, test_required, source_page)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [name, action_type, action_category, description, dice_bonus, requirements, duration, effects, test_required, source_page]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating combat action:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing combat action
app.put("/api/combatActions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      action_type,
      action_category,
      description,
      dice_bonus,
      requirements,
      duration,
      effects,
      test_required,
      source_page
    } = req.body;

    const { rows } = await db.query(
      `UPDATE combat_actions
       SET name=$1, action_type=$2, action_category=$3, description=$4, dice_bonus=$5,
           requirements=$6, duration=$7, effects=$8, test_required=$9, source_page=$10
       WHERE id=$11
       RETURNING *`,
      [name, action_type, action_category, description, dice_bonus, requirements, duration, effects, test_required, source_page, id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Combat Action not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating combat action:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a combat action
app.delete("/api/combatActions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM combat_actions WHERE id = $1", [id]);
    res.json({ message: "Combat Action deleted" });
  } catch (err) {
    console.error("Error deleting combat action:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ============================================================================
// COMBAT OPTIONS ROUTES
// ============================================================================

// Get all combat options
app.get("/api/combatOptions", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM combat_options ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching combat options:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single combat option by ID
app.get("/api/combatOptions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("SELECT * FROM combat_options WHERE id = $1", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Combat Option not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching combat option:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new combat option
app.post("/api/combatOptions", async (req: Request, res: Response) => {
  try {
    const { name, option_type, attack_type, description, dn_modifier, effect, source_page } =
      req.body;

    const { rows } = await db.query(
      `INSERT INTO combat_options 
       (name, option_type, attack_type, description, dn_modifier, effect, source_page)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [name, option_type, attack_type, description, dn_modifier, effect, source_page]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating combat option:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing combat option
app.put("/api/combatOptions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, option_type, attack_type, description, dn_modifier, effect, source_page } =
      req.body;

    const { rows } = await db.query(
      `UPDATE combat_options
       SET name=$1, option_type=$2, attack_type=$3, description=$4, dn_modifier=$5,
           effect=$6, source_page=$7
       WHERE id=$8
       RETURNING *`,
      [name, option_type, attack_type, description, dn_modifier, effect, source_page, id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Combat Option not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating combat option:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a combat option
app.delete("/api/combatOptions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM combat_options WHERE id = $1", [id]);
    res.json({ message: "Combat Option deleted" });
  } catch (err) {
    console.error("Error deleting combat option:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ============================================================================
// CONDITIONS ROUTES
// ============================================================================

// Get all conditions
app.get("/api/conditions", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM conditions ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching conditions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single condition by ID
app.get("/api/conditions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("SELECT * FROM conditions WHERE id = $1", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Condition not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching condition:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new condition
app.post("/api/conditions", async (req: Request, res: Response) => {
  try {
    const { name, description, mechanical_effect, duration, removal_method, source_page } =
      req.body;

    const { rows } = await db.query(
      `INSERT INTO conditions 
       (name, description, mechanical_effect, duration, removal_method, source_page)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [name, description, mechanical_effect, duration, removal_method, source_page]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating condition:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing condition
app.put("/api/conditions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, mechanical_effect, duration, removal_method, source_page } =
      req.body;

    const { rows } = await db.query(
      `UPDATE conditions
       SET name=$1, description=$2, mechanical_effect=$3, duration=$4,
           removal_method=$5, source_page=$6
       WHERE id=$7
       RETURNING *`,
      [name, description, mechanical_effect, duration, removal_method, source_page, id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Condition not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating condition:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a condition
app.delete("/api/conditions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM conditions WHERE id = $1", [id]);
    res.json({ message: "Condition deleted" });
  } catch (err) {
    console.error("Error deleting condition:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ============================================================================
// COMBAT REFERENCES ROUTES
// ============================================================================

// Get all combat references
app.get("/api/combatReferences", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM combat_references ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching combat references:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single combat reference by ID
app.get("/api/combatReferences/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("SELECT * FROM combat_references WHERE id = $1", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Combat Reference not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching combat reference:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new combat reference
app.post("/api/combatReferences", async (req: Request, res: Response) => {
  try {
    const { section, topic, summary, reference_page } = req.body;

    const { rows } = await db.query(
      `INSERT INTO combat_references 
       (section, topic, summary, reference_page)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [section, topic, summary, reference_page]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating combat reference:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing combat reference
app.put("/api/combatReferences/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { section, topic, summary, reference_page } = req.body;

    const { rows } = await db.query(
      `UPDATE combat_references
       SET section=$1, topic=$2, summary=$3, reference_page=$4
       WHERE id=$5
       RETURNING *`,
      [section, topic, summary, reference_page, id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Combat Reference not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating combat reference:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a combat reference
app.delete("/api/combatReferences/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM combat_references WHERE id = $1", [id]);
    res.json({ message: "Combat Reference deleted" });
  } catch (err) {
    console.error("Error deleting combat reference:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ============================================================================
// CRITICAL HITS ROUTES
// ============================================================================

// Get all critical hits
app.get("/api/criticalHits", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM critical_hits ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching critical hits:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single critical hit by ID
app.get("/api/criticalHits/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("SELECT * FROM critical_hits WHERE id = $1", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Critical Hit not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching critical hit:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new critical hit
app.post("/api/criticalHits", async (req: Request, res: Response) => {
  try {
    const { roll_range, name, description, effect, glory_effect } = req.body;

    const { rows } = await db.query(
      `INSERT INTO critical_hits 
       (roll_range, name, description, effect, glory_effect)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [roll_range, name, description, effect, glory_effect]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating critical hit:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing critical hit
app.put("/api/criticalHits/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roll_range, name, description, effect, glory_effect } = req.body;

    const { rows } = await db.query(
      `UPDATE critical_hits
       SET roll_range=$1, name=$2, description=$3, effect=$4, glory_effect=$5
       WHERE id=$6
       RETURNING *`,
      [roll_range, name, description, effect, glory_effect, id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Critical Hit not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating critical hit:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a critical hit
app.delete("/api/criticalHits/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM critical_hits WHERE id = $1", [id]);
    res.json({ message: "Critical Hit deleted" });
  } catch (err) {
    console.error("Error deleting critical hit:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ============================================================================
// COMBAT COMPLICATIONS ROUTES
// ============================================================================

// Get all combat complications
app.get("/api/combatComplications", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM combat_complications ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching combat complications:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single combat complication by ID
app.get("/api/combatComplications/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("SELECT * FROM combat_complications WHERE id = $1", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Combat Complication not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching combat complication:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new combat complication
app.post("/api/combatComplications", async (req: Request, res: Response) => {
  try {
    const { roll_range, name, description, test_required, dn_example } = req.body;

    const { rows } = await db.query(
      `INSERT INTO combat_complications 
       (roll_range, name, description, test_required, dn_example)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [roll_range, name, description, test_required, dn_example]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating combat complication:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing combat complication
app.put("/api/combatComplications/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roll_range, name, description, test_required, dn_example } = req.body;

    const { rows } = await db.query(
      `UPDATE combat_complications
       SET roll_range=$1, name=$2, description=$3, test_required=$4, dn_example=$5
       WHERE id=$6
       RETURNING *`,
      [roll_range, name, description, test_required, dn_example, id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Combat Complication not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating combat complication:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a combat complication
app.delete("/api/combatComplications/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM combat_complications WHERE id = $1", [id]);
    res.json({ message: "Combat Complication deleted" });
  } catch (err) {
    console.error("Error deleting combat complication:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ============================================================================
// ENVIRONMENTAL HAZARDS ROUTES
// ============================================================================

// Get all environmental hazards
app.get("/api/environmentalHazards", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM environmental_hazards ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching environmental hazards:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single environmental hazard by ID
app.get("/api/environmentalHazards/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("SELECT * FROM environmental_hazards WHERE id = $1", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Environmental Hazard not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching environmental hazard:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new environmental hazard
app.post("/api/environmentalHazards", async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      effect,
      test_required,
      dn_example,
      damage,
      duration,
    } = req.body;

    const { rows } = await db.query(
      `INSERT INTO environmental_hazards 
       (name, description, effect, test_required, dn_example, damage, duration)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [name, description, effect, test_required, dn_example, damage, duration]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating environmental hazard:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing environmental hazard
app.put("/api/environmentalHazards/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      effect,
      test_required,
      dn_example,
      damage,
      duration,
    } = req.body;

    const { rows } = await db.query(
      `UPDATE environmental_hazards
       SET name=$1, description=$2, effect=$3, test_required=$4, dn_example=$5,
           damage=$6, duration=$7
       WHERE id=$8
       RETURNING *`,
      [name, description, effect, test_required, dn_example, damage, duration, id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Environmental Hazard not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating environmental hazard:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete an environmental hazard
app.delete("/api/environmentalHazards/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM environmental_hazards WHERE id = $1", [id]);
    res.json({ message: "Environmental Hazard deleted" });
  } catch (err) {
    console.error("Error deleting environmental hazard:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ============================================================================
// ATTACK MODIFIERS ROUTES
// ============================================================================

// Get all attack modifiers
app.get("/api/attackModifiers", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM attack_modifiers ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching attack modifiers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single attack modifier by ID
app.get("/api/attackModifiers/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query("SELECT * FROM attack_modifiers WHERE id = $1", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Attack Modifier not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching attack modifier:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new attack modifier
app.post("/api/attackModifiers", async (req: Request, res: Response) => {
  try {
    const { name, modifier_type, description, effect, condition, applies_to, source_page } =
      req.body;

    const { rows } = await db.query(
      `INSERT INTO attack_modifiers 
       (name, modifier_type, description, effect, condition, applies_to, source_page)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [name, modifier_type, description, effect, condition, applies_to, source_page]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating attack modifier:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing attack modifier
app.put("/api/attackModifiers/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, modifier_type, description, effect, condition, applies_to, source_page } =
      req.body;

    const { rows } = await db.query(
      `UPDATE attack_modifiers
       SET name=$1, modifier_type=$2, description=$3, effect=$4, condition=$5,
           applies_to=$6, source_page=$7
       WHERE id=$8
       RETURNING *`,
      [name, modifier_type, description, effect, condition, applies_to, source_page, id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Attack Modifier not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating attack modifier:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete an attack modifier
app.delete("/api/attackModifiers/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM attack_modifiers WHERE id = $1", [id]);
    res.json({ message: "Attack Modifier deleted" });
  } catch (err) {
    console.error("Error deleting attack modifier:", err);
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

// ============================================================================
// MAIN CHARACTERS ROUTES (FAFO)
// ============================================================================

// Get all main characters (joined with base character info)
app.get("/api/mainCharacters", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        mc.*, 
        c.name AS base_name,
        c.description AS base_description,
        ci.importance AS importance_label,
        cs.status AS status_label
      FROM main_characters mc
      LEFT JOIN characters c ON mc.character_id = c.id
      LEFT JOIN characterimportance ci ON c.characterimportance = ci.id
      LEFT JOIN characterstatus cs ON c.status = cs.id
      ORDER BY mc.id ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching main characters:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get single main character by ID
app.get("/api/mainCharacters/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT 
        mc.*, 
        c.name AS base_name,
        c.description AS base_description,
        ci.importance AS importance_label,
        cs.status AS status_label
      FROM main_characters mc
      LEFT JOIN characters c ON mc.character_id = c.id
      LEFT JOIN characterimportance ci ON c.characterimportance = ci.id
      LEFT JOIN characterstatus cs ON c.status = cs.id
      WHERE mc.id = $1;
    `, [id]);

    if (rows.length === 0)
      return res.status(404).json({ error: "Main Character not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching main character:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create new main character
app.post("/api/mainCharacters", async (req: Request, res: Response) => {
  try {
    const {
      name,
      photo_url,
      personal_details,
      background,
      notable_quotes,
      notable_moments,
      character_id
    } = req.body;

    const { rows } = await db.query(
      `INSERT INTO main_characters 
       (name, photo_url, personal_details, background, notable_quotes, notable_moments, character_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, photo_url, personal_details, background, notable_quotes, notable_moments, character_id]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating main character:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update existing main character
app.put("/api/mainCharacters/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      photo_url,
      personal_details,
      background,
      notable_quotes,
      notable_moments,
      character_id
    } = req.body;

    const { rows } = await db.query(
      `UPDATE main_characters
       SET name = $1, 
           photo_url = $2, 
           personal_details = $3, 
           background = $4, 
           notable_quotes = $5, 
           notable_moments = $6, 
           character_id = $7
       WHERE id = $8
       RETURNING *`,
      [name, photo_url, personal_details, background, notable_quotes, notable_moments, character_id, id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Main Character not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating main character:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete main character
app.delete("/api/mainCharacters/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM main_characters WHERE id = $1", [id]);
    res.json({ message: "Main Character deleted" });
  } catch (err) {
    console.error("Error deleting main character:", err);
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
