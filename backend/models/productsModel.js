import { dbConnection } from "../config/connectDB.js";

export const createProduct = async ({
  name,
  sku,
  unit = "buc",
  stock = 0,
  stock_min = 0,
  user_id = null,
  rack = null,
  description = null,
  price = 0,
  image_url = null,
}) => {
  const sql = `
    INSERT INTO products (name, sku, unit, stock, stock_min, user_id, rack, description, price, image_url)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING id, name, sku, unit, stock, stock_min, user_id, rack, description, price, image_url,created_at, updated_at,
    (SELECT u.first_name || ' ' || u.last_name FROM users u WHERE u.id = products.user_id) AS created_by
  `;
  const values = [
    name,
    sku,
    unit,
    stock,
    stock_min,
    user_id,
    rack,
    description,
    price,
    image_url,
  ];
  const { rows } = await dbConnection.query(sql, values);
  return rows[0];
};

export const getIdProduct = async (id) => {
  const query = `SELECT * FROM products WHERE id=$1`;
  const { rows } = await dbConnection.query(query, [id]);
  return rows[0];
};

export const getAllProducts = async () => {
  const sql = `
    SELECT
      p.id, p.name, p.sku, p.unit, p.stock, p.stock_min, p.user_id, p.rack,
      p.price, p.image_url, p.description, p.updated_at,
      (u.first_name || ' ' || u.last_name) AS created_by
    FROM products p
    LEFT JOIN users u ON u.id = p.user_id
    ORDER BY p.id DESC;
  `;
  const { rows } = await dbConnection.query(sql);
  return rows;
};

export const updateProduct = async (id, data) => {
  const {
    name = null,
    sku = null,
    unit = null,
    stock = null,
    stock_min = null,
    user_id = null,
    rack = null,
    description = null,
    price = null,
    image_url = null,
  } = data;

  const sql = `
    UPDATE products
    SET
      name        = COALESCE($1, name),
      sku         = COALESCE($2, sku),
      unit        = COALESCE($3, unit),
      stock       = COALESCE($4, stock),
      stock_min   = COALESCE($5, stock_min),
      user_id     = COALESCE($6, user_id),
      rack        = COALESCE($7, rack),
      description = COALESCE($8, description),
      price       = COALESCE($9, price),
      image_url   = COALESCE($10, image_url),
      updated_at  = NOW()
    WHERE id = $11
    RETURNING
      id, name, sku, unit, stock, stock_min, user_id, rack, description, price, image_url,
      created_at, updated_at,
      (SELECT u.first_name || ' ' || u.last_name FROM users u WHERE u.id = products.user_id) AS created_by
  `;
  const values = [
    name,
    sku,
    unit,
    stock,
    stock_min,
    user_id,
    rack,
    description,
    price,
    image_url,
    id,
  ];
  const { rows } = await dbConnection.query(sql, values);
  return rows[0];
};

export const deleteProduct = async (id) => {
  const query = `DELETE FROM products WHERE id=$1 RETURNING id,name,sku`;
  const { rows } = await dbConnection.query(query, [id]);
  return rows[0];
};
