import models from "../models.js";

export async function logoutController(req, res, next) {
  if (req.session) {
    req.session.destroy();
    res.json({
      message: "logged out",
      status: 200,
      data: "",
    });
  } else {
    res.json({
      message: "You are not logged in",
      status: 403,
      data: "",
    });
  }
}
