import express from "express";
import { logoutController } from "../controllers/logoutController.js";

import authorize from "../middlewares/authorize.js";

const logOutRouter = express.Router();

logOutRouter.get("/", logoutController);

export default logOutRouter;
