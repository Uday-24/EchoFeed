$(document).ready(function () { 
    const $modal = $("#followerModal");
    const $modalTitle = $("#followerModalTitle");
    const $modalList = $("#followerModalList");

    // Function to open modal
    function openModal(title, list) {
        $modalTitle.text(title);
        $modalList.empty();
        list.forEach(user => {
            $modalList.append(`
              <div class="follower-modal-item">
                <img src="${user.img}" alt="${user.username}">
                <div class="details">
                  <p><strong>@${user.username}</strong></p>
                  ${user.nickname ? `<p>${user.nickname}</p>` : ''}
                </div>
                <button>Follow</button>
              </div>
            `);
        });
        $modal.fadeIn();
    }
    

    // Event listeners
    $("#showFollowers").on("click", function () {
        let url = window.location.href
        let username = '';
        if(url.includes("user_profile")){
            username = url.split('/').pop().trim();
        }
        $.ajax({
            url: showFollow,
            type: 'GET',
            data: { request_type: 'follower_request', username: username },
            success: function(res){
                openModal("Followers", res.followers);
            }
        });
    });

    $("#showFollowing").on("click", function () {
        let url = window.location.href
        let username = '';
        if(url.includes("user_profile")){
            username = url.split('/').pop().trim();
        }
        $.ajax({
            url: showFollow,
            type: 'GET',
            data: { request_type: 'following_request', username: username },
            success: function(res){
                openModal("Followings", res.followings);
            }
        });
    });

    // Close modal
    $(".follower-modal-close, .follower-modal").on("click", function (e) {
        if (e.target === this) $modal.fadeOut();
    });
});