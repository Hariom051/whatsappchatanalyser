import multer, {
  Multer,
  MulterError,
  StorageEngine,
  FileFilterCallback,
} from "multer";
import { Request } from "express";

export class MulterService {
  private readonly uploadDir: string;
  private readonly uploader: Multer;

  constructor(uploadDir: string = "uploads") {
    this.uploadDir = uploadDir;
    this.uploader = multer({
      storage: this.createStorage(),
      fileFilter: this.fileFilter,
    });
  }

  public getUploader(): Multer {
    return this.uploader;
  }

  private createStorage(): StorageEngine {
    return multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb): void => {
        cb(null, this.uploadDir);
      },
      filename: (req: Request, file: Express.Multer.File, cb): void => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });
  }

  private fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void => {
    if (file.mimetype !== "text/plain") {
      cb(new MulterError("LIMIT_UNEXPECTED_FILE", "Only .txt files allowed"));
      return;
    }

    cb(null, true);
  };
}
