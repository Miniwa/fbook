$(document).ready(() => {
    getFriends().then((friends) => {
        $.each(friends, (i, friend) => {
            $(".fbook-friends").append(buildProfileLink(friend));
        });
    });
    updatePosts();

    $(".fbook-post-comment").click(() => {
        let comment = $("#comment").val();
        createOwnPost(comment).then(() => {
            $("#comment").val("");
            updatePosts();
        }).catch((err) => {
            console.log("Could not post comment:", err);
        });
    });
});

function updatePosts() {
    $(".fbook-messages").empty();
    getOwnReceivedPosts().then((posts) => {
        $.each(posts, (i, post) => {
            $(".fbook-messages").append(buildPost(post));
        });
    });
}
