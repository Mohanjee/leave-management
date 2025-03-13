// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const app = express();
// const PORT = 5000;

// app.use(express.json()); 
// app.use(cors());

// mongoose.connect("mongodb://localhost:27017", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const leaveSchema = new mongoose.Schema({
//   type: String,
//   days: Number,
// });

// const Leave = mongoose.model("Leave", leaveSchema);

// async function initializeLeaves() {
//   const count = await Leave.countDocuments();
//   if (count === 0) {
//     await Leave.create({ type: "casual", days: 10 });
//     await Leave.create({ type: "medical", days: 5 });
//   }
// }
// initializeLeaves();

// app.get("/", (req, res) => {
//   res.send("Welcome to the Leave Management");
// });

// app.get("/leaves", async (req, res) => {
//   const leaves = await Leave.find();
//   res.json(leaves);
// });

// app.post("/apply-leave", async (req, res) => {
//   const { type, days } = req.body;
//   const leave = await Leave.findOne({ type });

//   if (!leave) {
//     return res.status(400).json({ message: "Invalid leave type" });
//   }

//   if (leave.days >= days) {
//     leave.days -= days;
//     await leave.save();
//     return res.json({ message: "Leave applied successfully", leave });
//   } else {
//     return res.status(400).json({ message: "Not enough leave days available" });
//   }
// });

// // New HTML Endpoints
// app.get("/leaves-html", async (req, res) => {
//   const leaves = await Leave.find();
//   let html = "<h1>Available Leave Types</h1><ul>";
//   leaves.forEach(leave => {
//     html += `<li>${leave.type}: ${leave.days} days</li>`;
//   });
//   html += "</ul>";
//   res.send(html);
// });

// app.get("/apply-leave-html", (req, res) => {
//   const html = `
//     <h1>Apply for Leave</h1>
//     <form action="/apply-leave" method="POST">
//       <label for="type">Leave Type:</label>
//       <input type="text" id="type" name="type" required>
//       <label for="days">Number of Days:</label>
//       <input type="number" id="days" name="days" required>
//       <button type="submit">Apply</button>
//     </form>
//   `;
//   res.send(html);
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

app.use(express.json()); 
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// MongoDB connection
mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit the application if the connection fails
});

const leaveSchema = new mongoose.Schema({
  type: String,
  days: Number,
});

const Leave = mongoose.model("Leave", leaveSchema);

async function initializeLeaves() {
  const count = await Leave.countDocuments();
  if (count === 0) {
    await Leave.create({ type: "casual", days: 10 });
    await Leave.create({ type: "medical", days: 5 });
  }
}
initializeLeaves();

app.get("/", (req, res) => {
  res.send("Welcome to the Leave Management API!");
});

app.get("/leaves", async (req, res) => {
  const leaves = await Leave.find();
  res.json(leaves);
});

app.post("/apply-leave", async (req, res) => {
  console.log("Received request to apply leave:", req.body); // Log the request body
  const { type, days } = req.body;
  const leave = await Leave.findOne({ type });

  if (!leave) {
    return res.status(400).json({ message: "Invalid leave type" });
  }

  if (leave.days >= days) {
    leave.days -= days;
    await leave.save();
    return res.json({ message: "Leave applied successfully", leave });
  } else {
    return res.status(400).json({ message: "Not enough leave days available" });
  }
});

// New HTML Endpoints
app.get("/leaves-html", async (req, res) => {
  const leaves = await Leave.find();
  let html = "<h1>Available Leave Types</h1><ul>";
  leaves.forEach(leave => {
    html += `<li>${leave.type}: ${leave.days} days</li>`;
  });
  html += "</ul>";
  res.send(html);
});

app.get("/apply-leave-html", (req, res) => {
  const html = `
    <h1>Apply for Leave</h1>
    <form action="/apply-leave" method="POST">
      <label for="type">Leave Type:</label>
      <input type="text" id="type" name="type" required>
      <label for="days">Number of Days:</label>
      <input type="number" id="days" name="days" required>
      <button type="submit">Apply</button>
    </form>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});