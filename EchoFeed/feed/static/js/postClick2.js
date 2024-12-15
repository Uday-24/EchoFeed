function showComments(comments, caption) {
    if (caption) {
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

function fetchPostDetails(details) {
    $('#postModal').css('visibility', 'visible');
    $('.post-modal .post-image img').attr('src', details.imageSrc);
    $('.post-modal .other-detail a').text(details.username);
    $('.post-modal .other-detail a').attr('href', `http://127.0.0.1:8000/user_profile/${details.username}`);
    $('.post-modal .user-detail img').attr('src', details.profileImage);
    $('.post-modal .like-count strong').text(details.likeCount);

    if (details.is_liked) {
        $('.post-modal .like-button').hide();
        $('.post-modal .unlike-button').show();
    } else {
        $('.post-modal .unlike-button').hide();
        $('.post-modal .like-button').show();
    }

    $('.post-modal .post-image img').dblclick(function () {

        if ($(`.post-modal .like-button`).is(':visible')) {
            increse_like('.post-modal .like-count strong');
        }
        $('.post-modal .unlike-button').show();
        $('.post-modal .like-button').hide();

        if(details.from_index){
            if ($(`#like-btn-${details.postId}`).is(':visible')) {
                increse_like(`.like-count-${details.postId} strong`);
            }
            $(`#like-btn-${details.postId}`).hide();
            $(`#unlike-btn-${details.postId}`).show();
        }

        handleLikeUnlike(likeUrl, details.postId, function (res) {

        });
    });

    $('.post-modal .like-button').off('click').on('click', function () {
        $('.post-modal .unlike-button').show();
        $('.post-modal .like-button').hide();
        increse_like('.post-modal .like-count strong');

        if(details.from_index){
            if(details.from_index){
                increse_like(`.like-count-${details.postId} strong`);
                $(`#like-btn-${details.postId}`).hide();
                $(`#unlike-btn-${details.postId}`).show();
            }
        }

        handleLikeUnlike(likeUrl, details.postId, function (res) {

        });
    });

    $('.post-modal .unlike-button').off('click').on('click', function () {
        $('.post-modal .like-button').show();
        $('.post-modal .unlike-button').hide();
        decrese_like('.post-modal .like-count strong');

        if(details.from_index){
            if(details.from_index){
                decrese_like(`.like-count-${details.postId} strong`);
                $(`#like-btn-${details.postId}`).show();
                $(`#unlike-btn-${details.postId}`).hide();
            }
        }

        handleLikeUnlike(unlikeUrl, details.postId, function (res) {

        });
    });

    $.ajax({
        url: fetchComments,
        type: 'GET',
        data: {
            'post_id': details.postId,
        },
        success: function (res) {
            $('.post-modal .comments').html(showComments(res.comments))
        }
    });

    $('.post-modal .comment-button').off('click').on('click', function () {
        $('#commentTextarea').focus();
    });

    $('.post-modal .comment-submit-button').off('click').on('click', function () {

        let comment = $('#commentTextarea').val().trim();

        $('#commentTextarea').val('');
        if (comment != '') {
            $.ajax({
                url: submitCommentUrl,
                type: 'POST',
                data: {
                    'id': details.postId,
                    'comment': comment,
                },
                success: function (res) {
                    if (res.success == true) {
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
                        $('.post-modal .comments').prepend(newComment);
                    }
                }
            });
        }
    });

    $('.post-modal .follow').hide();
    $('.post-modal .unfollow').show();

    $('.post-modal .follow').click(function () {
        let following = details.username.trim();
        handleFollowUnfollow(followUrl, following, function (res) {
            $('.post-modal .follow').hide();
            $('.post-modal .unfollow').show();
        });
    });

    $('.post-modal .unfollow').click(function () {
        let following = details.username.trim();
        swal({
            title: "Unfollow",
            text: "Are you sure?",
            icon: "info",
            buttons: true,
        }).then((unfollow) => {
            if (unfollow) {
                let username = $('#profileUsername').text().trim();
                handleFollowUnfollow(unfollowUrl, following, function (res) {
                    if (res == 1) {
                        $('.post-modal .follow').show();
                        $('.post-modal .unfollow').hide();
                    }
                });
            }
        });
    });

    
}


function closePostModal() {

    $('#close-modal').click(function () {
        $('#postModal').css('visibility', 'hidden');
    });

    $(window).on('click', function (event) {
        if ($(event.target).is('#postModal')) {
            $('#postModal').css('visibility', 'hidden');
        }
    });
}


