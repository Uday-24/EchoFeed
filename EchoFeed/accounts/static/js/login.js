$(document).ready(function(){

    $.ajaxSetup({
        headers: { "X-CSRFToken": csrfToken }
    });

    $("#submit-login").click(function(e){
        e.preventDefault();
        let username = $('#id_username_login').val().trim();
        let password = $('#id_password_login').val().trim();
        $('.loader').show();
        
        $.ajax({
            url: loginUrl,
            type: 'POST',
            data: {
                'username': username,
                'password': password,
            },
            success: function(res){
                // console.log(res);
                $('.loader').hide();
                if(res.blank_username){
                    error = {
                        "Username or Email": ["This field is required"]
                    }
                    showAlert(error);
                }else if(res.no_user_found){
                    error = {
                        "Username or Email": ["Given username or email does not exist"]
                    }
                    showAlert(error)
                }else{
                    error = {
                        "Invalid Password":[""]
                    }
                    showAlert(error)
                }
                if(res.success) {
                    // Handle successful login (you can redirect here)
                    window.location.href = "/";  // Use a default URL or the one provided by the server
                }
            }
        });
        
    });
});