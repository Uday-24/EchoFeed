$(document).ready(function () {

    function showSearchResults(results) {
        resultHtml = '';

        results.res.forEach(element => {
            resultHtml += `
            <a href="/user_profile/${element.user__username}">
                <div class="search-result">
                    <div class="user-details">
                        <div class="user-image">
                            <img src="/media/${element.profile_image}" alt="">
                        </div>
                        <div class="other-detail">
                            <p>${element.user__username}</p>
                            <p>${element.nickname || ''}</p>
                        </div>
                    </div>
                </div>
            </a>`;
        });

        return resultHtml;
    }
    // Open the modal
    $('#openSearchModal').on('click', function () {
        $('#searchModal').fadeIn();
    });

    $('#openSearchModal2').on('click', function () {
        $('#searchModal').fadeIn();
    });

    // Close the modal
    $('#closeSearchModal').on('click', function () {
        $('#searchModal').fadeOut();
    });

    // Close modal when clicking outside
    $(window).on('click', function (e) {
        if ($(e.target).is('#searchModal')) {
            $('#searchModal').fadeOut();
        }
    });

    // Search bar functionality
    let debounceTimer;

    $('#searchInput').on('keyup', function () {
        const query = $(this).val().toLowerCase();

        clearTimeout(debounceTimer); // Clear the previous timer

        if (query !== '') {
            debounceTimer = setTimeout(() => {
                $.ajax({
                    url: searchUrl,
                    type: 'GET',
                    data: { 'query': query },
                    success: function (res) {
                        if(res.no_record_found){
                            $('#searchResults').show();
                            $('#searchResults').html("No records found");
                            $('.search-all-results').hide();
                        }else{
                            $('#searchResults').hide();
                            $('.search-all-results').show();
                            $('.search-all-results').html(showSearchResults(res));
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('An error occurred:', error);
                    }
                });
            }, 300);
        }
    });

});