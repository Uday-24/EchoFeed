$(document).ready(function () {
    // Open modal
    $('#openModal').on('click', function () {
        $('#uploadModal').fadeIn();
    });

    // Close modal
    $('#closeModal').on('click', function () {
        $('#uploadModal').fadeOut();
    });

    // Close modal when clicking outside
    $(window).on('click', function (e) {
        if ($(e.target).is('#uploadModal')) {
            $('#uploadModal').fadeOut();
        }
    });

    // Image preview functionality
    $('#postImage').on('change', function () {
        const file = this.files[0];
        const reader = new FileReader();

        if (file) {
            reader.onload = function (e) {
                $('#imagePreview').html(`<img src="${e.target.result}" alt="Image Preview">`);
            };
            reader.readAsDataURL(file);
        } else {
            $('#imagePreview').html('Image preview will appear here');
        }
    });

    // Form submission
    $('#uploadForm').on('submit', function (e) {
        e.preventDefault();
        let formData = new FormData($('#uploadForm')[0]);
        $('#loader').show();
        
        $.ajax({
            url: uploadPostUrl,
            type: 'POST',
            data: formData,
            processData: false,      // Don't process the data (important for file uploads)
            contentType: false,
            success: function(res){
                if(res.success){
                    $('#loader').hide();
                    $('#uploadModal').fadeOut();
                    location.reload();
                }
            }
        });
    });
});