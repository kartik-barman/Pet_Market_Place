import express from "express";
import multer from "multer";
import {
  cartItemQuantityUpdateApi,
  contactFormApi,
  createRazorPayOrderIdApi,
  deleteAllCartItemsApi,
  deleteCartItemByIdApi,
  deleteUserApi,
  fetchAllUserApi,
  fetchIndivisualUserApi,
  fetchParticularUserGlobalyShowApi,
  getCartItemsApi,
  itemAddToCartApi,
  loginUserApi,
  sentSubscribeMailApi,
  userAvatarUploadApi,
  userCreateApi,
  userUpdateProfileApi,
} from "../controllers/userController.js";
import checkLogIn from "../middleware/auth.js";
import { createPetOrderApi, userOrderGetApi } from "../controllers/orderController.js";

const router = express.Router();

// Configure multer with memory storage
const upload = multer({ storage: multer.memoryStorage() }); 

// Create User
// router.post("/create", userCreateApi);

// User Avatar Upload (Example - Not used here, but you can modify and use it)
router.post(
  "/upload-avatar",
  upload.single("avatar"), // Single file upload for avatar
  checkLogIn,
  userAvatarUploadApi
);

// Update profile with avatar and banner images
router.post(
  "/update-profile",
  upload.fields([ // Multiple files upload
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  checkLogIn,
  userUpdateProfileApi
);

// Log in user
router.post("/login", loginUserApi);

// Fetch user details
router.get("/user", checkLogIn, fetchIndivisualUserApi);

// Get Particular User Globally Show
router.get("/user/:userId", fetchParticularUserGlobalyShowApi);

// Item Add To Cart
router.put("/cart/:petId", checkLogIn, itemAddToCartApi);

// Fetch cart items
router.get("/cart", checkLogIn, getCartItemsApi);

// Remove item from cart
router.delete("/cart/item/:id", checkLogIn, deleteCartItemByIdApi);

// Delete all cart items
router.delete("/cart/items", checkLogIn, deleteAllCartItemsApi);

// Update cart items quantity
router.put("/cart/item/:id", checkLogIn, cartItemQuantityUpdateApi);

/*__________________Admin Route_______________________*/

// Fetch All Users
router.get("/", checkLogIn, fetchAllUserApi);

// Delete user
router.delete("/delete/:id", checkLogIn, deleteUserApi);

// Send Subscribe Mail
router.post("/subscribe", sentSubscribeMailApi);

// Contact Form
router.post("/contact", contactFormApi);

// Create Razorpay Payment Order ID
router.post("/order", createRazorPayOrderIdApi);

// Create pet order
router.post("/pet/order/create", checkLogIn, createPetOrderApi);

// User Order Get
router.get("/orders/:userId", userOrderGetApi);

export default router;
