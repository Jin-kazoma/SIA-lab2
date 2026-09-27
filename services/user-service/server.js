const express = require("express");

const app = express();
const PORT = 5001;

// user data
const users = [
  {
    id: 1,
    name: "kenny",
    email: "keny@gmail.com"
  },

  {
    id: 2,
    name: "Bob",
    email: "Bob@gmail.com"
  },

  {
    id: 3,
    name: "Kyle",
    email: "kyle@gmail.com"
  },

  {
    id: 4,
    name: "Ben",
    email: "ben@gmial.com"
  },

  {
    id: 5,
    name: "Cartman",
    email: "cart@gmail.com"
  },
];

// get users
app.get("/users", (req, res) => {
  console.log("User Service: Returning", users.length, "users");
  res.json({
    service: "User Service",
    status: "success",
    count: users.length,
    data: users,
    timeStamp: new Date().toISOString(),
  });
});

// check health
app.get("/ping", (req, res) => {
  res.json({ status: "online", service: "Use Service" });
});

// Start server
app.listen(PORT, () => {
  console.log("=".repeat(40));
  console.log("USER SERVICE STARTED");
  console.log("=".repeat(40));
  console.log(`Port: ${PORT}`);
  console.log(`GET /users - Returns ${users.length} users`);
  console.log(`GET /ping - Health check`);
  console.log("=".repeat(40));
});
