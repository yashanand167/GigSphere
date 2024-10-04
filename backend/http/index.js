import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { limiter } from "./validators/limiter.js";
import passport from "passport";
import bodyParser from "body-parser";
import { auth_router } from "./routers/auth.route.js";
dotenv.config();

async function startServer() {
  const app = express();
  const port = process.env.PORT;

  app.use(express.json());
  app.use(cookieParser);
  app.use(morgan("dev"));
  app.use(limiter);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/api/v1/users',auth_router)

  app.get("/", (_, res) => {
    res.json({
      message: "Server connected successfully",
    });
  });

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer();

