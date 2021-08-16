var express = require("express");
var router = express.Router();
var database = require("../db");
var bcrpyt = require("bcryptjs");
var jwt = require("jsonwebtoken");
/**Given the request, the server should return an HTML page 
 * that contains an HTML form with at least two input fields, 
 * username and password.
 * 
 * 
 * 
 * ~Done: case 1: without redirect, username & password right : code: 200, succeed
    ~Done: case 2: without redirect, username & password wrong : code: 401, back to login page with username & password
   ~ Done:case 3: with redirect, username & password right : redirect to the url(value of redirect)
    ~Done:case 4: with redirect, username & password wrong : code: 401, back to login page with username & password filled, also redirect remains set
 */
router.get("/", (req, res) => {
  let redirect = req.query.redirect;
  // console.log(redirect);
  res.render("login", {
    redirect: redirect,
  });
});

router.post("/", (req, res) => {
  //these fields are stored in a request's body b/c POST method.
  let redirect = req.body.redirect;
  let user = req.body.username;
  let password = req.body.password;

  /**
   * Right now I have gotten the login form to send the information in the
   * request body. I now need to implement logic to check if it matches.
   * Dont forget to make a check if redirect exists. If its not then it'll be empty string.
   */
  console.log(
    "Redirect:" + redirect + "User: " + user + "Password: " + password
  );
  let mongo_db = database.get("BlogServer");
  let query = { username: user };
  mongo_db
    .collection("Users")
    .findOne(query)
    .then((result) => {
      if (result == undefined || result.length == 0) {
        //piazza post @243, when we have no matching username 4o1.
        res.sendStatus(401);
      } else {
        let db_pw = result.password;
        let db_user = result.username;
        console.log(db_pw);

        bcrpyt.compare(password, db_pw, (err, ismatch) => {
          if (err) {
            console.log("There was an error!");
            console.log(err);
          }
          if (ismatch) {
            //Password matched.
            //send JWT
            //redirect logic or 200
            console.log("password matched");
            //build the items needed for token
            let options = { algorithm: "HS256" };
            let secret_key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
            let now = new Date();
            now = now.setHours(now.getHours() + 2);
            let expiration = now / 1000; //2 hours from now in seconds
            let payload = {
              exp: expiration,
              usr: db_user,
            };
            let token = jwt.sign(payload, secret_key, options);
            res.cookie("jwt", token);
            //set the cookie now check redirect logic.
            if (redirect) {
              //do the redirect
              res.redirect(redirect);
            } else {
              //no redirect just send a message
              res.status(200);
              res.send("Authenticatîon successful");
            }
          } else {
            //Password did not match.
            console.log("did not match password");

            res.status(401);

            res.render("filled_login", {
              redirect: redirect,
              username: db_user,
              password: password,
            });
          }
        });
      }
    });
});
module.exports = router;
