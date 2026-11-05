import { dbConnection } from "../config/connectDB.js";

const SELECT_FULL = `
  SELECT
    t.id, t.product_id, t.user_id, t.type, t.quantity, t.delta,
    t.before_stock, t.after_stock, t.description, t.created_at,
    p.name  AS product_name,
    p.sku   AS product_sku,
    p.rack  AS product_rack,
    (u.first_name || ' ' || u.last_name) AS created_by
  FROM transactions t
  LEFT JOIN products p ON p.id = t.product_id
  LEFT JOIN users    u ON u.id = t.user_id
`;

const SELECT_FULL_BY_ID = `
  SELECT
    t.id, t.product_id, t.user_id, t.type, t.quantity, t.delta,
    t.before_stock, t.after_stock, t.description, t.created_at,
    p.name  AS product_name,
    p.sku   AS product_sku,
    p.rack  AS product_rack,
    (u.first_name || ' ' || u.last_name) AS created_by
  FROM transactions t
  LEFT JOIN products p ON p.id = t.product_id
  LEFT JOIN users    u ON u.id = t.user_id
  WHERE t.id = $1
`;

export const createTransaction = async ({
  product_id,
  user_id = null,
  type,
  quantity,
  description = null,
}) => {
  const client = await dbConnection.connect();
  try {
    await client.query("BEGIN");

    const { rows: prodRows } = await client.query(
      "SELECT id, stock FROM products WHERE id = $1 FOR UPDATE",
      [product_id]
    );
    if (!prodRows[0]) throw new Error("Produsul nu a fost găsit!");

    const before = prodRows[0].stock;
    const typeUp = String(type).toUpperCase();
    const qty = Number(quantity);
    const delta = typeUp === "IN" ? qty : -qty;
    const after = before + delta;
    if (after < 0) throw new Error("Stock-ul este insuficient!");

    await client.query("UPDATE products SET stock = $1 WHERE id = $2", [
      after,
      product_id,
    ]);

    const { rows: ins } = await client.query(
      `INSERT INTO transactions
       (product_id, user_id, type, quantity, delta, before_stock, after_stock, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [product_id, user_id, typeUp, qty, delta, before, after, description]
    );
    const newId = ins[0].id;

    const { rows: full } = await client.query(SELECT_FULL_BY_ID, [newId]);

    await client.query("END");
    return full[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getAllTransactions = async () => {
  const { rows } = await dbConnection.query(
    `${SELECT_FULL} ORDER BY t.created_at DESC`
  );
  return rows;
};

export const getAllProductTransactions = async (product_id) => {
  const { rows } = await dbConnection.query(
    `SELECT
       t.id, t.product_id, t.user_id, t.type, t.quantity, t.delta,
       t.before_stock, t.after_stock, t.description, t.created_at,
       p.name  AS product_name,
       p.sku   AS product_sku,
       p.rack  AS product_rack,
       (u.first_name || ' ' || u.last_name) AS created_by
     FROM transactions t
     LEFT JOIN products p ON p.id = t.product_id
     LEFT JOIN users u    ON u.id = t.user_id
     WHERE t.product_id = $1
     ORDER BY t.created_at DESC`,
    [product_id]
  );
  return rows;
};

export const getAllTransactionsID = async (id) => {
  const { rows } = await dbConnection.query(
    `SELECT
       t.id, t.product_id, t.user_id, t.type, t.quantity, t.delta,
       t.before_stock, t.after_stock, t.description, t.created_at,
       p.name  AS product_name,
       p.sku   AS product_sku,
       p.rack  AS product_rack,
       (u.first_name || ' ' || u.last_name) AS created_by
     FROM transactions t
     LEFT JOIN products p ON p.id = t.product_id
     LEFT JOIN users u    ON u.id = t.user_id
     WHERE t.id = $1`,
    [id]
  );
  return rows[0];
};

export const getUserTransactions = async (user_id) => {
  const { rows } = await dbConnection.query(
    `${SELECT_FULL} WHERE t.user_id = $1 ORDER BY t.created_at DESC`,
    [user_id]
  );
  return rows;
};

export const updateTransactionDescription = async (id, description) => {
  const { rows: upd } = await dbConnection.query(
    `UPDATE transactions
       SET description = $1
       WHERE id = $2
       RETURNING id`,
    [description, id]
  );
  if (!upd[0]) return null;
  const { rows: full } = await dbConnection.query(SELECT_FULL_BY_ID, [id]);
  return full[0];
};

export const updateTransactionFULL = async (
  id,
  { product_id, type, quantity, description }
) => {
  const client = await dbConnection.connect();
  try {
    await client.query("BEGIN");

    const { rows: trsRows } = await client.query(
      `SELECT id, product_id AS old_product_id, type AS old_type,
              quantity AS old_quantity, delta AS old_delta
       FROM transactions
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );
    if (!trsRows[0]) throw new Error("Tranzacția nu a fost găsită!");

    const { old_product_id, old_delta } = trsRows[0];

    const newType = String(type).toUpperCase();
    const qty = Number(quantity);
    if (!["IN", "OUT"].includes(newType))
      throw new Error("Tip de tranzacție invalid!");
    if (!Number.isInteger(qty) || qty <= 0)
      throw new Error("Cantitate invalidă!");

    const newDelta = newType === "IN" ? qty : -qty;
    const targetProduct = product_id ?? old_product_id;

    const { rows: oldProdRows } = await client.query(
      "SELECT id, stock FROM products WHERE id = $1 FOR UPDATE",
      [old_product_id]
    );
    if (!oldProdRows[0]) throw new Error("Produsul nu a fost găsit!");
    const revertedStock = oldProdRows[0].stock - Number(old_delta);
    if (revertedStock < 0)
      throw new Error("Stocul nu este suficient pentru a putea fi modificat!");
    await client.query("UPDATE products SET stock = $1 WHERE id = $2", [
      revertedStock,
      old_product_id,
    ]);

    let beforeStockValue, afterStockValue;
    if (targetProduct === old_product_id) {
      beforeStockValue = revertedStock;
      afterStockValue = beforeStockValue + newDelta;
      if (afterStockValue < 0) throw new Error("Stocul nu este suficient!");
      await client.query("UPDATE products SET stock = $1 WHERE id = $2", [
        afterStockValue,
        targetProduct,
      ]);
    } else {
      const { rows: newProdRows } = await client.query(
        "SELECT id, stock FROM products WHERE id = $1 FOR UPDATE",
        [targetProduct]
      );
      if (!newProdRows[0])
        throw new Error("Produsul selectat nu a fost găsit!");
      beforeStockValue = newProdRows[0].stock;
      afterStockValue = beforeStockValue + newDelta;
      if (afterStockValue < 0) throw new Error("Stock-ul este insuficient!");
      await client.query("UPDATE products SET stock = $1 WHERE id = $2", [
        afterStockValue,
        targetProduct,
      ]);
    }

    await client.query(
      `UPDATE transactions
         SET product_id = $1,
             type       = $2,
             quantity   = $3,
             delta      = $4,
             before_stock = $5,
             after_stock  = $6,
             description  = COALESCE($7, description)
       WHERE id = $8`,
      [
        targetProduct,
        newType,
        qty,
        newDelta,
        beforeStockValue,
        afterStockValue,
        description ?? null,
        id,
      ]
    );

    const { rows: full } = await client.query(SELECT_FULL_BY_ID, [id]);

    await client.query("END");
    return full[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const deleteTransaction = async (id) => {
  const client = await dbConnection.connect();
  try {
    await client.query("BEGIN");

    const { rows: trsRows } = await client.query(
      "SELECT id, product_id, delta FROM transactions WHERE id = $1 FOR UPDATE",
      [id]
    );
    if (!trsRows[0]) throw new Error("Tranzacția nu a fost găsită!");

    const { product_id, delta } = trsRows[0];

    const { rows: prodRows } = await client.query(
      "SELECT id, stock FROM products WHERE id = $1 FOR UPDATE",
      [product_id]
    );
    if (!prodRows[0]) throw new Error("Produsul nu a fost găsit!");

    const currentStock = prodRows[0].stock;
    const newStock = currentStock - Number(delta);
    if (newStock < 0)
      throw new Error("Nu este stock suficient pentru a termina operația!");

    await client.query("UPDATE products SET stock = $1 WHERE id = $2", [
      newStock,
      product_id,
    ]);

    const { rows: del } = await client.query(
      "DELETE FROM transactions WHERE id = $1 RETURNING id, product_id",
      [id]
    );

    await client.query("END");
    return del[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
