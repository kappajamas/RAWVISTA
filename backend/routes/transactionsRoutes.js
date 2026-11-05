import express from "express";
import {
  createTransactionController,
  getAllTransactionsController,
  getAllTransactionsIDController,
  getAllTransactionsProductController,
  updateTransactionDescriptionController,
  updateTransactionFullController,
  deleteTransactionController,
} from "../controllers/transactionsController.js";

import { isAuth, reqRole } from "../middleware/authMiddleware.js";

const trsRouter = express.Router();

trsRouter.post(
  "/",
  isAuth,
  reqRole("ADMINISTRATOR", "OPERATOR"),
  createTransactionController
);
trsRouter.get(
  "/",
  isAuth,
  reqRole("ADMINISTRATOR", "OPERATOR"),
  getAllTransactionsController
);
trsRouter.get(
  "/:id",
  isAuth,
  reqRole("ADMINISTRATOR", "OPERATOR"),
  getAllTransactionsIDController
);

trsRouter.get(
  "/product/:product_id",
  isAuth,
  reqRole("ADMINISTRATOR", "OPERATOR"),
  getAllTransactionsProductController
);
trsRouter.patch(
  "/:id/description",
  isAuth,
  reqRole("ADMINISTRATOR", "OPERATOR"),
  updateTransactionDescriptionController
);
trsRouter.patch(
  "/:id",
  isAuth,
  reqRole("ADMINISTRATOR"),
  updateTransactionFullController
);
trsRouter.delete(
  "/:id",
  isAuth,
  reqRole("ADMINISTRATOR"),
  deleteTransactionController
);

export default trsRouter;
