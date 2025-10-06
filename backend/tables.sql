CREATE TABLE characterimportance (
    id SERIAL PRIMARY KEY,
    importance TEXT NOT NULL
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    characterimportance INTEGER REFERENCES characterimportance(id) ON DELETE SET NULL,
    status INTEGER REFERENCES characterstatus(id) ON DELETE SET NULL,
    causeofdeath TEXT,
    iconhtml TEXT
);

CREATE TABLE talents (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    xp_cost INTEGER,
    requirements TEXT,
    effect TEXT,
    source_page TEXT,
    faction_keywords TEXT,
    rank_requirement TEXT,
    species_requirement TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE character_talents (
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    talent_id INTEGER REFERENCES talents(id) ON DELETE CASCADE,
    PRIMARY KEY (character_id, talent_id)
);

CREATE TABLE campaign (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    setting TEXT,
    current_state TEXT,
    call_for_aid TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE campaign_planets (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaign(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    details TEXT,
    population TEXT,
    exports TEXT,
    environment TEXT
);

CREATE TABLE campaign_factions (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaign(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    territory TEXT,
    exports TEXT,
    status TEXT
);

CREATE TABLE campaign_groups (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaign(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE regroup_actions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE regroup_action_options (
    id SERIAL PRIMARY KEY,
    regroup_action_id INTEGER REFERENCES regroup_actions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    effect TEXT,
    example_usage TEXT
);