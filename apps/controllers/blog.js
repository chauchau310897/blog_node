var express = require("express");

var router = express.Router();

var post_md = require("../models/post");

router.get("/", function(request, response){
    //response.json({'message': 'This is Blog page'});
    var data = post_md.getAllPost();
    data.then(function(results){
        var data = {
            posts : results,
            error : false
        };
        response.render("blog/index", {data: data});
    }).catch(function(error){
        var data = {
            error: "Could not find any post"
        };
        response.render("blog/index", {data: data});
    });

    //response.render("blog/index");
});

router.get("/post/:id", function(request, response){
    var data = post_md.getPostById(request.params.id);

    data.then(function(results){
        var result = results[0];
        var data = {
            post : result,
            error : false
        };
        response.render("blog/post", {data: data});
    }).catch(function(error){
        var data = {
            error : "Could not find this post"
        };
        response.render("blog/post", {data: data});
    });
});

router.get("/about", function(request, response){
    response.render("blog/about");
});

module.exports = router;