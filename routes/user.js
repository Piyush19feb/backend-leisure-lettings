const express = require("express");
const crypto = require("crypto-js");
const db = require("../db");
const utils = require("../utils");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mailer = require("../mailer");

const router = express.Router();

// Public: register user
router.post("/register", (request, response) => {
  const { firstName, lastName, email, password, phoneNumber } = request.body;

  const query = `INSERT INTO user (firstName, lastName, email, password, phoneNumber) VALUES (?,?,?,?,?);`;
  const hashedPassword = String(crypto.SHA256(password)); // why String() => because crypto.sha256() returns buffer

  db.pool.execute(
    query,
    [firstName, lastName, email, hashedPassword, phoneNumber],
    (error, result) => {
      if (error) {
        response.send(util.createErrorResult(error));
      } else {
        // send an email
        mailer.sendEmail(
          email,
          "Welcome to leisure-lettings app",
          `          <h3>Hi ${firstName},</h3>
          <br/>
          Thank you for registration...
          ..
          ..
          ..
          ..

          <br/>
          Thank you,
          leisure-lettings Team
        `,
          () => {
            response.send(
              utils.createSuccessResult("User Registered successfully !!")
            );
          }
        );
      }
    }
  );
});

// Public: login user
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
          // create payload for JWT token
          const payload = { id: user.id };

          // create token
          const token = jwt.sign(payload, config.secret);

          const customResp = {
            name: `${user.firstName} ${user.lastName}`,
            phone: user.phoneNumber,
            email,
            token,
          };
          response.send(utils.createSuccessResult(customResp));
        }
      }
    }
  });
});

// Protected: User Profile
router.get("/profile", (request, response) => {
  const statement = `select firstName, lastName, email, phoneNumber from user where id = ?`;

  db.pool.execute(statement, [request.userId], (error, users) => {
    if (error) {
      response.send(utils.createErrorResult(error));
    } else {
      if (users.length == 0) {
        response.send(utils.createErrorResult("User does not exists"));
      } else {
        response.send(utils.createSuccessResult(users[0]));
      }
    }
  });
});

// Protected: delete user
router.delete("/close", (request, response) => {
  const query = `update user set isDeleted = 1 where id = ?`;

  db.pool.execute(query, [request.userId], (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

// get all users
// router.get("/allusers", (request, response) => {
//   const query = `select * from user where isDeleted = 0`;
//   db.pool.execute(query, (error, users) => {
//     response.send(utils.createResult(error, users));
//   });
// });

module.exports = router;
