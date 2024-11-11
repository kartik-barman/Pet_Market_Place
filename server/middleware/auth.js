import jwt from "jsonwebtoken";

const checkLogIn = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if the Authorization header is missing
  if (!authorization) {
    return res.status(401).json({
      msg: "Authorization header missing",
    });
  }

  try {
    // Extract the token part after "Bearer"
    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token is missing from the authorization header" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_CODE);

    // Attach the user data to the request object for further use
    const { userId, email } = decoded;
    req.userId = userId;
    req.email = email;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error for debugging
    console.error("Error verifying token:", error);

    // Handle specific JWT errors (like token expiration)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

export default checkLogIn;
