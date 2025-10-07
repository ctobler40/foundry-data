CREATE TABLE characterimportance (
    id SERIAL PRIMARY KEY,
    importance TEXT NOT NULL
);

CREATE TABLE characterstatus (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL
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

CREATE TABLE ascension_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tagline VARCHAR(150),
    description TEXT,
    xp_cost TEXT,
    keyword TEXT,
    influence_bonus TEXT,
    requirements TEXT,
    story_element TEXT,
    example_usage TEXT,
    source_page INT,
    source_file VARCHAR(150) DEFAULT 'AscensionCompendiumv1'
);

CREATE TABLE ascension_keywords (
    id SERIAL PRIMARY KEY,
    ascension_id INT REFERENCES ascension_packages(id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL
);

CREATE TABLE ascension_effects (
    id SERIAL PRIMARY KEY,
    ascension_id INT REFERENCES ascension_packages(id) ON DELETE CASCADE,
    effect_type VARCHAR(100),
    effect_description TEXT
);

CREATE TABLE ascension_examples (
    id SERIAL PRIMARY KEY,
    ascension_id INT REFERENCES ascension_packages(id) ON DELETE CASCADE,
    character_name VARCHAR(100),
    example_text TEXT
);

CREATE TABLE combat_actions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    action_type VARCHAR(50),
    action_category VARCHAR(50),
    description TEXT,
    dice_bonus VARCHAR(20),
    requirements TEXT,
    duration VARCHAR(50),
    effects TEXT,
    test_required TEXT,
    source_page VARCHAR(50)
);

CREATE TABLE attack_modifiers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    modifier_type VARCHAR(50),
    description TEXT,
    effect TEXT,
    condition TEXT,
    applies_to TEXT,
    source_page VARCHAR(50)
);

CREATE TABLE combat_options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    option_type VARCHAR(50),
    attack_type VARCHAR(50),
    description TEXT,
    dn_modifier VARCHAR(20),
    effect TEXT,
    source_page VARCHAR(50)
);

CREATE TABLE conditions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    mechanical_effect TEXT,
    duration VARCHAR(50),
    removal_method TEXT,
    source_page VARCHAR(50)
);

CREATE TABLE combat_references (
    id SERIAL PRIMARY KEY,
    section VARCHAR(100),
    topic VARCHAR(100),
    summary TEXT,
    reference_page VARCHAR(50)
);

CREATE TABLE critical_hits (
    id SERIAL PRIMARY KEY,
    roll_range VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    effect TEXT,
    glory_effect TEXT
);

CREATE TABLE environmental_hazards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    effect TEXT,
    test_required TEXT,
    dn_example VARCHAR(50),
    damage TEXT,
    duration VARCHAR(50)
);

CREATE TABLE combat_complications (
    id SERIAL PRIMARY KEY,
    roll_range VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    test_required TEXT,
    dn_example VARCHAR(20)
);
