function handle2fa(message){
    $.ajax({
        type: "POST",
        url: url2faAndPrivate,
        data: {
            'message':message,
        },
        success: function (res) {
            console.log(res);
        }
    });
}