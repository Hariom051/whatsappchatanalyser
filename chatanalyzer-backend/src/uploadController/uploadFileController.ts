import { Request, Response, NextFunction } from "express";
import { anaylzeService, whatsAppChatParserService } from "../services";

export class UploadController {
  public uploadFileProcess = (req: Request, res: Response): void => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      const filePath: string = req.file.path;
      const parsed = whatsAppChatParserService.parse(filePath);

      const result = anaylzeService.analyze(
        parsed.messagedInGroup,
        parsed.joinedGroup,
      );

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  };
}
