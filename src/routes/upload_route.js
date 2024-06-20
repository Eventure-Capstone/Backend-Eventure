import { Router } from "express";
import { uploadImage } from "../controllers/upload_controller.js";
import upload from "../middlewares/multer_middleware.js";

const router = Router();

router.post("/upload", upload.single("profile_img"), uploadImage);

export default router;
