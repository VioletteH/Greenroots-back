BEGIN;

CREATE TABLE "user" (
    user_id GENERATED ALWAYS AS IDENTITY,
    firstname TEXT,
    lastname TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    zipcode TEXT,
    city TEXT,
    role TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE "tree" (
    tree_id GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    co2 DECIMAL(10, 2) NOT NULL,
    o2 DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE "forest" (
    forest_id GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    association TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    country TEXT NOT NULL,
    location_x DECIMAL(10, 6) NOT NULL,
    location_y DECIMAL(10, 6) NOT NULL
);

CREATE TABLE "order" (
    order_id GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL REFERENCES "user"(user_id),
    total_price DECIMAL(10, 2) NOT NULL,
    status INT NOT NULL
);

CREATE TABLE "order_item" (
    order_tree_id GENERATED ALWAYS AS IDENTITY,
    order_id INT NOT NULL REFERENCES "order"(order_id),
    tree_id INT NOT NULL REFERENCES "tree"(tree_id),
    name TEXT NOT NULL REFERENCES "tree"(name),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL REFERENCES "tree"(price),
);

CREATE TABLE "forest_tree" (
    forest_tree_id GENERATED ALWAYS AS IDENTITY,
    forest_id INT NOT NULL REFERENCES "forest"(forest_id),
    tree_id INT NOT NULL REFERENCES "tree"(tree_id),
    stock INT NOT NULL
);

COMMIT;