import mongoose from "mongoose";

//declare your schemas and models here
//products
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prize: { type: Number, required: true },
  quantity: { type: Number, required: true, minimum: 0 }, //items in stock
});
const Product = mongoose.model("Product", productSchema);

//orders aka sales
const orderSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now() },

  // employee: {
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:'Employee'
  // }, //employee who handled the order

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  }, //customer who this order belongs to
  itemsSold: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantitySold: { type: Number, required: true }, //number of items of productId type that were sold
      cost: {
        type: Number,
        required: true,
      }, //total cost of the productId type sold. ie. quantitySold * product's cost per item
    },
  ],
  totalCost: { type: Number, required: true }, //total cost of the order
  orderStatus: { type: Boolean, required: true },
});
const Order = mongoose.model("Order", orderSchema);

//acquisitions
const acquisitionSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now() },

  // employee: {
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:'Employee'
  // }, //employee who handled the acquisition

  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  }, //supplier who supplied in this acquisition
  itemsAcquired: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      prizePerItem: { type: Number, required: true }, // each supplier might sell the product at a different proce
      quantityAcquired: { type: Number, required: true }, //number of items of productId type that were sold
    },
  ],
  totalCost: { type: Number, required: true }, //total cost of the acquisition
  acquisitionStatus: { type: Boolean, required: true },
});
const Acquisition = mongoose.model("Acquisition", acquisitionSchema);

//inspections
const inspectionSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now() },

  // employee: {
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:'Employee'
  // }, //employee who handled the inspection

  itemsDamaged: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantityDamaged: { type: Number, required: true }, //number of items of productId type that were damaged
    },
  ],
  report: { type: String, required: true }, //reasons why items got damaged
});
const Inspection = mongoose.model("Inspection", inspectionSchema);

//employees
const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  accessAllowed: { type: Array },
});
const Employee = mongoose.model("Employee", employeeSchema);

//customers
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});
const Customer = mongoose.model("Customer", customerSchema);

//suppliers
const supplierSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});
const Supplier = mongoose.model("Supplier", supplierSchema);

//put all your models in this object, which will then be exported
const models = {
  Product: Product,
  Order: Order,
  Acquisition: Acquisition,
  Inspection: Inspection,
  Employee: Employee,
  Customer: Customer,
  Supplier: Supplier,
};

export default models;
