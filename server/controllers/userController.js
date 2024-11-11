import bcrypt from "bcryptjs";
import Razorpay from "razorpay";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Pet } from "../models/PetModel.js";
import { uploadFile } from "../Helper/Upload.js";
import { sentSubscribeMail } from "../Helper/SubscribeMail.js";
import { Subscriber } from "../models/Subscriber.js";
import { ContactMessage } from "../models/ContactMessage.js";

/*__________________________________________________________________________________*
 *
 *                      Function to create user api
 *__________________________________________________________________________________*/
export const userCreateApi = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { name }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User with this email or name already exists!",
      });
    }
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exist!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...req.body,
      name,
      email,
      password: hashedPassword,
    });
    const saveUser = await newUser.save();
    res.status(201).json({
      success: true,
      msg: "User created successfully..",
      saveUser,
    });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({
      success: false,
      msg: "internal server error!",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                    Function to User Profile Picture Upload API
 *__________________________________________________________________________________*/

export const userAvatarUploadApi = async (req, res) => {
  const userId = req.userId;
  if (!req.file) {
    return res.status(400).json({
      success: false,
      msg: "No file uploaded",
    });
  }
  const filePath = req.file.path;
  try {
    // Upload to Cloudinary
    const uploadResult = await uploadFile(filePath);

    // Ensure Cloudinary returns a URL
    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error("Failed to upload image to Cloudinary.");
    }

    // Get the Cloudinary URL
    const avatarUrl = uploadResult.secure_url;

    // Update user's avatar in MongoDB
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    // Handle case where user isn't found
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Send response
    res.status(200).json({
      success: true,
      msg: "Profile picture uploaded successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("File Upload Error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                    Function to User Profile Update API
 *__________________________________________________________________________________*/

// User profile update API
export const userUpdateProfileApi = async (req, res) => {
  const userId = req.userId; // Get userId from authenticated user

  try {
    // Initialize an object to hold the fields to update
    const updateFields = { ...req.body }; // Copy other fields from req.body like name, email, etc.

    // Check if avatar file is provided, and upload if present
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      const avatarBuffer = req.files.avatar[0].buffer;
      const avatarName = `avatar_${Date.now()}`; // Optional: Use timestamp to avoid file name conflicts
      const avatarUpload = await uploadFile(avatarBuffer, avatarName);

      // Check if the upload was successful
      if (!avatarUpload.secure_url) {
        return res.status(500).json({
          success: false,
          msg: "Failed to upload avatar image",
        });
      }
      updateFields.avatar = avatarUpload.secure_url; // Set the avatar URL in updateFields
    }

    // Check if banner file is provided, and upload if present
    if (req.files && req.files.banner && req.files.banner[0]) {
      const bannerBuffer = req.files.banner[0].buffer;
      const bannerName = `banner_${Date.now()}`; // Optional: Use timestamp to avoid file name conflicts
      const bannerUpload = await uploadFile(bannerBuffer, bannerName);

      // Check if the upload was successful
      if (!bannerUpload.secure_url) {
        return res.status(500).json({
          success: false,
          msg: "Failed to upload banner image",
        });
      }
      updateFields.banner = bannerUpload.secure_url; // Set the banner URL in updateFields
    }

    // Update user profile with any new data and uploaded URLs
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Respond with success message and updated user data
    res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};
/*__________________________________________________________________________________*
 *
 *                          Function to User Log In Api
 *__________________________________________________________________________________*/

export const loginUserApi = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "invalid credentials!!",
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(404).json({
        success: false,
        msg: "invalid credentials!!",
      });
    }
    //Generate token
    const token = jwt.sign(
      { userId: user._id, email },
      process.env.SECRET_CODE,
      { expiresIn: "30d" }
    );
    res.status(200).json({
      success: true,
      msg: "Login Successfully",
      token,
      user: {
        userId: user._id,
        name: user.name,
        role : user.role,
        email,
        phone: user.phone,
        avatar: user.avatar,
        banner: user.banner,
        cart: user.cart,
        pets: user.pets,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "internal server errors!",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                  Function to get indivisual user
 *__________________________________________________________________________________*/

export const fetchIndivisualUserApi = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId)
    .populate("pets")
    .populate({
      path : "cart.item",
      model : "Pet"
    })
    .populate({
      path: "orders",
      populate: {
        path: "items.productId",
        model: "Pet",  // Populate each productId in the items array of orders
      },
    });
    res.status(200).json({
      success: true,
      msg: "User fetch Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "internal server errors!",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                  Function to get indivisual user
 *__________________________________________________________________________________*/

export const fetchParticularUserGlobalyShowApi = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId)
    .populate("pets")
    res.status(200).json({
      success: true,
      msg: "User fetch Successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "internal server errors!",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                  Function to items add to cart
 *__________________________________________________________________________________*/

export const itemAddToCartApi = async (req, res) => {
  const petId = req.params.petId;

  try {
    // Fetch the pet details from the Pet collection
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        msg: "Pet not found",
      });
    }

    const user = await User.findById(req.userId);

    // Check if the pet is already in the user's cart
    const existingCartItem = user.cart.find(
      (cartItem) => cartItem.item.toString() === petId
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      user.cart.push({
        item: petId,
        quantity: 1,
        price: pet.price,
      });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({
      success: true,
      msg: "Added to cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                  Function to items add to cart
 *__________________________________________________________________________________*/

export const cartItemQuantityUpdateApi = async (req, res) => {
  const id = req.params.id;
  const { newQuantity } = req.body;
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: true,
        msg: "User not found",
      });
    }

    // Find the item in the user's cart by matching the item's ID
    const cartItem = user.cart.find((item) => item._id.toString() === id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        msg: "Item not found in cart",
      });
    }

    if (newQuantity > 0) {
      cartItem.quantity = newQuantity;
    } else {
      return res.status(400).json({
        success: false,
        msg: "Quantity must be greater than zero",
      });
    }
    // Save the updated user document
    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Cart item quantity updated successfully",
      cart: user.cart, // Return updated cart
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while updating cart item quantity",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                          Get User card items Api
 *__________________________________________________________________________________*/

export const getCartItemsApi = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "cart.item",
      "name images"
    );
    res.status(200).json({
      success: true,
      msg: "Succesfully fetch all cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error!",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                           User card items Delete Api
 *__________________________________________________________________________________*/

export const deleteCartItemByIdApi = async (req, res) => {
  const id = req.params.id;

  try {
    // Find the user by their ID
    const user = await User.findById(req.userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Filter out the item by ID and reassign to the user's cart
    user.cart = user.cart.filter((item) => item._id.toString() !== id);

    // Save the updated user document
    await user.save();

    // Respond with success
    res.status(200).json({
      success: true,
      msg: "Item deleted successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error!",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                           Delete All card items Api
 *__________________________________________________________________________________*/

export const deleteAllCartItemsApi = async (req, res) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Clear all items from the user's cart
    user.cart = [];

    // Save the updated user document
    await user.save();

    // Respond with success
    res.status(200).json({
      success: true,
      msg: "All cart items deleted successfully",
      cart: user.cart, // Empty array after clearing the cart
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error!",
    });
  }
};


/*______________________________User Maintance Admin Api___________________________ */

/*__________________________________________________________________________________*
 *
 *                      Get All User This Api Only for Admin
 *__________________________________________________________________________________*/

export const fetchAllUserApi = async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json({
      success: true,
      msg: "User fetch successfully..",
      users,
    });
  } catch (error) {
    console.error("Errors :", error);
    res.status(500).json({
      success: false,
      msg: "internal server error!",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                      Delete User This Api Only for Admin
 *__________________________________________________________________________________*/

export const deleteUserApi = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json({
      msg: "User Deleted successfully",
    });
  } catch (error) {
    console.error("User Delete error :", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                        Create Razorpay Order Id
 *__________________________________________________________________________________*/

export const createRazorPayOrderIdApi = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  const options = {
    amount: req.body.amount, // Amount is expected in paise (1 INR = 100 paise)
    currency: req.body.currency,
    receipt: "receipt",
    payment_capture: 1, // 1 for automatic payment capture
  };

  try {
    // Await the Razorpay order creation
    const response = await razorpay.orders.create(options);

    // Send a successful response back to the client
    res.status(201).json({
      success : true,
      msg : "Order id created successfully.",
      order_id: response.id,
      amount: response.amount,
      currency: response.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res
      .status(500)
      .json({ error: "Failed to create order. Please try again later." });
  }
};

/*__________________________________________________________________________________*
 *
 *                      Sent Subscribe mail
 *__________________________________________________________________________________*/
export const sentSubscribeMailApi = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(200).json({
        success: false,
        msg: "You have already subscribed to our community!",
      });
    }

    // Create a new subscriber and save it to the database
    const newSubscriber = new Subscriber({
      email,
    });
    await newSubscriber.save();

    // Send the subscription confirmation email
    const result = await sentSubscribeMail(email);

    // Send success response
    res.status(200).json({
      success: true,
      msg: "Email sent successfully",
    });
  } catch (error) {
    console.error("Subscribe mail sent error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

/*__________________________________________________________________________________*
 *
 *                        Contact Form 
 *__________________________________________________________________________________*/

export const contactFormApi = async (req, res) => {
  try {
    const { name, email, topic, message } = req.body;

    const newContactMessage = new ContactMessage({
      name,
      email,
      topic,
      message,
    });

    // Save the message to the database
    await newContactMessage.save();

    res
      .status(201)
      .json({ success: true, msg: "Your message has been sent successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        msg: "An error occurred. Please try again later.",
      });
  }
};
