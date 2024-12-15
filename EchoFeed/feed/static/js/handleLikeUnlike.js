function handleLikeUnlike(URL, postID, callback) {
    $.ajax({
        url: URL,
        type: 'POST',
        data: {
            'id': postID,
        },
        success: function (res) {
            if (res.success) {
                callback(1);
            }
            else {
                callback(0);
            }
        }
    });
}

function increse_like(selector){
    let likes = parseInt($(selector).text(), 10);
    
    likes++;
    $(selector).text(likes);
}

function decrese_like(selector){
    let likes = parseInt($(selector).text(), 10);
    
    likes--;
    if(likes >= 0){
        $(selector).text(likes);
    }
    else{
        $(selector).text(0);
    }
}