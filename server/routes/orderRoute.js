import express from "express";
import { orderStatusUpdateApi } from "../controllers/orderController.js";
import checkLogIn from "../middleware/auth.js";

const router = express.Router();


router.put("/:orderId/status", checkLogIn, orderStatusUpdateApi);

export default router