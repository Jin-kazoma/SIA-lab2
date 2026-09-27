const express = require("express");

const app = express();
const PORT = 5003;

// Sample data - 5 orders
const orders = [
  { id: 1, userId: 1, productId: 1, status: "Delivered", total: 1299.99 },
  { id: 2, userId: 2, productId: 3, status: "Shipped", total: 19.99 },
  { id: 3, userId: 3, productId: 2, status: "Processing", total: 29.99 },
  { id: 4, userId: 1, productId: 4, status: "Delivered", total: 349.99 },
  { id: 5, userId: 5, productId: 5, status: "Pending", total: 89.99 },
];

// get orders
app.get("/orders", (req, res) => {
  console.log("Order Service: Returning", orders.length, "order");
  res.json({
    service: "Order Service",
    status: "success",
    count: orders.length,
    data: orders,
    timeStamp: new Date().toISOString(),
  });
});

// check health
app.get("/ping", (req, res) => {
  res.json({ status: "online", service: "Order Service" });
});

// Start server
app.listen(PORT, () => {
  console.log("=".repeat(40));
  console.log("ORDER SERVICE STARTED");
  console.log("=".repeat(40));
  console.log(`Port: ${PORT}`);
  console.log(`GET /orders - Returns ${orders.length} orders`);
  console.log(`GET /ping - Health check`);
  console.log("=".repeat(40));
});
