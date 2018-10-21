$(document).ready(() => {
    $(".fbook-search").click((event) => {
        event.preventDefault();
        let query = $("#query").val();

        searchUsers(query).then((users) => {
            $(".fbook-search-result").empty();
            $.each(users, (i, user) => {
                let result = buildSearchResult(user, () => {
                    addFriend(user._id).then(() => {
                        result.remove();
                    }).catch((err) => {
                        showError("Could not add friend.");
                    });
                });
                $(".fbook-search-result").append(result);
            });
        });
    });
});
