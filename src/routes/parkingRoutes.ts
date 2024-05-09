import express from "express";
import {
  getAllParkings,
  getParkingById,
  createParking,

} from "../controllers/parkingController";

const router = express.Router();

router.get("/", getAllParkings);
router.get("/:parkingID", getParkingById);
router.post("/", createParking)

export default router;
