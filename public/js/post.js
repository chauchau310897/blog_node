function Post(){
    function bindEvent(){
        $(".post_edit").click(function(event){
            var params = {
                id: $(".id").val(),
                title: $(".title").val(),
                content: tinymce.get("content").getContent(),
                author: $(".author").val()
            };

            var base_url = location.protocol + "//" + document.domain + ":" + location.port;

            $.ajax({
                url: base_url + "/admin/post/edit",
                type: "PUT",
                data: params,
                dataType: "json",
                success: function(response){
                    if(response && response.status_code == 200){
                        location.reload();
                    }
                }
            });
        });

        $(".post_delete").click(function(event){
            var post_id = $(this).attr("post_id");
            var base_url = location.protocol + "//" + document.domain + ":" + location.port;
            $.ajax({
                url: base_url + "/admin/post/delete",
                type: "DELETE",
                data: {post_id: post_id},
                dataType: "json",
                success: function(response){
                    if(response && response.status_code == 200){
                        location.reload();
                    }
                }
            });
        });
    }
    bindEvent();
}

$(document).ready(function(){
    new Post();
});