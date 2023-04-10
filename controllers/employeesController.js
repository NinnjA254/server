import models from "../models.js";
import mongoose from "mongoose";

export async function getAllEmployees(req, res) {
  try {
    const employees = await models.Employee.find().populate("accessAllowed");
    res.json({
      status: 200,
      message: "success",
      data: employees,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function editEmployee(req, res) {
  const employeeId = req.params.employeeId;
  const employeeInfo = req.body; //updated employee information

  if (!mongoose.Types.ObjectId.isValid(employeeId))
    return res.json({
      status: 404,
      message: "invalid employee id",
      data: null,
    });
  const employee = await models.Employee.findOne({ _id: employeeId });
  if (!employee) {
    return res.json({
      message: "employee not found",
      status: 404,
      data: null,
    });
  }
  if (
    !employeeInfo.firstName ||
    !employeeInfo.lastName ||
    !employeeInfo.accessAllowed
  ) {
    return res.json({
      status: 400,
      message: "check your request body",
      data: null,
    });
  }
  if (!Array.isArray(employeeInfo.accessAllowed)) {
    return res.json({
      status: 400,
      message: "accessAllowed must be an array",
      data: null,
    });
  }

  employee.firstName = employeeInfo.firstName;
  employee.lastName = employeeInfo.lastName;
  employee.accessAllowed = employeeInfo.accessAllowed;
  await employee.save();
  return res.json({
    message: "employee successifully edited!",
    status: 200,
    data: null,
  });
}

export async function createEmployee(req, res) {
  const employeeDetails = req.body;
  if (
    !employeeDetails.firstName ||
    !employeeDetails.lastName ||
    !employeeDetails.password ||
    !employeeDetails.accessAllowed
  ) {
    return res.json({
      status: 400,
      message: "check your request body",
      data: null,
    });
  }
  if (!Array.isArray(employeeDetails.accessAllowed)) {
    return res.json({
      status: 400,
      message: "accessAllowed must be an array",
      data: null,
    });
  }
  const newEmployee = new models.Employee(employeeDetails);
  await newEmployee.save();
  return res.json({
    message: "employee successifully created!",
    status: 200,
    data: null,
  });
}

export async function deleteEmployee(req, res) {
  const employeeId = req.params.employeeId;
  if (!mongoose.Types.ObjectId.isValid(employeeId))
    return res.json({
      status: 404,
      message: "invalid employee id",
      data: null,
    });

  const employee = await models.Employee.findOne({ _id: employeeId });
  if (!employee) {
    return res.json({
      message: "employee not found",
      status: 404,
      data: null,
    });
  }
  await models.Employee.deleteOne({ _id: employeeId });
  return res.json({
    status: 200,
    message: "employee deleted successifuly",
    data: null,
  });
}
