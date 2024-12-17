function handleFollowUnfollow(URL, username, callback) {
    $.ajax({
        url: URL,
        type: 'POST',
        data: {
            'following': username,
        },
        success: function (res) {
            if (res && res.success === true) {
                callback(1);
            } 
            else if (res && res.success === false) {
                callback(0);
            } 
            else {
                callback(0);
            }
        }
    });
}
