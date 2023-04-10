import models from "../models.js";
import mongoose from "mongoose";

export async function getAllAcquisitions(req, res) {
  try {
    const acquisitions = await models.Acquisition.find()
      .populate("supplierId", "firstName lastName -_id")
      .populate("itemsAcquired.productId", "name -_id");
    res.json({
      status: 200,
      message: "success",
      data: acquisitions,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function createAcquisition(req, res) {
  const supplierInfo = req.body.supplierInfo;
  const productInfo = req.body.productInfo;
  if (!productInfo || !supplierInfo) {
    return res.json({
      status: 400,
      message: "check your request body",
      data: null,
    });
  }

  const productArray = [];
  //const outOfStock = [];
  let totalCost = 0;
  const supplier = await models.Supplier.findOne({
    firstName: supplierInfo.firstName,
    lastName: supplierInfo.lastName,
  });

  for (let info of productInfo) {
    const product = await models.Product.findOne({ _id: info._id });
    if (!product) {
      return res.json({
        message: `${info.name} does not exist in inventory, please create it first`,
        status: 404,
        data: null,
      });
    }

    productArray.push({
      productId: product._id.toString(),
      quantityAcquired: info.quantity,
      prizePerItem: info.prizePerItem,
    });
    totalCost += info.prizePerItem * info.quantity;
  }
  console.log("code has passed for loop");

  //check that supplier exists
  if (supplier) {
    //create a new acquisition
    const acquisition = new models.Acquisition({
      time: Date.now(),
      supplierId: supplier._id.toString(),
      itemsAcquired: productArray,
      acquisitionStatus: false,
      totalCost: totalCost,
    });
    await acquisition.save().catch((err) => console.log(err));
    console.log("acquisition success with existing supplier");
    return res.json({
      message: "acquisition successfully created with an existing supplier",
      status: 200,
      data: null,
    });
  } else {
    const newSupplier = new models.Supplier({
      firstName: supplierInfo.firstName,
      lastName: supplierInfo.lastName,
    });
    await newSupplier.save().catch((err) => console.log(err));

    const acquisition = new models.Acquisition({
      time: Date.now(),
      supplierId: newSupplier._id.toString(),
      itemsAcquired: productArray,
      acquisitionStatus: false,
      totalCost: totalCost,
    });
    await acquisition.save().catch((err) => console.log(err));
    console.log("acquisition success, created new supplier!");
    return res.json({
      message: "acquisition successifully created,created new supplier",
      status: 200,
      data: null,
    });
  }
}

export async function fulfilAcquisition(req, res) {
  const acquisitionId = req.params.acquisitionId;
  if (!mongoose.Types.ObjectId.isValid(acquisitionId))
    return res.json({
      status: 404,
      message: "invalid id",
      data: null,
    });

  const acquisition = await models.Acquisition.findOne({ _id: acquisitionId });
  // console.log(acquisition)
  if (!acquisition) {
    return res.json({
      message: "acquisition not found",
      status: 404,
      data: null,
    });
  }
  if (acquisition.acquisitionStatus === true) {
    return res.json({
      message: "the acquisition is already fulfilled",
      status: 403,
      data: null,
    });
  } else if (acquisition.acquisitionStatus === false) {
    const productsToSave = [];
    for (let item of acquisition.itemsAcquired) {
      const qty = item.quantityAcquired;
      const product = await models.Product.findOne({ _id: item.productId });
      if (!product)
        return res.json({
          message: `${product.name} was not found in the database, please add it first`,
          status: 404,
          data: null,
        });
      product.quantity += qty;
      productsToSave.push(product);
      // await product.save().catch(err => console.log(err)) // possible optimisation: move this product.save outside of the for loop
      //console.log(product)
    }

    for (let product of productsToSave) {
      await product.save().catch((err) => console.log(err));
    }
    acquisition.acquisitionStatus = true;
    await acquisition.save().catch((err) => console.log(err));
    return res.json({
      message: "acquisition fulfilled succesfully",
      status: 200,
      data: null,
    });
  }
}

export async function cancelAcquisition(req, res) {
  const acquisitionId = req.params.acquisitionId;
  if (!mongoose.Types.ObjectId.isValid(acquisitionId))
    return res.json({
      status: 404,
      message: "invalid id",
      data: null,
    });
  const acquisition = await models.Acquisition.findOne({ _id: acquisitionId });
  if (!acquisition) {
    return res.json({
      message: "acquisition not found",
      status: 404,
      data: null,
    });
  }
  if (acquisition.acquisitionStatus === true) {
    return res.json({
      message: "fulfilled acquisitions cannot be cancelled",
      status: 403,
      data: null,
    });
  } else if (acquisition.acquisitionStatus === false) {
    await models.Acquisition.deleteOne({ _id: acquisitionId });
    return res.json({
      status: 200,
      message: "acquisition cancelled successifuly",
      data: null,
    });
  }
}
