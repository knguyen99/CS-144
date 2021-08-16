var express = require("express");
var commonmark = require("commonmark");
var router = express.Router();
var database = require("../db");
//commonmark.js
var reader = new commonmark.Parser();
var writer = new commonmark.HtmlRenderer();

/* 
  Return an HTML-formatted page that shows the blog post with postid written by username.
  
  To Do: Handle the optional start param
        Display creation times
  */

//just to handle this particular route  send a  404
router.get("/", (req, res) => {
  res.sendStatus(404);
});

router.get("/:username/:postid", (req, res) => {
  //get requests with this url accepted

  console.log(
    "--------------------Inside /blog/:username/:postid----------------"
  );
  let a_postid = Number(req.params.postid);
  let a_username = req.params.username;
  if (Number.isInteger(a_postid) == false) {
    res.sendStatus(400); //if postid not integer
  } else {
    var mongo_db = database.get("BlogServer");
    let query = { username: a_username, postid: a_postid };
    let posts = [];
    //promise stmt
    mongo_db
      .collection("Posts")
      .findOne(query)
      .then((result) => {
        if (result == undefined || result == []) {
          //couldnt find in db
          res.sendStatus(404);
        } else {
          //extract from result, body and title and amrkdown it.
          //then render it
          let converted_title = writer.render(reader.parse(result.title));
          let converted_body = writer.render(reader.parse(result.body));
          let creation = Date(result.created);
          let modified = Date(result.modified);
          let post = {
            title: converted_title,
            body: converted_body,
            creation: creation,
            modified: modified,
          };
          posts.push(post);
          res.render("blog", {
            username: a_username,
            next_postid: null,
            post_list: posts,
          });
        }
      })
      .catch((err) => {
        //something went wrong
        console.error("Failed to find document: " + err);
        res.sendStatus(404);
      });
  }
  //end of function
});

router.get("/:username", (req, res) => {
  console.log("--------------------Inside /blog/:username----------------");
  let a_username = req.params.username;
  let start = Number(req.query.start);
  let mongo_db = database.get("BlogServer");
  let query = { username: a_username };
  let posts = [];
  if (Number.isInteger(start) == false) {
    //This means no start specified
    console.log("------------------No Start parameter passed -------------");
    let next_page = null;
    mongo_db
      .collection("Posts")
      .find(query)
      .sort({ postid: 1 })
      .limit(6)
      .toArray()
      .then(function (result) /*This function processes the promise*/ {
        if (result == undefined || result.length == 0) {
          res.sendStatus(404); //No result in DB => 404 Response
        } else {
          if (result.length > 5) {
            //length more than 5, need to prep next page
            next_page = result[5].postid;
          }
          //visit all but the last (element at index 5)
          for (let i = 0; i < 5; i++) {
            //extract the title and body and commonmark it.
            if (typeof result[i] == "undefined") {
              //avoid accessing element that isnt there.
              break;
            }
            let converted_title = writer.render(reader.parse(result[i].title));
            let converted_body = writer.render(reader.parse(result[i].body));
            let creation = Date(result.created);
            let modified = Date(result.modified);
            let a_post = {
              title: converted_title,
              body: converted_body,
              creation: creation,
              modified: modified,
            };
            // add it to list Posts
            posts.push(a_post);
          }
          //render
          res.render("blog", {
            username: a_username,
            post_list: posts,
            next_postid: next_page,
          });
        }
      })
      .catch(function (e) {
        //catch promise
        console.log(e);
      });
  } else {
    console.log(
      "-------------Optional Start parameter passed and valid---------------"
    );

    let next_page = null;
    let start_query = { username: a_username, postid: { $gte: start } }; //@post 237
    //promise stmt
    mongo_db
      .collection("Posts")
      .find(start_query)
      .sort({ postid: 1 }) //enforce ascending order.
      .limit(6)
      .toArray()
      .then(function (result) {
        if (result == undefined || result.length == 0) {
          res.sendStatus(404); //No Result in the database => send 404 Response
        } else {
          if (result.length > 5) {
            next_page = result[5].postid;
          }
          for (let i = 0; i < 5; i++) {
            if (typeof result[i] == "undefined") {
              //avoid accessing element that isnt there.
              break;
            }
            let converted_title = writer.render(reader.parse(result[i].title));
            let converted_body = writer.render(reader.parse(result[i].body));
            let creation = Date(result.created);
            let modified = Date(result.modified);
            let a_post = {
              title: converted_title,
              body: converted_body,
              creation: creation,
              modified: modified,
            };

            posts.push(a_post);
          }
          //render
          res.render("blog", {
            username: a_username,
            post_list: posts,
            next_postid: next_page,
          });
        }
      })
      .catch(function (e) {
        //catch promise
        console.log(e);
      });
  }
});

module.exports = router;
