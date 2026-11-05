import {
  createUser,
  getUserId,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserEmail,
} from "../models/userModel.js";
import bcrypt from "bcrypt";
import env from "dotenv";

env.config();
const saltRounds = Number(process.env.SALT_ROUNDS);

export const createUserController = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role = "OPERATOR",
    } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        message: "Câmpurile cu nume, email și parola sunt obligatorii!",
      });
    }

    const exista = await getUserEmail(email);
    if (exista) {
      return res
        .status(400)
        .json({ message: "Acest email se află deja în baza noastră de date!" });
    }

    const saltedPassword = await bcrypt.hash(password, saltRounds);
    const user = await createUser(
      first_name,
      last_name,
      email,
      saltedPassword,
      role
    );

    return res.status(201).json(user);
  } catch (err) {
    console.log("Crearea noului utilizator a eșuat!", err);
    if (err.code === "23505")
      return res.status(400).json({ message: "Email-ul a fost deja folosit!" });
    return res.status(500).json({ message: "Eroare de server!" });
  }
};

export const getUserIdController = async (req, res) => {
  try {
    const user = await getUserId(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ message: "Acest utilizator nu a fost găsit!" });
    return res.json(user);
  } catch (err) {
    console.error("Eroare la căutarea de user!", err);
    return res.status(500).json({ message: "Eroare server!" });
  }
};

export const getAllUsersController = async (_req, res) => {
  try {
    const users = await getAllUsers();
    return res.json(users);
  } catch (err) {
    console.error("Afișarea utilizatorilor a eșuat!", err);
    return res.status(500).json({ message: "Eroare server!" });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const { first_name, last_name, email } = req.body;
    const roleInput = req.body?.role;

    if (email) {
      const gasit = await getUserEmail(email);
      if (gasit && String(gasit.id) !== String(id)) {
        return res.status(400).json({
          message: "Acest email a fost deja folosit de un alt utilizator!",
        });
      }
    }

    let roleSet = null;
    if (roleInput !== undefined) {
      const ROLES_ALLW = ["ADMINISTRATOR", "OPERATOR"];
      const upper = String(roleInput).toUpperCase();
      if (!ROLES_ALLW.includes(upper)) {
        return res.status(400).json({
          message:
            "Rolul este invalid. Folosește 'ADMINISTRATOR' sau 'OPERATOR'.",
        });
      }
      roleSet = upper;
    }

    const updated = await updateUser(
      id,
      first_name ?? null,
      last_name ?? null,
      email ?? null,
      roleSet
    );
    if (!updated)
      return res
        .status(400)
        .json({ message: "Acest utilizator nu a fost găsit!" });
    return res.json(updated);
  } catch (err) {
    console.error("Eroare la update de profil al utilizatorului!", err);
    if (err.code === "23505")
      return res.status(400).json({ message: "Email-ul a fost deja folosit!" });
    return res.status(500).json({ message: "Eroare la server!" });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const deletee = await deleteUser(req.params.id);
    if (!deletee)
      return res
        .status(400)
        .json({ message: "Utilizatorul nu a fost găsit!" });
    return res.json({
      message: "Utilizatorul a fost șters cu succes!",
      user: deletee,
    });
  } catch (err) {
    console.error("Eroare la ștergerea utilizatorului!", err);
    return res.status(500).json({ message: "Eroare de server!" });
  }
};
