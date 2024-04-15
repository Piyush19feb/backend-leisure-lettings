const express = require("express");
const crypto = require("crypto-js");
const mysql = require("mysql2");
const db = require("../db");
const utils = require("../utils");

const router = express.Router();

// get all users
router.get("/allusers", (request, response)=>{
    const query = `select * from user where isDeleted = 0`;
    db.pool.execute(query, (error, users)=>{
        response.send(utils.createResult(error, users));
    })
})

// register user
router.post("/register", (request, response) => {
  const { firstName, lastName, email, password, phoneNumber } = request.body;

  const query = `INSERT INTO user (firstName, lastName, email, password, phoneNumber) VALUES (?,?,?,?,?);`;
  const hashedPassword = String(crypto.SHA256(password)); // why String() => because crypto.sha256() returns buffer

  db.pool.execute(
    query,
    [firstName, lastName, email, hashedPassword, phoneNumber],
    (error, result) => {
      response.send(utils.createResult(error, result));
    }
  );
});

// login user
router.post("/login", (request, response) => {
  const { email, password } = request.body;
  const query = `select id, firstName, lastName, phoneNumber, isDeleted from user where email = ? and password = ?`;
  const encryptedPassword = String(crypto.SHA256(password));

  db.pool.execute(query, [email, encryptedPassword], (error, users) => {
    if (error) {
      response.send(utils.createErrorResult(error));
    } else {
      if (users.length == 0) {
        response.send(utils.createErrorResult("user does not exists"));
      } else {
        const user = users[0];
        // check if user is deleted
        if (user["isDeleted"] == 1) {
          response.send(
            utils.createErrorResult("you have closed your account.")
          );
        } else {
          console.log(user);
          response.send(utils.createSuccessResult(user));
        }
      }
    }
  });
});

// delete user
router.delete("/:id", (request, response)=>{
    const {id} = request.params
    const query = `update user set isDeleted = 1 where id = ?`

    db.pool.execute(query, [id], (error, result)=>{
        response.send(utils.createResult(error, result))
    })
})

module.exports = router;
