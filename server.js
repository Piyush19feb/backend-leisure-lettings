const express = require("express");

const app = express();

app.use(express.json());

// lets add routers
const userRouter = require("./routes/user");
const propertyRouter = require("./routes/property");
const categoryRouter = require("./routes/category");

app.use("/user", userRouter);
app.use("/property", propertyRouter);
app.use("/category", categoryRouter);

app.listen(4000, "0.0.0.0", () => {
  console.log("server started on port 4000");
});
