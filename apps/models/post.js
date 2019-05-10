var q = require("q");
var db = require("../common/database.js");

var conn = db.getConnection();

function getAllPost(){
    var defer = q.defer();
    
     var query = conn.query('SELECT * FROM posts', function (error, posts) {
       if (error){
         defer.reject(error);
       }
       else{
         defer.resolve(posts);
       }
       // Neat!
     });
     return defer.promise;
}

function addPost(post){
    if(post){
        var defer = q.defer();
        
         var query = conn.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
           if (error){
             defer.reject(error);
           }
           else{
             defer.resolve(results);
           }
           // Neat!
         });
         return defer.promise;
    }
    return false;    

}

function getPostById(id){
   var defer = q.defer();
  
   var query = conn.query('SELECT * FROM posts WHERE ?', {id: id} , function (error, posts) {
     if (error){
       defer.reject(error);
     }
     else{
       defer.resolve(posts);
     }
     // Neat!
   });
   return defer.promise;
}

function updatePost(params){
  if(params){
     var defer = q.defer();
    
     var query = conn.query('UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?', [params.title, params.content, params.author, new Date(), params.id] , function (error, posts) {
       if (error){
         defer.reject(error);
       }
       else{
         defer.resolve(posts);
       }
       // Neat!
     });
     return defer.promise;
  }
  return false;
}

function deletePost(post_id){
  if(post_id){
    var defer = q.defer();
   
    var query = conn.query('DELETE FROM posts WHERE id = ?', [post_id] , function (error, posts) {
      if (error){
        defer.reject(error);
      }
      else{
        defer.resolve(posts);
      }
      // Neat!
    });
    return defer.promise;
 }
  return false;
}

module.exports = {
    getAllPost : getAllPost,
    addPost : addPost,
    getPostById: getPostById,
    updatePost: updatePost,
    deletePost: deletePost
}