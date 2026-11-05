import express from "express";
import session from "express-session";
import env from "dotenv";
import cors from "cors";
import { dbConnect } from "./config/connectDB.js";
import authRouter from "./routes/authRoutes.js";
import prodRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRouter.js";
import trsRouter from "./routes/transactionsRoutes.js";

env.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN_SESS,
    credentials: true,
  })
);

app.use(
  session({
    name: "warehouse_session",
    secret: "ijuytfuijokmjnhygtef",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

dbConnect();

app.use("/api/auth", authRouter);
app.use("/api/products", prodRouter);
app.use("/api/users", userRouter);
app.use("/api/transactions", trsRouter);

app.get("/", (_req, res) => res.send("API functioneaza!"));

app.listen(PORT, () => {
  console.log(`Server-ul ruleaza pe portul ${PORT}!`);
});
