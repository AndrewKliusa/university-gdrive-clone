import multer from "multer";
import { join, extname } from "node:path";
import crypto from "node:crypto";

const storage = multer.diskStorage({
  destination: join(process.cwd(), "backend", "uploads"),
  filename: (_, file, callback) => {
    const id = crypto.randomUUID();
    callback(null, id + extname(file.originalname));
  }
});

export const upload = multer({ storage })