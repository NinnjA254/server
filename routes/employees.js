import express from "express";
import {
  getAllEmployees,
  deleteEmployee,
  editEmployee,
  createEmployee,
} from "../controllers/employeesController.js";
import authorize from "../middlewares/authorize.js";

const employeesRouter = express.Router();

employeesRouter.get("/", getAllEmployees);
employeesRouter.patch("/:employeeId/edit", editEmployee);
employeesRouter.delete("/:employeeId/delete", deleteEmployee);
employeesRouter.post("/", createEmployee);

export default employeesRouter;
