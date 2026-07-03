import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    const createdProducts = await Product.insertMany(sampleProducts);

    // Create dummy orders for each user using some seeded products
    const sampleOrders = createdUsers.map((user, index) => {
      const product1 = createdProducts[(index * 2) % createdProducts.length];
      const product2 = createdProducts[(index * 2 + 1) % createdProducts.length];

      const itemsPrice = Number((product1.price * 1 + product2.price * 2).toFixed(2));
      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const taxPrice = Number((itemsPrice * 0.15).toFixed(2));
      const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

      return {
        user: user._id,
        orderItems: [
          {
            name: product1.name,
            qty: 1,
            image: product1.image,
            price: product1.price,
            product: product1._id,
          },
          {
            name: product2.name,
            qty: 2,
            image: product2.image,
            price: product2.price,
            product: product2._id,
          },
        ],
        shippingAddress: {
          address: `${100 + index * 12} Broadway Ave`,
          city: "New York",
          postalCode: "10001",
          country: "USA",
        },
        paymentMethod: "PayPal",
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        isPaid: true,
        paidAt: new Date(Date.now() - 3600000 * 24 * (index + 1)), // staggered dates
        isDelivered: index === 0,
        deliveredAt: index === 0 ? new Date() : undefined,
      };
    });

    await Order.insertMany(sampleOrders);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
