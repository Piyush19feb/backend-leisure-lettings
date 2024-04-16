const express = require("express");
const utils = require("./utils");
const jwt = require("jsonwebtoken");
const config = require("./config");

const app = express();

app.use(express.json());
app.use((request, response, next) => {
  // check if the URL is of public API
  if (request.url == "/user/login" || request.url == "/user/register") {
    // here token is not required, hence skip checking the token
    next();
  } else {
    // first read the token
    const token = request.headers["token"];
    if (!token || token.length == 0) {
      response.send(utils.createErrorResult("token expected"));
      return;
    }

    try {
      // verify the token (if token gets verified, I'll get the data in payload)
      const payload = jwt.verify(token, config.secret);
      // add the payload data (i.e. userId) in ongoing request
      request.userId = payload["id"];
      // calling next api
      next();
    } catch (exception) {
      response.send(utils.createErrorResult("Invalid Token !!"));
    }
  }
});

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
