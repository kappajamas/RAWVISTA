import express from "express";
import {
  createProductController,
  getIdProductController,
  updateProductController,
  getAllProductsController,
  deleteProductController,
} from "../controllers/productsController.js";
import { isAuth, reqRole } from "../middleware/authMiddleware.js";

const prodRouter = express.Router();

prodRouter.post("/", isAuth, reqRole("ADMINISTRATOR"), createProductController);
prodRouter.put(
  "/:id",
  isAuth,
  reqRole("ADMINISTRATOR"),
  updateProductController
);
prodRouter.delete(
  "/:id",
  isAuth,
  reqRole("ADMINISTRATOR"),
  deleteProductController
);

prodRouter.get(
  "/:id",
  isAuth,
  reqRole("ADMINISTRATOR", "OPERATOR"),
  getIdProductController
);
prodRouter.get(
  "/",
  isAuth,
  reqRole("ADMINISTRATOR", "OPERATOR"),
  getAllProductsController
);

export default prodRouter;
