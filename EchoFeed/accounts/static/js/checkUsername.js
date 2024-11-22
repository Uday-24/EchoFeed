$(document).ready(function () {
    $('#id_username').keyup(function (event) {
        let username = event.target.value.trim();
        if (username) {
            $.ajax({
                url: checkUsernameUrl,
                type: 'GET',
                data: {
                    'username': username,
                },
                success: function (res) {
                    if (res.exists) {
                        $('#username-label').text("This username is taken. You are late bro!");
                    }
                    else {
                        if (username.length >= 21) {
                            $('#username-label').text("Username is too long!");
                        } else {
                            $('#username-label').text("Your username: " + username.toLowerCase());
                        }
                    }
                }
            });
        }
        else {
            $('#username-label').text("Username");
        }
    });
})