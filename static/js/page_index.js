$(document).ready(() => {
    getOwnFriends().then((friends) => {
        $.each(friends, (i, friend) => {
            $(".fbook-friends").append(buildProfileLink(friend));
        });
    }).catch((err) => {
        showError("Could not fetch friends.");
    });

    updatePosts();

    $(".fbook-post-comment").click((event) => {
        event.preventDefault();
        if(!$(".fbook-comment-form")[0].checkValidity()) {
            return;
        }

        let comment = $("#comment").val();
        createOwnPost(comment).then(() => {
            $("#comment").val("");
            updatePosts();
        }).catch((err) => {
            showError("Could not post comment.");
        });
    });
});

function updatePosts() {
    $(".fbook-messages").empty();
    getOwnReceivedPosts().then((posts) => {
        $.each(posts, (i, post) => {
            $(".fbook-messages").append(buildPost(post));
        });
    }).catch((err) => {
        showError("Could not fetch posts.");
    });
}
