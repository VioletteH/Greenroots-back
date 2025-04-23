-- SQLBook: Code
BEGIN;

CREATE OR REPLACE FUNCTION remove_accents(text)
RETURNS text AS $$
BEGIN
    RETURN translate($1, 'áàäâãéèëêíìïîóòöôõúùüûçñÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÇÑ',
                          'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

DROP TABLE IF EXISTS "order_item";
DROP TABLE IF EXISTS "forest_tree";
DROP TABLE IF EXISTS "order";
DROP TABLE IF EXISTS "forest";
DROP TABLE IF EXISTS "tree";
DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname TEXT,
    lastname TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    zipcode TEXT,
    city TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tree" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    category_slug TEXT GENERATED ALWAYS AS (
        regexp_replace(lower(remove_accents(category)), '\s+', '-', 'g')
    ) STORED,
    description TEXT NOT NULL,
    co2 DECIMAL(10, 2) NOT NULL,
    o2 DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "forest" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    association TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    country TEXT NOT NULL,
    country_slug TEXT GENERATED ALWAYS AS (
        regexp_replace(lower(remove_accents(country)), '\s+', '-', 'g')
    ) STORED,
    location_x DECIMAL(10, 6) NOT NULL,
    location_y DECIMAL(10, 6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "order" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "user"(id),
    total_price DECIMAL(10, 2) NOT NULL,
    status INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "order_item" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INT NOT NULL REFERENCES "order"(id),
    tree_id INT NOT NULL REFERENCES "tree"(id),
    name TEXT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "forest_tree" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    forest_id INT NOT NULL REFERENCES "forest"(id),
    tree_id INT NOT NULL REFERENCES "tree"(id),
    stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_forest_tree UNIQUE (forest_id, tree_id)
);

ALTER TABLE "user" ALTER COLUMN id RESTART WITH 1;
ALTER TABLE "tree" ALTER COLUMN id RESTART WITH 1;
ALTER TABLE "forest" ALTER COLUMN id RESTART WITH 1;
ALTER TABLE "order" ALTER COLUMN id RESTART WITH 1;
ALTER TABLE "forest_tree" ALTER COLUMN id RESTART WITH 1;
ALTER TABLE "order_item" ALTER COLUMN id RESTART WITH 1;

COMMIT;
