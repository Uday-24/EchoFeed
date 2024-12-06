function handleFollowUnfollow(URL, username, callback) {
    $.ajax({
        url: URL,
        type: 'POST',
        data: {
            'following': username,
        },
        success: function (res) {
            if (res.success) {
                callback(1);
            }
            else {
                callback(0);
            }
        }
    });
}
