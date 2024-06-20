import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
dotenv.config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const storage = new Storage();
const bucket = storage.bucket(BUCKET_NAME);

export { bucket };
