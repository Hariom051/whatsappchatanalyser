import express from "express";
import { multerService } from "../../../utils";
import { uploadControlerService } from "../../../../uploadController";

const uploadFile = express.Router();

uploadFile.post(
  "/file",
  multerService.getUploader().single("file"),
  (req, res) => uploadControlerService.uploadFileProcess(req, res),
);

export default uploadFile;
