import {
  createTransaction,
  getAllTransactions,
  getAllTransactionsID,
  getAllProductTransactions,
  getUserTransactions,
  updateTransactionDescription,
  updateTransactionFULL,
  deleteTransaction,
} from "../models/transactionsModel.js";

function mapTxError(err, res, fallback = "Eroare de server!") {
  const m = err?.message || "";

  if (m === "Produsul nu a fost găsit!" || m === "Produsul nu a fost gasit!") {
    return res.status(404).json({ message: "Produsul nu există!" });
  }
  if (
    m === "Tranzacția nu a fost găsită!" ||
    m === "Tranzactia nu a fost gasita!"
  ) {
    return res.status(404).json({ message: "Această tranzacție nu există!" });
  }
  if (
    m === "Produsul selectat nu a fost găsit!" ||
    m === "Produsul selectat nu a fost gasit!"
  ) {
    return res.status(404).json({ message: "Produsul selectat nu există!" });
  }

  if (
    m === "Tip de tranzacție invalid!" ||
    m === "Tip de tranzactie invalid!"
  ) {
    return res
      .status(400)
      .json({ message: "Tip invalid. Folosește IN sau OUT." });
  }
  if (m === "Cantitate invalidă!" || m === "Cantitate invalida!") {
    return res
      .status(400)
      .json({ message: "Cantitatea trebuie să fie un număr întreg > 0!" });
  }
  if (m === "Stock-ul este insuficient!" || m === "Stocul nu este suficient!") {
    return res
      .status(400)
      .json({ message: "Stoc insuficient pentru această operațiune!" });
  }
  if (
    m === "Nu este stock suficient pentru a termina operația!" ||
    m === "Nu este stock suficient pentru a termina operatia!"
  ) {
    return res.status(400).json({
      message: "Nu poți șterge tranzacția: stocul ar deveni insuficient.",
    });
  }

  if (m === "Stocul nu este suficient pentru a putea fi modificat!") {
    return res.status(409).json({
      message:
        "Nu se poate edita: stoc insuficient pentru a inversa tranzacția veche!",
    });
  }

  console.error("Eroare ne-mapata tranzacții:", err);
  return res.status(500).json({ message: fallback });
}

export const createTransactionController = async (req, res) => {
  try {
    const { product_id, type, quantity, description } = req.body;

    if (!product_id || !type || quantity == null) {
      return res.status(400).json({
        message: "Id-ul produsului, tipul și cantitatea sunt obigatorii!",
      });
    }

    const typeee = String(type).toUpperCase();
    const qty = Number(quantity);

    if (!["IN", "OUT"].includes(typeee)) {
      return res
        .status(400)
        .json({ message: "Tipul tranzacției trebuie să fie 'IN' sau 'OUT'!" });
    }
    if (!Number.isInteger(qty) || qty <= 0) {
      return res
        .status(400)
        .json({ message: "Cantitatea trebuie să fie un număr întreg > 0!" });
    }

    const user_id = req.session?.user?.id ?? null;

    const trs = await createTransaction({
      product_id: Number(product_id),
      user_id,
      type: typeee,
      quantity: qty,
      description: description || null,
    });

    return res.status(201).json(trs);
  } catch (err) {
    return mapTxError(err, res, "Eroare server!");
  }
};

export const getAllTransactionsController = async (req, res) => {
  try {
    const me = req.session?.user;
    const items =
      me?.role === "ADMINISTRATOR"
        ? await getAllTransactions()
        : await getUserTransactions(me?.id);
    return res.json(items);
  } catch (err) {
    console.error("Eroare: afișare tranzacții!", err);
    return res.status(500).json({ message: "Eroare de server!" });
  }
};

export const getAllTransactionsIDController = async (req, res) => {
  try {
    const me = req.session?.user;
    const trs = await getAllTransactionsID(Number(req.params.id));
    if (!trs) {
      return res.status(404).json({ message: "Această tranzacție nu există!" });
    }
    if (me?.role !== "ADMINISTRATOR" && trs.user_id !== me?.id) {
      return res
        .status(403)
        .json({ message: "Nu ai acces la această tranzacție." });
    }
    return res.json(trs);
  } catch (err) {
    console.error("Eroare: tranzacție/ID!", err);
    return res.status(500).json({ message: "Eroare la server!" });
  }
};

export const getAllTransactionsProductController = async (req, res) => {
  try {
    const items = await getAllProductTransactions(
      Number(req.params.product_id)
    );
    return res.json(items);
  } catch (err) {
    console.error("Eroare: tranzacție/Produse!", err);
    return res.status(500).json({ message: "Eroare la server!" });
  }
};

export const updateTransactionDescriptionController = async (req, res) => {
  try {
    const { description } = req.body;
    if (description == undefined) {
      return res.status(400).json({
        message: "Descrierea este obligatorie pentru editarea tranzacției!",
      });
    }

    const updated = await updateTransactionDescription(
      Number(req.params.id),
      String(description)
    );
    if (!updated) {
      return res.status(404).json({ message: "Tranzacția nu există!" });
    }
    return res.json(updated);
  } catch (err) {
    return mapTxError(err, res, "Eroare server!");
  }
};

export const updateTransactionFullController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { product_id, type, quantity, description } = req.body;

    if (!type || quantity == null) {
      return res
        .status(400)
        .json({ message: "Tipul și cantitatea tranzacției sunt obligatorii!" });
    }

    const data = {
      product_id: product_id !== undefined ? Number(product_id) : undefined,
      type: String(type).toUpperCase(),
      quantity: Number(quantity),
      description: description ?? null,
    };

    const update = await updateTransactionFULL(id, data);
    return res.json(update);
  } catch (err) {
    return mapTxError(err, res, "Eroare la server!");
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    const deletee = await deleteTransaction(Number(req.params.id));
    if (!deletee) {
      return res.status(404).json({ message: "Tranzacția nu există!" });
    }
    return res.json({
      message: "Tranzacția a fost ștearsă, iar stocul a fost ajustat!",
      transaction: deletee,
    });
  } catch (err) {
    return mapTxError(err, res, "Eroare de server!");
  }
};
