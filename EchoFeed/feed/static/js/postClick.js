function showComments(comments, caption){
    if(caption){
        console.log(caption);
    }

    let html = '';
    comments.forEach(comment => {
        html += `<div class="user-detail">
                <div class="user-image">
                    <img src="${comment.profile_image}" alt="">
                </div>
                <div class="other-detail">
                    <strong><a href="/user_profile/${comment.username}">${comment.username}</a></strong>
                    <div class="comment">
                    ${comment.comment}
                    </div>
                </div>
            </div>`;
    }); 
    return html;
}


$(document).ready(function () {
    $('.unlike-button').hide();
    // When a post is clicked
    var uname = ''
    var postId = 0
    $('.post-img').on('click', function(){
        $('#loader').show();
        postId = $(this).attr('id');
        var postImgSrc = $(this).attr('src');
        $('#postModal').css('visibility', 'visible');
        $('#postModal .post-image img').attr('src', postImgSrc);

        $.ajax({
            url: showPost,
            type: 'GET',
            data: {
                'id': postId,
            },
            success: function(res){
                uname = res.username;
                
                $('.details .user-image img').attr('src', res.profile_image);
                $('.details .other-detail a').text(res.username);
                $('.details .other-detail a').attr('href', `http://127.0.0.1:8000/user_profile/${res.username}`);
                $('p#profileUsername').text(res.username);
                $('.like-count strong').text(res.likes);

                if(res.follows){
                    $('.other-detail button.follow').attr('id', 'unfollowBtn');
                    $('.other-detail button.follow').text('Unfollow');
                }
                else{
                    $('.other-detail button.follow').attr('id', 'followBtn');
                    $('.other-detail button.follow').text('Follow');
                }

                if(res.is_liked){
                    $('.like-button').hide();
                    $('.unlike-button').fadeIn();
                }else{
                    $('.unlike-button').hide();
                    $('.like-button').fadeIn();
                }

                commentHtml = showComments(res.comments, res.caption);
                $('.comments').html(commentHtml);
                $('#loader').hide();
            }
        });
    });
    
    $('#close-modal').click(function(){
        $('#postModal').css('visibility', 'hidden');
    });
    
    $(window).on('click', function (event) {
        if ($(event.target).is('#postModal')) {
            $('#postModal').css('visibility', 'hidden');
        }
    });

    $(document).on('click', '#followBtn', function(e){
        let username = uname;
        handleFollowUnfollow(followUrl, username, function(res){
            if(res==1){
                $('.other-detail button.follow').attr('id', 'unfollowBtn');
                $('.other-detail button.follow').text('Unfollow');
            }
        });      
    });

    $(document).on('click', '#unfollowBtn', function(e){
        swal({
            title: "Unfollow",
            text: "Are you sure?",
            icon: "info",
            buttons: true,
        }).then((unfollow) => {
            if (unfollow) {
                let username = $('#profileUsername').text().trim();
                handleFollowUnfollow(unfollowUrl, username, function (res) {
                    if (res == 1) {
                        $('.other-detail button.follow').attr('id', 'followBtn');
                        $('.other-detail button.follow').text('Follow');
                    }
                });
            }
        });
    });
    

    // Like on double click
    $('.post-image').dblclick(function(e){
        if($('.like-button').is(':visible')){
            increse_like('.like-count strong');
        }
        $('.like-button').hide();
        $('.unlike-button').fadeIn();
        
        handleLikeUnlike(likeUrl, postId, function(res){
            console.log(res);
        });
    });
    
    $('.like-button').click(function(e){
        $('.like-button').hide();
        $('.unlike-button').fadeIn();
        increse_like('.like-count strong');
        handleLikeUnlike(likeUrl, postId, function(res){
            console.log(res);
        });
    });

    $('.unlike-button').click(function(e){
        $('.unlike-button').hide();
        $('.like-button').fadeIn();
        decrese_like('.like-count strong');
        handleLikeUnlike(unlikeUrl, postId, function(res){
            console.log(res);
        });
    });

    $('.comment-button').click(function(){
        $('#commentTextarea').focus();
    });

    $('.comment-submit-button').click(function(){
        let comment = $('#commentTextarea').val().trim();
        $('#commentTextarea').val('');
        if (comment != ''){
            $.ajax({
                url: submitCommentUrl,
                type: 'POST',
            data:{
                'id': postId,
                'comment': comment,
            },
            success: function(res){
                if(res.success == true){
                    let newComment = `<div class="user-detail">
                        <div class="user-image">
                            <img src="${res.profile_image}" alt="">
                            </div>
                            <div class="other-detail">
                            <strong><a href="/user_profile/${res.username}">${res.username}</a></strong>
                            <div class="comment">
                            ${comment}
                            </div>
                        </div>
                        </div>`;
                        $('.comments').prepend(newComment);
                    }   
                }
            });
        }
    });
});
