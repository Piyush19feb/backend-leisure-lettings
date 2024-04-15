const express = require("express");
const db = require("../db");
const utils = require("../utils");

const router = express.Router();

// get all categories
router.get("/all", (request, response) => {
  const query = `select * from category`;
  db.pool.execute(query, (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

// insert category
router.post("/add", (request, response) => {
  const { title, details } = request.body;
  const query = `insert into category (title, details) values (?,?)`;
  db.pool.execute(query, [title, details], (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

module.exports = router;
