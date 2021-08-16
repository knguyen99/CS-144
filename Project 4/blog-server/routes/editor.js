var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var secret_key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";

//handle editor
router.get("*", (req, res, next) => {
  if(req.cookies.jwt){
  	var error;
  	let jwt_exp;
  	jwt.verify(req.cookies.jwt, secret_key, (err, results) => {
  		error = err;
  		if(results)
  			jwt_exp = results.exp;
      else
        error = true;
  	});
  	if(error)
  		res.redirect('/login?redirect=/editor/');
  	else if(jwt_exp*1000 <= Date.now())
  		res.redirect('/login?redirect=/editor/');
  	else
  		next();

  }
  else{
    res.redirect('/login?redirect=/editor/');
  }
});

module.exports = router;