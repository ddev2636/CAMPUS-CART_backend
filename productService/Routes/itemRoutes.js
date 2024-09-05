import express from "express";
const router = express.Router();
import { isValidToken } from "../middleware/auth-middleware.js";
import { sellThing, buyThing } from "../controllers/itemControllers.js";

router.use(isValidToken);
router.post("/sell", sellThing);    
router.get("/", buyThing);
export default router;
