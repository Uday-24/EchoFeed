$(document).ready(function(){

    $('#bio-input').on('input', function() {
        let charCount = $(this).val().length;
        $('#char-count').text(charCount);
    });

    $('.save-profile-btn').click(function(){
        let formData = new FormData();

        // Get form data
        let username = $('#username').val().trim();
        let nickname = $('#nickname').val().trim();
        let bio = $('#bio-input').val().trim();
        let gender = $('#gender').val();
        let profileImg = $('#file-input')[0].files[0]; // Get the selected file

        // Append data to FormData
        formData.append('username', username);
        formData.append('nickname', nickname);
        formData.append('bio', bio);
        formData.append('gender', gender);
        
        if (profileImg) {
            formData.append('profile_image', profileImg); // Append file
        }


        $.ajax({
            url: updateProfileUrl,
            type: 'POST',
            data: formData,
            processData: false,      // Don't process the data (important for file uploads)
            contentType: false,
            success: function(res){
                $('#loader').hide();
                $('#editProfileModal').addClass('hidden');
                if(res.long_username){
                    error = {
                        'Long Username': ['Your username should be less than or equal to 15 charaters']
                    }
                    showAlert(error)
                }
                else if(res.long_bio){
                    error = {
                        'Long Bio': ['Your Bio should be less than or equal to 250 charaters']
                    }
                    showAlert(error)
                }
                else if(res.long_nickname){
                    error = {
                        'Long Nickname': ['Your Nickname should be less than or equal to 15 charaters']
                    }
                    showAlert(error)
                }
                else if(res.username_taken){
                    error = {
                        'Taken Username': ['User with this username is already exists']
                    }
                    showAlert(error)
                }
                else if(res.success){
                    error = {
                        'Success': ['Profile has been updated successfull']
                    }
                    showAlert(error)
                }
                else{
                    error = {
                        'Invalid Request': ['This is invalid request']
                    }
                    showAlert(error)
                }
            }
        });
    });
});