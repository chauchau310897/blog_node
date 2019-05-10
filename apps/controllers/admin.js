var express = require("express");

var router = express.Router();

var user_md = require("../models/user");
var post_md = require("../models/post");

var helper = require("../helpers/helper");

router.get("/", function(request, response){
    if(request.session.user){
        //response.json({'message': 'This is Admin page'});
        var data = post_md.getAllPost();
        data.then(function(posts){
            var data = {
                posts: posts,
                error: false
            };

            response.render("admin/dashboard", {data: data});
        }).catch(function(errors){
            response.render("admin/dashboard", {data: {error: "Get posts is error"}});
        });
    }
    else{
        response.redirect("/admin/signin");
    }
    
});

router.get("/signup", function(request, response){
    response.render("signup", {data: {}});
});

router.post("/signup", function(request, response){
    var user =  request.body;
    if(user.email.trim().length === 0){
        response.render("signup", {data: {error: "Email is required"}});
    }
    if(user.passwd !== user.repasswd && user.passwd.trim().length !== 0){
        response.render("signup", {data: {error: "Password not match"}});
    }

    var hash_password = helper.hash_password(user.passwd);

    //Insert to db
    user = {
        email : user.email,
        password : hash_password,
        first_name : user.firstname,
        last_name : user.lastname
    }

    var result = user_md.addUser(user);

    result.then(function(data){
        // response.json({message:"Insert successfully"});
        response.redirect("/admin/signin");
    }).catch(function(error){
        response.render("signup", {data: {error: "Insert error"}});
    })

    // if(!result){
    //     response.render("signup", {data: {error: "Insert error"}});
    // }
    // else{
    //     response.json({message:"Insert successfully"});
    // }
    
});

router.get("/signin", function(request, response){
    response.render("signin", {data: {}});
});

router.post("/signin", function(request, response){
    var params = request.body;
    if(params.email.trim().length === 0){
        response.render("signin", {data: {error: "Please enter your email"}});
    }
    else{
        var data = user_md.getUserByEmail(params.email);
        console.log("Password là: "+params.password);
        if(data){
            data.then(function(users){
                var user = users[0];
                console.log("User là: "+user.password);
                var status = helper.compare_password(params.password, user.password);
                console.log("Status là: "+status);
                if(!status){
                    response.render("signin", {data: {error: "Password Incorrect"}});
                }
                else{
                    request.session.user = user;
                    console.log("Session là:"+request.session.user);
                    response.redirect("/admin/");
                }

            });
        }
        else{
            response.render("signin", {data: {error: "User not exists"}});
        }
    }
});

router.get("/post/new", function(request, response){
    if(request.session.user){
        response.render("admin/post/new", {data: {error: false}});
    }  
    else{
        response.redirect("/admin/signin");
    } 
    
});

router.post("/post/new", function(request, response){
    var params = request.body;

    if(params.title.trim().length === 0){
        var data = {
            error: "Please insert title"
        }
        response.render("admin/post/new", {data: data});
    }
    else{
        var now = new Date();
        params.created_at = now;
        params.updated_at = now;
        
        var data = post_md.addPost(params);
        data.then(function(result){
            response.redirect("/admin");
        }).catch(function(error){
            var data = {
                error: "Could not insert post"
            }
            response.render("admin/post/new", {data: data});
        });
    }
});

router.get("/post/edit/:id", function(request, response){
    if(request.session.user){
        var params = request.params;
        var id = params.id;
    
        var post_data = post_md.getPostById(id);
    
        if(post_data){
            post_data.then(function(posts){
                var post = posts[0];
                var data = {
                    post : post,
                    error : false
                };
                response.render("admin/post/edit", {data: data});
            }).catch(function(error){
                var data = {
                    error: "Could not get this post"
                };
                response.render("admin/post/edit", {data: data});
            });
        }
        else{
            var data = {
                error: "Could not get this post"
            };
            response.render("admin/post/edit", {data: data});
        }
    }
    else{
        response.redirect("/admin/signin");
    }
    
});

router.put("/post/edit", function(request, response){
    var params = request.body;
    var data = post_md.updatePost(params);
    if(!data){
        response.json({status_code: 500});
    }
    else{
        data.then(function(result){
            response.json({status_code: 200})
        }).catch(function(error){
            response.json({status_code: 500})
        });
    }
});

router.delete("/post/delete", function(request, response){
    var post_id = request.body.post_id;

    var data = post_md.deletePost(post_id);

    if(!data){
        response.json({status_code: 500});
    }
    else{
        data.then(function(result){
            response.json({status_code: 200})
        }).catch(function(error){
            response.json({status_code: 500})
        });
    }
});

router.get("/post", function(request, response){
    if(request.session.user){
        response.redirect("/admin");
    }
    else{
        response.redirect("/admin/signin");
    }
    
});

router.get("/user", function(request, response){
    if(request.session.user){
        var users = user_md.getAllUser();
        
        users.then(function(users){
            var data = {
                users: users,
                error: false
            };
            response.render("admin/user", {data: data});
        }).catch(function(error){
            response.render("admin/user", {data: {error: "Not have any user"}});
        });
    }
    else{
        response.redirect("/admin/signin");
    }
    
});

router.get("/logout", function(request, response){
    request.session.destroy();
    response.redirect("/admin/signin");
});

module.exports = router;