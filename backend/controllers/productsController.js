import {
  createProduct,
  getIdProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../models/productsModel.js";

export const createProductController = async (req, res) => {
  try {
    const me = req.session?.user;
    if (!me)
      return res.status(401).json({ message: "Autentificare necesară." });
    if (me.role !== "ADMINISTRATOR") {
      return res
        .status(403)
        .json({ message: "Doar administratorul poate crea produse." });
    }

    const {
      name,
      sku,
      unit,
      stock,
      stock_min,
      rack,
      description,
      price,
      image_url,
    } = req.body;

    if (!name || !sku) {
      return res
        .status(400)
        .json({ message: "Numele și SKU sunt obligatorii." });
    }

    const prod = await createProduct({
      name,
      sku,
      unit,
      stock,
      stock_min,
      user_id: me.id,
      rack,
      description,
      price,
      image_url,
    });

    return res.status(201).json(prod);
  } catch (error) {
    console.error("Eroare la crearea de produse!", error);
    if (error?.code === "23505") {
      return res
        .status(400)
        .json({ message: "Acest SKU a fost deja folosit!" });
    }
    return res.status(500).json({ message: "Eroare server!" });
  }
};

export const getAllProductsController = async (_req, res) => {
  try {
    const items = await getAllProducts();
    return res.json(items);
  } catch (err) {
    console.error("Eroare la afișarea produselor: ", err);
    return res.status(500).json({ message: "Eroare de server!" });
  }
};

export const getIdProductController = async (req, res) => {
  try {
    const product = await getIdProduct(Number(req.params.id));
    if (!product)
      return res.status(404).json({ message: "Produsul nu există!" });
    return res.json(product);
  } catch (err) {
    console.error("Eroare la alegerea produsului dupa ID!", err);
    return res.status(500).json({ message: "Eroare de server!" });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const me = req.session?.user;
    if (!me)
      return res.status(401).json({ message: "Autentificare necesară." });

    const id = Number(req.params.id);
    const existing = await getIdProduct(id);
    if (!existing)
      return res.status(404).json({ message: "Produsul nu exista!" });

    const isAdmin = me.role === "ADMINISTRATOR";
    const isOwner = me.id === existing.user_id;
    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "Nu ai voie să editezi acest produs." });
    }

    const payload = { ...req.body };
    if (!isAdmin) delete payload.user_id;

    const updated = await updateProduct(id, payload);
    return res.json(updated);
  } catch (err) {
    console.error("Eroare la editarea produsului!", err);
    if (err?.code === "23505")
      return res
        .status(400)
        .json({ message: "Acest SKU a fost deja folosit!" });
    return res.status(500).json({ message: "Eroare server!" });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const me = req.session?.user;
    if (!me)
      return res.status(401).json({ message: "Autentificare necesară." });

    const id = Number(req.params.id);
    const existing = await getIdProduct(id);
    if (!existing)
      return res.status(404).json({ message: "Produsul nu există!" });

    const isAdmin = me.role === "ADMINISTRATOR";
    const isOwner = me.id === existing.user_id;
    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "Nu ai voie să ștergi acest produs." });
    }

    const del = await deleteProduct(id);
    if (!del) return res.status(404).json({ message: "Produsul nu există!" });

    return res.json({
      message: "Produsul a fost șters cu succes!",
      product: del,
    });
  } catch (err) {
    console.error("Eroare la ștergerea produsului!", err);
    return res.status(500).json({ message: "Eroare la server!" });
  }
};
