$(document).ready(function () {
    $('.loader').hide();
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // CSRF token setup for AJAX
    $.ajaxSetup({
        headers: { "X-CSRFToken": csrfToken }
    });

    // var usernameOnChange = ''
    $('#submit').click(function (e) {
        e.preventDefault()
        let username = $('#id_username').val().trim();
        let email = $('#id_email').val().trim();
        let password = $('#id_password').val().trim();
        let cPassword = $('#id_confirm_password').val().trim();
        $('.loader').show();
        $.ajax({
            url: registerUrl,
            type: 'POST',
            data: {
                'username': username,
                'email': email,
                'password': password,
                'confirm_password': cPassword,
            },
            success: function (res) {
                if (res.go_ahed) {
                    $('.loader').hide();
                    window.location.href = verifyOtpUrl
                } else if (res.username_is_long) {
                    $('.loader').hide();
                    $('#username-label').text("Your username should be less than or equal to 15 charaters");
                } else {
                    $('.loader').hide();
                    let errors = res.errors;
                    showAlert(errors)
                }
            }
        });
    });

    

    $('#id_email').blur(function (e) {
        let email = e.target.value.trim();
        if (email) {
            $.ajax({
                url: checkEmailUrl,
                type: 'GET',
                data: {
                    'email': email,
                },
                success: function (res) {
                    if (res.exists) {
                        $('#email-label').text("This email already regestered.");
                    } else {
                        if (emailPattern.test(email)) {
                            // $('#message').text('Valid email address').css('color', 'green');
                            $('#email-label').text("Email Verified.");
                        } else {
                            // $('#message').text('Invalid email address').css('color', 'red');
                            $('#email-label').text("This is invalid email.");
                        }
                    }
                }
            });
        }
    });

    $('#login-form').slideUp();
    $('#sign-in-switch').click(function () {
        $('#login-form').slideDown();
        $('#register-form').slideUp();
        $(this).addClass("btn-active");
        $('#sign-up-switch').removeClass("btn-active");
    });
    $('#sign-up-switch').click(function () {
        $('#login-form').slideUp();
        $('#register-form').slideDown();
        $(this).addClass("btn-active");
        $('#sign-in-switch').removeClass("btn-active");
    });

});