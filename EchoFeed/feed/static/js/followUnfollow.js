$(document).ready(function () {
    $.ajaxSetup({
        headers: { "X-CSRFToken": csrfToken }
    });

    $(document).on('click', '#followBtn', function (e) {

        e.preventDefault();
        let username = $('#profileUsername').text().trim();
        handleFollowUnfollow(followUrl, username, function (res) {
            if (res == 1) {
                $('#followBtn').hide();
                $('.unfollow-btn').show();
                let follower = parseInt($('.info-div span.show-follower').text(), 10);
                $('.info-div span.show-follower').text(follower + 1);
            }
        });
    });

    $(document).on('click', '.unfollow-btn', function (e) {
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
                        $('#followBtn').show();
                        $('.unfollow-btn').hide();
                        let follower = parseInt($('.info-div span.show-follower').text(), 10);
                        $('.info-div span.show-follower').text(follower - 1);
                    }
                });
            }
        });
    });

});