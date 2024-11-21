function showAlert(errors) {
    alertMessage = '';
    for (let error in errors) {
        let capitalizedError = error.charAt(0).toUpperCase() + error.slice(1);
        alertMessage += `
            <h4>${capitalizedError}</h4>
            <p>${errors[error][0]}</p>
            `
    }
    $('#alertBox').html(alertMessage)
        .slideDown(300)
        .addClass('show')
        .delay(3000)
        .queue(function (next) {
            $(this).slideUp(300);
            next();
        })
        .delay(500)
        .queue(function (next) {
            $(this).css('display', 'none');
            next();
        });
}