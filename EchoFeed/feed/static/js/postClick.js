
$(document).ready(function () {
    // When a post is clicked
    $('.post').on('click', function () {
        var postId = $(this).attr('id'); // Get post ID
        var postImgSrc = $(this).find('img').attr('src'); // Get image URL

        // Update modal content
        $('#modalImage').attr('src', postImgSrc);
        $('#modalText').text("Post ID: " + postId);

        // Show the modal
        $('#postModal').fadeIn();
    });

    // Close the modal
    $('.close').on('click', function () {
        $('#postModal').fadeOut();
    });

    // Close modal on outside click
    $(window).on('click', function (event) {
        if ($(event.target).is('#postModal')) {
            $('#postModal').fadeOut();
        }
    });
});
