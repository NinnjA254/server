import models from "../models.js";
import mongoose from "mongoose";

export async function checkLoginController(req, res) {
  const employee = await models.Employee.findOne({
    _id: req.session.employee,
  });
  console.log(employee);
  if (!req.session.employee)
    return res.json({
      message: "You are not logged in",
      status: 403,
      data: "",
    }); //not logged in

  res.json({
    message: "you are logged in",
    status: 200,
    data: employee.accessAllowed,
  }); //logged in
}
