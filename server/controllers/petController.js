import fs from "fs";
import path from "path";
import { uploadFile } from "../Helper/Upload.js";
import { Pet } from "../models/PetModel.js";
import { User } from "../models/User.js";

/*__________________________________________________________________________________*
 *
 *                  Function to create a pet
 *__________________________________________________________________________________*/
export const postPetApi = async (req, res) => {
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

    // Check for missing fields
    const { name, location, category, breed, age, price, description } = req.body;
    if (!name || !location || !category || !breed || !age || !price || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new pet with the form data
    const newPet = new Pet({
      seller: req.userId, 
      name,
      location,
      category,
      breed,
      age,
      description,
      price,
      images: imageUrls,
    });

    await newPet.save();

    // Update the user's pets list
    await User.updateOne({ _id: req.userId }, { $push: { pets: newPet._id } });

    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error creating pet:", error);
    res.status(500).json({ message: "Error creating pet", error: error.message });
  }
};


/*__________________________________________________________________________________*
 *
 *                      Function to get all pets
 *__________________________________________________________________________________*/
export const fetchAllPetsApi = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4; // Default limit to 4
    const skip = parseInt(req.query.skip) || 0; // Default skip to 0

    let petsQuery = Pet.find()
      .populate("seller", "name email")
      .populate("comments.user", "name email")
      .populate("views", "name -_id");

    if (req.query.limit && req.query.skip) {
      petsQuery = petsQuery.skip(skip).limit(limit);
    }

    const pets = await petsQuery.exec();
    const totalPets = await Pet.countDocuments();

    if (pets.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No pets found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Fetched pets successfully",
      pets,
      totalPets, // Send total count of pets for pagination
    });
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message, // Include the error message for debugging
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                      Function to fetch individual pet details
 *__________________________________________________________________________________*/
export const fetchIndivisualPetsApi = async (req, res) => {
  const petId = req.params.petId;

  try {
    const pet = await Pet.findById(petId)
      .populate("seller", "name email")
      .populate("comments.user", "name email avatar")
      .populate("orders", "name email phone avatar");

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json({
      success: true,
      msg: "Fetch successfully",
      pet,
    });
  } catch (error) {
    console.error("Errors:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                      Function to post comments
 *__________________________________________________________________________________*/
export const postCommentApi = async (req, res) => {
  const petId = req.params.petId;
  const { commentText } = req.body;

  try {
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        msg: "Pet not found",
      });
    }

    pet.comments.push({
      user: req.userId,
      commentText,
    });

    await pet.save();

    res.status(201).json({
      success: true,
      msg: "Comment posted successfully",
      pet,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                       Increment pet views
 *__________________________________________________________________________________*/
export const incrementPetViewsApi = async (req, res) => {
  const { petId } = req.params; // Get the petId from the request parameters
  const userId = req.userId; // Get the userId from the authenticated user

  try {
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ msg: "Pet not found" });
    }

    if (!Array.isArray(pet.views)) {
      pet.views = []; // Initialize views as an empty array if it's not already an array
    }

    const alreadyViewed =
      pet.views.filter((view) => view.toString() === userId).length > 0;

    if (alreadyViewed) {
      return res.status(400).json({ msg: "User has already viewed this pet" });
    }

    pet.views.push(userId);

    await pet.save();

    res.status(200).json({ success: true, pet });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ success: false, msg: "Error updating views" });
  }
};
