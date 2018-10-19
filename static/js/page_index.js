$(document).ready(() => {
    getOwnFriends().then((friends) => {
        $.each(friends, (i, friend) => {
            $(".fbook-friends").append(buildProfileLink(friend));
        });
    }).catch((err) => {
        console.error("Could not fetch friends:", err);
    });

    updatePosts();

    $(".fbook-post-comment").click(() => {
        if(!$(".fbook-comment-form")[0].checkValidity()) {
            return;
        }

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
    }).catch((err) => {
        console.error("Could not fetch posts:", err);
    });
}
