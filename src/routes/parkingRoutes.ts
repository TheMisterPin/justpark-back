import express from "express";
import {
  getAllParkings,
  getParkingById,
  createParking,
  updateParking,
  deleteParking,

} from "../controllers/parkingController";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/", getAllParkings);
router.get("/:parkingID", getParkingById);
router.post("/", [authMiddleware], createParking)
router.patch("/parkingID", [authMiddleware], updateParking)
router.delete("/:parkingID", [authMiddleware], deleteParking)

export default router;
