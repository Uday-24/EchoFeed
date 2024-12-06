
$(document).ready(function () {
    // When a post is clicked
    var uname = ''
    $('.post-img').on('click', function(){
        var postId = $(this).attr('id');
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
                if(res.follows){
                    $('.other-detail button.follow').attr('id', 'unfollowBtn');
                    $('.other-detail button.follow').text('Unfollow');
                }
                else{
                    $('.other-detail button.follow').attr('id', 'followBtn');
                    $('.other-detail button.follow').text('Follow');
                }

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
    
});
