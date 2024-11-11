import { Order } from "../models/Order.js";
import { Pet } from "../models/PetModel.js";
import { User } from "../models/User.js";

export const createPetOrderApi = async (req, res) => {
    const userId = req.userId;
    const { items, totalAmount, shippingAddress } = req.body;
  
    try {
      // Create and save the order
      const newOrder = new Order({
        userId,
        items,
        totalAmount,
        shippingAddress,
        orderStatus: "Ordered",
      });
      const order = await newOrder.save();
  
      // Find the user and push the order ID into their orders array
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, msg: "User not found!" });
      }
      user.orders.push(order._id);
      await user.save();
  
      // Loop through each item in the order and update the Pet model
      for (const item of items) {
        const petId = item.productId;
  
        // Find the pet and push the userId into its orders array
        const pet = await Pet.findById(petId);
        if (pet) {
          pet.orders.push(userId);
          await pet.save();
        }
      }
  
      // Send the response
      res.status(201).json({
        success: true,
        msg: "Order placed successfully",
        order,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating order" });
    }
  };
  

/*__________________________________________________________________________________*
 *
 *                         Get Order by ID
 *__________________________________________________________________________________*/
export const userOrderGetApi =  async (req, res) => {
    const userId = req.params.userId;
    try {
      const order = await Order.findOne({userId : userId})
      .populate("userId", "name email")
      .populate("items.productId", "name price");
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching order" });
    }
  };



// FInd Order with the help of product id
export const findOrderByProductId = async (req, res) => {
    const productId = req.params.productId; 
    try {
     
      const orders = await Order.find({
        "items.productId": productId  
      })
        .populate({
          path: "userId",  
          select: "name email location about"  
        });
  
      const orderDetails = orders.map(order => {
        // Filter out items that don't match the productId
        const matchedItems = order.items.filter(item => item.productId._id.toString() === productId);
        if (matchedItems.length > 0) {
          return {
            shippingAddress: order.shippingAddress,  
            orderStatus: order.orderStatus,  
            totalAmount: order.totalAmount,  
            createdAt: order.createdAt,  
            updatedAt: order.updatedAt,  
            user: order.userId,  
            _id : order._id
          };
        }
        return null;
      }).filter(order => order !== null);  // Remove any null values from the result
  
      if (orderDetails.length === 0) {
        return res.status(404).json({ message: "Product not found in any orders" });
      }
  
      // Return only the order and user details (without product details)
      res.json(orderDetails);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching order details" });
    }
  };
  
/*__________________________________________________________________________________*
 *
 *                          Update Order status
 *                http://localhost:5000/api/orders/:orderId/status
 *__________________________________________________________________________________*/
export const orderStatusUpdateApi =  async (req, res) => {
    const orderId = req.params.orderId;
    const { orderStatus } = req.body;
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.json(updatedOrder);
    } catch (err) {
      console.error("Error :",err);
      res.status(500).json({ message: "Error updating order" });
    }
  };
  