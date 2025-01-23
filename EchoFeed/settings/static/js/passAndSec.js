$(document).ready(function () {
    $('.2fa-option').click(function (e) {
        $('#2fa-modal').fadeIn();
    });
    
    $('.close-btn').click(function () {
        $('#2fa-modal').fadeOut();
    });

    $(window).on('click', function (e) {
        if ($(e.target).is('#2fa-modal')) {
            $('#2fa-modal').fadeOut();
        }
    });

    $('#toggle').change(function (e) {

        let checkbox = $(this);
        e.preventDefault();

        if ($(this).is(':checked')) {
            swal({
                title: "Enable Two-Factor Authentication?",
                text: "Once enabled, you will need to verify your identity with an additional step during login.",
                icon: "info",
                buttons: ["Cancel", "Enable"],
                dangerMode: false,
            })
            .then((willEnable) => {
                if (willEnable) {
                    checkbox.prop('checked', true);
                    handle2fa(1);

                } else {
                    checkbox.prop('checked', false);
                }
            });
            
        }
        else {
            swal({
                title: "Disable Two-Factor Authentication?",
                text: "Once disabled, you will not need to verify your identity with an additional step during login.",
                icon: "info",
                buttons: ["Cancel", "Disable"],
                dangerMode: false,
            })
            .then((willDisable) => {
                if (willDisable) {
                    checkbox.prop('checked', false);
                    handle2fa(0);
                } else {
                    checkbox.prop('checked', true);
                }
            });
        }
    });
});