import { dbConnection } from "../config/connectDB.js";

export const createUser = async (
  first_name,
  last_name,
  email,
  password,
  role = "OPERATOR"
) => {
  const query = `
    INSERT INTO users (first_name, last_name, email, password, role)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id, first_name, last_name, email, role;
    `;
  const values = [first_name, last_name, email, password, role];
  const { rows } = await dbConnection.query(query, values);
  return rows[0];
};

export const getUserEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email =$1`;
  const { rows } = await dbConnection.query(query, [email]);
  return rows[0];
};

export const getUserId = async (id) => {
  const { rows } = await dbConnection.query(
    `SELECT id, first_name, last_name, email, role FROM users WHERE id=$1`,
    [id]
  );
  return rows[0];
};

export const getAllUsers = async () => {
  const query = `
    SELECT id, first_name, last_name, email, role
    FROM users
    ORDER BY created_at DESC
  `;
  const { rows } = await dbConnection.query(query);
  return rows;
};

export const updateUser = async (id, first_name, last_name, email, role) => {
  const query = `
    UPDATE USERS
    SET first_name = COALESCE($1, first_name),
    last_name = COALESCE($2, last_name),
    email = COALESCE($3, email),
    role = COALESCE($4, role)
    WHERE id = $5
    RETURNING id, first_name, last_name, email, role;
    `;

  const values = [first_name, last_name, email, role, id];
  const { rows } = await dbConnection.query(query, values);
  return rows[0];
};

export const deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING id, email`;
  const { rows } = await dbConnection.query(query, [id]);
  return rows[0];
};
