import express from "express";
import router from "./routers/index.js";
import cors from "cors";
import { HttpError } from "./errors/customError.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);

  if (err instanceof HttpError) {
    const response = { message: err.message };

    // path 있을 때만 추가
    if (err.path !== undefined) {
      response.path = err.path;
    }

    return res.status(err.statusCode).json(response);
  }
});

export default app;
