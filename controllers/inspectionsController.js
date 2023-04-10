import models from "../models.js";
import mongoose from "mongoose";

export async function getAllInspections(req, res) {
  try {
    const inspections = await models.Inspection.find().populate(
      "itemsDamaged.productId",
      "name -_id"
    );
    res.json({
      status: 200,
      message: "success",
      data: inspections,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function createInspection(req, res) {
  const report = req.body.report;
  const productInfo = req.body.productInfo;
  if (!productInfo || !report) {
    return res.json({
      status: 400,
      message: "check your request body",
      data: null,
    });
  }

  const productArray = [];
  const productsToSave = [];
  //const outOfStock = [];
  //let totalLosses = 0; a potential future feature to calculate total losses per inspection

  for (let info of productInfo) {
    const product = await models.Product.findOne({ _id: info._id });
    if (!product) {
      return res.json({
        message: `${info.name} does not exist in inventory`,
        status: 404,
        data: null,
      });
    }
    if (product.quantity < info.quantityDamaged) {
      return res.json({
        message: `${info.name} is not enough in inventory for all those damages`,
        status: 404,
        data: null,
      });
    }
    product.quantity -= info.quantityDamaged;
    productsToSave.push(product);
    productArray.push({
      productId: product._id.toString(),
      quantityDamaged: info.quantityDamaged,
    });
  }
  console.log("code has passed for loop");

  //check that supplier exists

  //create a new inspection
  const inspection = new models.Inspection({
    time: Date.now(),
    itemsDamaged: productArray,
    report: report,
  });

  for (let product of productsToSave) {
    await product.save().catch((err) => console.log(err));
  }

  await inspection.save().catch((err) => console.log(err));
  console.log("inspection successifullu logged");
  return res.json({
    message: "inspection successfully logged",
    status: 200,
    data: null,
  });
}
