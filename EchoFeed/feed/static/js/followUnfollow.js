$(document).ready(function () {
    $.ajaxSetup({
        headers: { "X-CSRFToken": csrfToken }
    });
    $('#followBtn').click(function (e) {
        e.preventDefault();
        let username = $('#profileUsername').text().trim();
        $.ajax({
            url: followUrl,
            type: 'POST',
            data: {
                'following': username,
            },
            success: function (res) {
                if (res.success) {
                    $('#followBtn').hide();
                    $('.unfollow-btn').show();
                    let follower = parseInt($('.info-div span.show-follower').text(), 10);
                    $('.info-div span.show-follower').text(follower+1)
                }
            }
        });
    });

    $('.unfollow-btn').click(function () {
        swal({
            title: "Unfollow",
            text: "Are you sure?",
            icon: "info",
            buttons: true,
        }).then((unfollow) => {
            if (unfollow) {
                let username = $('#profileUsername').text().trim();
                $.ajax({
                    url: unfollowUrl,
                    type: 'POST',
                    data: {
                        'following': username,
                    },
                    success: function (res) {
                        if (res.success) {
                            $('#followBtn').show();
                            $('.unfollow-btn').hide();    
                            let follower = parseInt($('.info-div span.show-follower').text(), 10);
                            $('.info-div span.show-follower').text(follower-1)
                        }
                    }
                });
            }
        });
    });
});