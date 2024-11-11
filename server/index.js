import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import petRoute from "./routes/petRoute.js";
import userRoute from "./routes/userRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cors from "cors";

dotenv.config();
const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());
app.use("/api/pets", petRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send("Server is working fine");
});

// Connect to DB and start server only if not in a serverless environment
connectDB().catch((err) => console.error("Error connecting to DB:", err));

const port = process.env.PORT || 5002

// Export the app as a module, required by serverless environments
app.listen(port, ()=>{
  console.log(`Welcome mr kartik barman\nYour Server running at http://localhost:${port}`);

})
export default app;
