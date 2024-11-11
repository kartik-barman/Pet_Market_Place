import express from "express";
import multer from "multer";
import checkLogIn from "../middleware/auth.js";
import { fetchAllPetsApi, fetchIndivisualPetsApi, incrementPetViewsApi, postCommentApi, postPetApi } from "../controllers/petController.js";
import { findOrderByProductId } from "../controllers/orderController.js";


const router = express.Router();

// Define multer storage with memory storage
const storage = multer.memoryStorage();  // Memory storage keeps files in buffer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }  // 10 MB limit
}).array("images", 5);  // Allows up to 5 files at once

// Route to create a new pet listing
router.post("/create", checkLogIn, upload, postPetApi);

// Fetch all pets
router.get("/", fetchAllPetsApi);

// Fetch individual pet details
router.get("/:petId", fetchIndivisualPetsApi);

// Post a comment on a pet listing
router.post("/comment/:petId", checkLogIn, postCommentApi);

// Increment pet views
router.put("/view/:petId", checkLogIn, incrementPetViewsApi);

// Find pet orders based on product ID
router.get("/pet/orders/:productId", findOrderByProductId);

export default router;
