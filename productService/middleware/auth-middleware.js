import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const isValidToken = async (req, res, next) => {
  try {
    console.log("Hello jii In isValidToken");
    console.log(process.env.JWT_SECRET);
    // const token = req.header('Authorization')?.replace('Bearer ', '');
    const token = req.cookies.token;
    console.log("Token in isValid-->" + token);

    if (!token) {
      console.log("Token Missing...");
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Token Missing",
      });
    }

    try {
      console.log("Got the Token and Verifying...");
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload; // Attach the payload to the request object
      // console.log(payload);
      console.log("Token Validated...");
      next();
    } catch (e) {
      console.log(e);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Token is Invalid",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not Validate Token...",
    });
  }
};

export const renewToken = async (req, res, next) => {
  console.log("Hello jii In renewToken");

  const expirationThreshold = 600; // 10 minutes in seconds (adjust as needed)
  const currentTime = Math.floor(Date.now() / 1000);
  const payload = req.user; // Extracted from isValidToken middleware

  if (payload && payload.exp - currentTime < expirationThreshold) {
    console.log("Renewing the token...");

    const renewPayload = {
      email: payload.email,
      id: payload.id,
      role: payload.role,
    };

    const newToken = jwt.sign(renewPayload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.setHeader("X-Token-Renewed", "true");
    res.cookie("token", newToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    });
  }

  console.log("No Renewal Required...");
  next();
};
