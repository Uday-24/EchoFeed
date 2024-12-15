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

function fetchPostDetails(postId, postImgSrc) {
    // Show the loader
    $('#loader').show();

    // Set the post image in the modal
    $('#postModal').css('visibility', 'visible');
    $('#postModal .post-image img').attr('src', postImgSrc);

    // Make the AJAX request
    $.ajax({
        url: showPost, // URL defined in your backend
        type: 'GET',
        data: { 'id': postId },
        success: function (res) {
            // Update user details
            $('.details .user-image img').attr('src', res.profile_image);
            $('.details .other-detail a').text(res.username);
            $('.details .other-detail a').attr('href', `http://127.0.0.1:8000/user_profile/${res.username}`);
            $('p#profileUsername').text(res.username);

            // Update like count
            $('.like-count strong').text(res.likes);

            // Update follow button
            if (res.follows) {
                $('.other-detail button.follow').attr('id', 'unfollowBtn').text('Unfollow');
            } else {
                $('.other-detail button.follow').attr('id', 'followBtn').text('Follow');
            }

            // Update like/unlike buttons
            if (res.is_liked) {
                $('.like-button').hide();
                $('.unlike-button').fadeIn();
            } else {
                $('.unlike-button').hide();
                $('.like-button').fadeIn();
            }

            // Render comments
            const commentHtml = showComments(res.comments, res.caption);
            $('.comments').html(commentHtml);

            // Hide the loader
            $('#loader').hide();
        }
    });
}

// Event listener for post image click
$('.post-img').on('click', function () {
    const postId = $(this).attr('id');
    const postImgSrc = $(this).attr('src');
    
    // Call the function to fetch post details
    fetchPostDetails(postId, postImgSrc);
});



$(document).ready(function () {
    $('.unlike-button').hide();
    // When a post is clicked
    var uname = ''
    var postId = 0

    $('.post-img').on('click', function () {
        const postId = $(this).attr('id');
        const postImgSrc = $(this).attr('src');
    
        // Call the function to fetch post details
        fetchPostDetails(postId, postImgSrc);
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
