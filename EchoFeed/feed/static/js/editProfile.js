$(document).ready(function(){
    $('#edit-profile').click(function(e){
        e.preventDefault();
        let formData = new FormData($('#edit-profile-form')[0]);
        $.ajax({
            url: updateProfileUrl,
            type: 'POST',
            data: formData,
            processData: false,      // Don't process the data (important for file uploads)
            contentType: false,
            success: function(res){
                console.log(res);
            }
        });
    });
});