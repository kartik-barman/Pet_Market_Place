import express from "express";
import multer from "multer";
import checkLogIn from "../middleware/auth.js";
import { fetchAllPetsApi, fetchIndivisualPetsApi, incrementPetViewsApi, postCommentApi } from "../controllers/petController.js";
import { findOrderByProductId } from "../controllers/orderController.js";
import { Pet } from "../models/PetModel.js";
import { uploadFile } from "../Helper/Upload.js";  // Cloudinary upload function

const router = express.Router();

// Define multer storage with memory storage
const storage = multer.memoryStorage();  // Memory storage keeps files in buffer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }  // 10 MB limit
}).array("images", 5);  // Allows up to 5 files at once

// Route to create a new pet listing
router.post("/create", checkLogIn, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: "Error uploading file" });
    }

    try {
      // Handle uploaded files
      const imageUrls = [];
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      // Process each file and upload it to Cloudinary
      for (let i = 0; i < req.files.length; i++) {
        const fileBuffer = req.files[i].buffer; // Get buffer from file
        const fileName = req.files[i].originalname;

        // Upload the file to Cloudinary
        const result = await uploadFile(fileBuffer, fileName);  
        imageUrls.push(result.secure_url);
      }

      // Create new pet entry in the database
      const newPet = new Pet({
        seller: req.userId,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        images: imageUrls,  // Save Cloudinary URLs
      });

      await newPet.save();
      res.status(201).json({ success: true, pet: newPet });
    } catch (error) {
      console.error("Error creating pet:", error);
      res.status(500).json({ message: "Error creating pet" });
    }
  });
});

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
