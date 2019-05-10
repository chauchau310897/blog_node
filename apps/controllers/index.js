var express = require("express");

var router = express.Router();

router.use("/admin", require(__dirname + "/admin.js"));
router.use("/blog", require(__dirname + "/blog.js"));

router.get("/", function(request, response){
    //response.json({'message': 'This is homepage'});
    response.render("demo");
});

router.get("/chat", function(request, response){
    response.render("chat");
});

module.exports = router;