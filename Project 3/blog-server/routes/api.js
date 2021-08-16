var express = require('express');
var router = express.Router();
var database = require("../db");
var jwt = require("jsonwebtoken");
var secret_key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";

router.get("/", (req, res) => {
	res.sendStatus(404);
});

//Retrieve all blog posts by username
router.get("/:username", (req,res) => {
	let a_username = req.params.username;

	//check jwt
	if(req.cookies.jwt){
		var error;
		var jwt_username;
		jwt.verify(req.cookies.jwt, secret_key, (err, results) => {
				error = err;
				if(results)
					jwt_username = results.usr;
		});
		if(error || jwt_username != a_username){
			res.sendStatus(401);
			return;
		}
	}
	else{
		res.sendStatus(401);
		return;
	}

	//set up access to database and query params
	let mongo_db = database.get("BlogServer");
	let query = { 
		username: a_username,
		postid: { $exists: true },
		body: { $exists: true },
		title: { $exists: true },
		created: { $exists: true },
		modified: { $exists: true }
	};

	//search in database
	mongo_db
		.collection("Posts")
		.find(query)
		.toArray()
		.then( (result) => {
			res.status(200).json(result);
		})
		.catch( (err) => {
			res.sendStatus(500);
		});
});

//Get blog post with username and id
router.get("/:username/:postid", (req,res) =>{
	let a_username = req.params.username;
	let a_postid = Number(req.params.postid);

	// check postid is integer
	if(!Number.isInteger(a_postid)){
		res.sendStatus(400);
	}
	else{
		//check jwt 
		if(req.cookies.jwt){
			var error;
			var jwt_username;
			jwt.verify(req.cookies.jwt, secret_key, (err, results) => {
					error = err;
					if(results)
						jwt_username = results.usr;
			});
			if(error || jwt_username != a_username){
				res.sendStatus(401);
				return;
			}
		}
		else{
			res.sendStatus(401);
			return;
		}

		//set up access to database and query parameters
		let mongo_db = database.get("BlogServer");
		let query = {
			username: a_username,
			postid: a_postid,
			body: { $exists: true },
			title: { $exists: true },
			created: { $exists: true },
			modified: { $exists: true }
		}

		// //search in database
		mongo_db
			.collection("Posts")
			.findOne(query)
			.then( (result ) => {
				if(result == undefined || result == []){
					res.sendStatus(404);
				}
				else{
					res.status(200).send(result);
				}
			})
			.catch( (err) => {
				res.sendStatus(500);
			});
	}
});

//create a new post with given username, postid, title, body
router.post("/:username/:postid", (req,res) => {
	let a_username = req.params.username;
	let a_postid = Number(req.params.postid);

	//check postid is integer / request body fields filled
	if(!Number.isInteger(a_postid) || !req.body.title || !req.body.body){
		res.sendStatus(400);
	}
	else{
		//check jwt
		if(req.cookies.jwt){
			var error;
			var jwt_username;
			jwt.verify(req.cookies.jwt, secret_key, (err, results) => {
					error = err;
					if(results)
						jwt_username = results.usr;
			});
			if(error || jwt_username != a_username){
				res.sendStatus(401);
				return;
			}
		}
		else{
			res.sendStatus(401);
			return;
		}

		//set up access to database, get current time
		let mongo_db = database.get("BlogServer");
		let date = new Date();
		let time = date.getTime();
		let find_query = {
			username: a_username,
			postid: a_postid,
		};

		let insert_query = {
			username: a_username,
			postid: a_postid,
			title: req.body.title,
			body: req.body.body,
			created: time,
			modified: time
		};

		//check if postid exists already
		mongo_db
			.collection("Posts")
			.countDocuments(find_query)
			.then((result) => {
				if(result != 0){
					res.sendStatus(400);
				}
				else{
					//return promise of inserting new post
					return mongo_db.collection("Posts")
						.insertOne(insert_query)
						.then( (result) => {
								res.sendStatus(201);
						});
				}
			})
			.catch( (err) => {
				res.sendStatus(500);
		});
	}
});

//edit post given username, postid, title, body
router.put("/:username/:postid", (req,res) => {
	let a_username = req.params.username;
	let a_postid = Number(req.params.postid);

	//check postid is number / request body fields filled
	if(!Number.isInteger(a_postid) || !req.body.title || !req.body.body){
		res.sendStatus(400);
	}
	else
	{
		//check jwt
		if(req.cookies.jwt){
			var error;
			var jwt_username;
			jwt.verify(req.cookies.jwt, secret_key, (err, results) => {
					error = err;
					if(results)
						jwt_username = results.usr;
			});
			if(error || jwt_username != a_username){
				res.sendStatus(401);
				return;
			}
		}
		else{
			res.sendStatus(401);
			return;
		}
		//set up access to database, get current time, set up queries
		let mongo_db = database.get("BlogServer");
		let date = new Date();
		let time = date.getTime();
		let find_query = {
			username: a_username,
			postid: a_postid,
		};

		let update_query = {
			$set: {
				modified: time,
				body: req.body.body,
				title: req.body.title
			}	
		};

		//check if postid exists already
		mongo_db
			.collection("Posts")
			.countDocuments(find_query)
			.then((result) => {
				if(result == 0){
					res.sendStatus(400);
				}
				else{
					//return promise of updating post
					return mongo_db
						.collection("Posts")
						.updateOne(find_query, update_query)
						.then( (result) => {
								res.sendStatus(200);
						});
				}
			})
			.catch( (err) => {
				res.sendStatus(500);
		});
	}
});

router.delete("/:username/:postid", (req,res) => {
	let a_username = req.params.username;
	let a_postid = Number(req.params.postid);

	//check postid is number / request body fields filled
	if(!Number.isInteger(a_postid)){
		res.sendStatus(400);
	}
	else
	{
		//check jwt
		if(req.cookies.jwt){
			var error;
			var jwt_username;
			jwt.verify(req.cookies.jwt, secret_key, (err, results) => {
					error = err;
					if(results)
						jwt_username = results.usr
			});
			if(error || jwt_username != a_username){
				res.sendStatus(401);
				return;
			}
		}
		else{
			res.sendStatus(401);
			return;
		}

		//set up access to database, set up queries
		let mongo_db = database.get("BlogServer");

		let query = {
			username: a_username,
			postid: a_postid
		};

		mongo_db
			.collection("Posts")
			.countDocuments(query)
			.then((result) => {
				if(result == 0){
					res.sendStatus(400);
				}
				else{
					//return promise of updating post
					return mongo_db
						.collection("Posts")
						.deleteOne(query)
						.then( (result) => {
								res.sendStatus(204);
						});
				}
			})
			.catch( (err) => {
				res.sendStatus(500);
		});
	}
});

module.exports = router;