import express from "express";
import {
  createInspection,
  getAllInspections,
} from "../controllers/inspectionsController.js";

const inspectionsRouter = express.Router();

inspectionsRouter.get("/", getAllInspections);
inspectionsRouter.post("/", createInspection);

export default inspectionsRouter;
