import { createUser, getUserEmail, getUserId } from "../models/userModel.js";
import bcrypt from "bcrypt";
import env from "dotenv";

env.config();
const saltRounds = Number(process.env.SALT_ROUNDS);

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Lipsesc câmpuri obligatorii!" });
    }

    const existingUser = await getUserEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Acest email a fost deja folosit!" });
    }

    const saltedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await createUser(
      first_name,
      last_name,
      email,
      saltedPassword,
      role,
    );

   return res.status(201).json({ message: "Înregistrare reușită!", user: newUser });
  } catch (err) {
    console.error("Eroare la înregistrare: ", err);
    return res.status(500).json({ message: "Eroare server!" });
  }
};

export const login = async (req, res) => {
  try {
    const {email,password} = req.body
    const user = await getUserEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email-ul sau parola sunt incorecte!" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res
        .status(400)
        .json({ message: "Email-ul sau parola sunt incorecte!" });
    }

    req.session.user = { id: user.id, role: user.role };
    return res.status(200).json({
      message: "Autentificarea a reușit!",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Eroare la autentificare: ", err);
   return res.status(500).json({ message: "Eroare server!" });
  }
};

export const me = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Întâi trebuie să te loghezi!" });
    }

    const user = await getUserId(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit!" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error la /me: ", err);
    return res.status(500).json({ message: "Eroare server!!!" });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(400).json({ message: "Nu s-a putut face logout!" });
    res.clearCookie("warehouse_session");
    return res.status(200).json({ message: "Ai fost delogat cu succes!" });
  });
};
