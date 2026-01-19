import express, { Request, Response } from "express";
import cors from "cors";

import uploadFile from "./shared/infra/http/routes/fileUpload";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadFile);

const PORT = 3001;

export function errorHandler(err: any, req: Request, res: Response) {
  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: err.message || "Something went wrong",
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
