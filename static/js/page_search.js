$(document).ready(() => {
    $(".fbook-search").click(() => {
        let query = $("#query").val();
        searchUsers(query).then((users) => {
            $(".fbook-search-result").empty();
            $.each(users, (i, user) => {
                let result = buildSearchResult(user, () => {
                    addFriend(user._id).then(() => {
                        console.log("Added friend");
                        result.remove();
                    }).catch((err) => {
                        console.err(err);
                    });
                });
                $(".fbook-search-result").append(result);
            });
        });
    });
});
