$(document).ready(function(){
    $('#edit-profile').click(function(e){
    $('#loader').show();
        e.preventDefault();
        let formData = new FormData($('#edit-profile-form')[0]);
        $.ajax({
            url: updateProfileUrl,
            type: 'POST',
            data: formData,
            processData: false,      // Don't process the data (important for file uploads)
            contentType: false,
            success: function(res){
                $('#loader').hide();
                $('#editProfileModal').hide();
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