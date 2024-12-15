$(document).ready(function () {
    postId = 0
    $('.user-post img').off('dblclick').on('dblclick', function () {

        postId = parseInt($(this).closest('.post').attr('id'));

        if ($(`#like-btn-${postId}`).is(':visible')) {
            increse_like(`.like-count-${postId} strong`);
        }

        $(`#unlike-btn-${postId}`).show();
        $(`#like-btn-${postId}`).hide();

        handleLikeUnlike(likeUrl, postId, function (res) {
            console.log(res);
        });
    });

    $('.like-button').off('click').on('click', function () {

        postId = parseInt($(this).closest('.post').attr('id'));

        $(`#unlike-btn-${postId}`).show();
        $(`#like-btn-${postId}`).hide();
        increse_like(`.like-count-${postId} strong`);
        handleLikeUnlike(likeUrl, postId, function (res) {
            console.log(res, ' hello');
        });
    });

    $('.unlike-button').off('click').on('click', function () {
        postId = parseInt($(this).closest('.post').attr('id'));

        $(`#unlike-btn-${postId}`).hide();
        $(`#like-btn-${postId}`).show();
        decrese_like(`.like-count-${postId} strong`);
        handleLikeUnlike(unlikeUrl, postId, function (res) {
            console.log(res);
        });
    });

    $('.comment-button').off('click').on('click', function () {
        let postId = parseInt($(this).closest('.post').attr('id'));
        let username = $(this).closest('.post').find('.username span').text().trim();
        let imageSrc = $(this).closest('.post').find('.user-post img').attr('src');
        let profileImage = $(this).closest('.post').find('.user-details .image img').attr('src');
        let caption = $(this).closest('.post').find('.like-comment .comment').text().trim();
        let is_liked = true;
        if ($(`#like-btn-${postId}`).is(':visible')) {
            is_liked = false;
        }
        let likeCount = parseInt($(this).closest('.post').find(`.like-count-${postId} strong`).text().trim());
        let from_index = true
        
        let postDetails = {
            postId,
            username,
            imageSrc,
            profileImage,
            caption,
            is_liked,
            likeCount,
            from_index
        }
        fetchPostDetails(postDetails);
        
    });

    closePostModal();
});