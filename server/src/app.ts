import "express-async-errors";
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import healthRoutes from "./routes/health";
import authentication from "./middleware/authentication";
import csrfProtection from "./middleware/csrf";
import errorHandler from "./middleware/errorHandler";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(csrfProtection);
app.use("/api/products", productRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use(authentication);
app.use("/api/cart", cartRoutes);
app.use("/api/users", usersRoutes);
app.use(errorHandler);

(async function Main() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("An error occurred while starting the application", err);
  }
})();
