import { faker } from '@faker-js/faker';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER || 'greenroots',  
  host: process.env.DB_HOST || 'localhost',  
  database: process.env.DB_NAME || 'greenroots',  
  password: process.env.DB_PASSWORD || 'greenroots',  
  port: process.env.DB_PORT || 5432,
});

function createUser() {
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    zipcode: faker.location.zipCode(),
    city: faker.location.city(),
    role: faker.helpers.arrayElement(['user', 'admin']),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
}

function createTree() {
  return {
    name: faker.word.words(2),
    scientific_name: faker.word.words(3),
    image: faker.image.urlPicsumPhotos(),
    category: faker.helpers.arrayElement(['feuillu', 'conifère', 'fruitier']),
    description: faker.lorem.sentence(),
    co2: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
    o2: faker.number.float({ min: 5, max: 50, precision: 0.01 }),
    price: faker.number.float({ min: 5, max: 50, precision: 0.01 }),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
}

function createForest() {
  return {
    name: faker.word.words(2),
    association: faker.company.name(),
    image: faker.image.urlPicsumPhotos(),
    description: faker.lorem.sentences(2),
    country: faker.location.country(),
    location_x: faker.location.latitude(),
    location_y: faker.location.longitude(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
}

function createOrder(user_id) {
  return {
    user_id,
    total_price: faker.number.float({ min: 20, max: 200, precision: 0.01 }),
    status: faker.helpers.arrayElement([0, 1, 2]),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
}

function createOrderItem(order_id, tree) {
  const quantity = faker.number.int({ min: 1, max: 5 });
  return {
    order_id,
    tree_id: tree.id,
    name: tree.name,
    quantity,
    price: tree.price * quantity,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
}

function createForestTree(forest_id, tree_id) {
  return {
    forest_id,
    tree_id,
    stock: faker.number.int({ min: 10, max: 100 }),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
}

async function seed() {
  const client = await pool.connect();
  try {
    // Générer les entités de base
    const users = Array.from({ length: 10 }, createUser);
    const trees = Array.from({ length: 10 }, createTree);
    const forests = Array.from({ length: 10 }, createForest);

    const userIds = [];
    const treeIds = [];
    const forestIds = [];

    // USERS
    for (const user of users) {
      const res = await client.query(
        `INSERT INTO "user"
        (firstname, lastname, email, password, phone, address, zipcode, city, role, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING id`,
        [
          user.firstname, user.lastname, user.email, user.password, user.phone,
          user.address, user.zipcode, user.city, user.role, user.created_at, user.updated_at
        ]
      );
      userIds.push(res.rows[0].id);
    }

    // TREES
    for (const tree of trees) {
      const res = await client.query(
        `INSERT INTO "tree"
        (name, scientific_name, image, category, description, co2, o2, price, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING id`,
        [
          tree.name, tree.scientific_name, tree.image, tree.category,
          tree.description, tree.co2, tree.o2, tree.price, tree.created_at, tree.updated_at
        ]
      );
      treeIds.push({ id: res.rows[0].id, ...tree });
    }

    // FORESTS
    for (const forest of forests) {
      const res = await client.query(
        `INSERT INTO "forest"
        (name, association, image, description, country, location_x, location_y, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING id`,
        [
          forest.name, forest.association, forest.image, forest.description,
          forest.country, forest.location_x, forest.location_y, forest.created_at, forest.updated_at
        ]
      );
      forestIds.push(res.rows[0].id);
    }

    // ORDERS & ORDER_ITEMS
    for (const user_id of userIds) {
      const order = createOrder(user_id);
      const resOrder = await client.query(
        `INSERT INTO "order"
        (user_id, total_price, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`,
        [order.user_id, order.total_price, order.status, order.created_at, order.updated_at]
      );
      const order_id = resOrder.rows[0].id;

      // Ajouter 1 à 3 items par commande
      const itemCount = faker.number.int({ min: 1, max: 3 });
      const chosenTrees = faker.helpers.arrayElements(treeIds, itemCount);

      for (const tree of chosenTrees) {
        const item = createOrderItem(order_id, tree);
        await client.query(
          `INSERT INTO "order_item"
          (order_id, tree_id, name, quantity, price, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [item.order_id, item.tree_id, item.name, item.quantity, item.price, item.created_at, item.updated_at]
        );
      }
    }

    // FOREST_TREE
    for (const forest_id of forestIds) {
      const treesForForest = faker.helpers.arrayElements(treeIds, 2);
      for (const tree of treesForForest) {
        const ft = createForestTree(forest_id, tree.id);
        await client.query(
          `INSERT INTO "forest_tree"
          (forest_id, tree_id, stock, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5)`,
          [ft.forest_id, ft.tree_id, ft.stock, ft.created_at, ft.updated_at]
        );
      }
    }

    console.log('Données insérées avec relations (orders, items, forest_tree) !');
  } catch (err) {
    console.error('Erreur dans le seeding :', err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
